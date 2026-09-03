/**
 * Sales Chat Router
 *
 * POST /api/sales-chat   – AI chat grounded in the Knowledge Pack
 * POST /api/sales-lead   – Capture a lead (name + email), persist to DB + email transcript
 * GET  /api/sales-leads  – Admin: list captured leads (requires ADMIN_LEADS_KEY header)
 *
 * The Knowledge Pack is loaded from /knowledge/*.md at server start and used as
 * a static system prompt so the AI is grounded in facts about EquiProfile.
 * If the AI service is not configured, a rule-based fallback answers the most
 * common questions from the Knowledge Pack without making network calls.
 */

import { Router } from "express";
import rateLimit from "express-rate-limit";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import crypto from "crypto";
import * as emailModule from "./email";
import { invokeLLM, isAIConfigured } from "./llm";
import { sanitizeHtml } from "./htmlEscape";
import { getDb } from "../db";
import { chatLeads } from "../../drizzle/schema";
import { eq, desc } from "drizzle-orm";

const router: Router = Router();

// ──────────────────────────────────────────────────────────
// Rate limiters
// ──────────────────────────────────────────────────────────

const chatLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 20, // 20 messages per minute per IP
  message: {
    error: "Too many requests",
    message: "Too many messages, please slow down.",
  },
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req, res, _next, options) => {
    res.status(options.statusCode).json(options.message);
  },
});

const leadLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // 5 lead submissions per 15 min per IP
  message: {
    error: "Too many requests",
    message: "Too many requests, please try again later.",
  },
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req, res, _next, options) => {
    res.status(options.statusCode).json(options.message);
  },
});

// ──────────────────────────────────────────────────────────
// Knowledge Pack loader
// ──────────────────────────────────────────────────────────

function loadKnowledgePack(): string {
  try {
    const __dirname = path.dirname(fileURLToPath(import.meta.url));
    // Walk up to project root, then into /knowledge
    const projectRoot = path.resolve(__dirname, "..", "..");
    const knowledgeDir = path.join(projectRoot, "knowledge");

    if (!fs.existsSync(knowledgeDir)) {
      return "";
    }

    const files = fs
      .readdirSync(knowledgeDir)
      .filter((f) => f.endsWith(".md"))
      .sort();

    return files
      .map((f) => fs.readFileSync(path.join(knowledgeDir, f), "utf-8"))
      .join("\n\n---\n\n");
  } catch (err) {
    console.warn("[SalesChat] Could not load knowledge pack:", err);
    return "";
  }
}

const KNOWLEDGE_PACK = loadKnowledgePack();

const SYSTEM_PROMPT = `You are the EquiProfile Sales & Product Assistant — a professional, knowledgeable guide for a cloud-based horse management platform. Your ONLY purpose is to help potential and existing customers learn about EquiProfile, its features, pricing, and guide them toward signing up or upgrading.

IMPORTANT RESTRICTION: You are a SALES and PRODUCT assistant ONLY. You must REFUSE to answer any questions that are NOT about EquiProfile, its features, pricing, trials, billing, or horse management as it relates to EquiProfile. If a user asks about unrelated topics (general knowledge, other products, personal advice, coding, math, etc.), politely decline and redirect: "I'm the EquiProfile assistant and can only help with questions about our horse management platform. How can I help you learn about EquiProfile?"

PLATFORM CAPABILITIES (use these as your reference — do not invent features):
- Horse profiles: health history, notes, documents, pedigree, breeding records
- Health tracking: vaccinations, dental care, hoof care, treatments, dewormings, X-rays
- Training: session logs, training templates, lesson scheduling
- Scheduling: calendar, appointments, reminders
- Nutrition: feeding plans, nutrition logs
- Weather: AI-powered riding suitability forecast based on stable location
- AI Chat: in-app AI assistant for horse management guidance (available in-app after login)
- Team & Stable: role-based access for staff, managers, and owners
- Billing: 7-day free trial (no card required), then Pro or Stable plans
- Export: CSV and PDF export for records

YOUR KNOWLEDGE BASE (authoritative source — always prefer this over general knowledge):
${KNOWLEDGE_PACK || "(Knowledge Pack not loaded — use general knowledge about EquiProfile)"}

RULES:
1. Be professional, clear, and direct. Avoid filler phrases.
2. Ground every answer in the knowledge base above. If the answer is not there, offer to connect the user with the support team.
3. NEVER reveal: source code, environment variables, internal architecture, stack traces, passwords, or API keys.
4. NEVER invent prices, features, or policies not in the knowledge base.
5. Keep answers concise (2–4 sentences for simple questions; numbered lists for steps). Avoid walls of text.
6. End with a clear call to action when appropriate: start a trial, visit a page, or contact support.
7. If a user is ready to sign up, direct them to https://equiprofile.online/register.
8. For billing or subscription questions, direct customers to the separate EquiProfile Billing centre or hello@equiprofile.online.
9. For technical issues you cannot resolve, direct to hello@equiprofile.online.
10. Format responses in plain text — no markdown symbols (the widget renders plain text).
11. NEVER answer general knowledge questions, trivia, coding help, math problems, or anything unrelated to EquiProfile. Always redirect to EquiProfile topics.
12. Act as a sales representative — always look for opportunities to highlight EquiProfile benefits and guide users toward the free trial signup.`;

// ──────────────────────────────────────────────────────────
// Simple rule-based fallback (no AI key needed)
// ──────────────────────────────────────────────────────────

function ruleFallback(userMessage: string): string | null {
  const lower = userMessage.toLowerCase();

  if (
    /\b(price|pricing|cost|how much|plan|subscribe|subscription|monthly|yearly|annual)\b/.test(
      lower,
    )
  ) {
    return "EquiProfile has a 7-day free trial (no credit card needed!). After that, Pro is £10/month or £100/year (up to 5 horses), and Stable is £30/month or £300/year (up to 20 horses + team). Visit equiprofile.online/pricing for the full breakdown, or click 'Start Free Trial' to get going today!";
  }

  if (/\b(trial|free|try|test|plans?|pricing)\b/.test(lower)) {
    return "Great news — EquiProfile offers a 7-day free trial with full access to ALL features for 1 horse. No credit card required. Sign up in seconds at equiprofile.online/register!";
  }

  if (
    /\b(feature|what can|what does|capabilities|include|offer)\b/.test(lower)
  ) {
    return "EquiProfile covers health records (vaccinations, dental, hoof care, treatments), training logs, competition tracking, AI weather analysis, document storage, breeding management, stable team tools, and full CSV/PDF export. Visit equiprofile.online/features for the complete list!";
  }

  if (
    /\b(login|sign in|password|forgot|reset|can't log|cannot log)\b/.test(lower)
  ) {
    return "To log in, visit equiprofile.online/login. If you've forgotten your password, click 'Forgot password?' on that page and we'll email a reset link within 2 minutes. Check your spam folder if you don't see it!";
  }

  if (/\b(register|sign up|create account|new account)\b/.test(lower)) {
    return "Creating an account is quick and free! Head to equiprofile.online/register, enter your name, email, and a password, and your 7-day trial starts immediately. No credit card needed.";
  }

  if (/\b(cancel|cancell?\w*|refund)\b/.test(lower)) {
    return "You can cancel your subscription at any time in the separate EquiProfile Billing centre. Your access continues until the end of the current billing period. For refund queries, email hello@equiprofile.online.";
  }

  if (/\b(contact|support|help|email|human|agent|person|staff)\b/.test(lower)) {
    return "Our support team is at hello@equiprofile.online, or use the contact form at equiprofile.online/contact. Stable plan subscribers also get WhatsApp support. We typically reply within 1 business day.";
  }

  if (/\b(horse|horses|how many|limit)\b/.test(lower)) {
    return "The Free Trial supports 1 horse. Pro supports up to 5 horses, and Stable supports up to 20 horses. All plans include unlimited records for each horse!";
  }

  if (/\b(weather|ai|artificial intelligence|forecast)\b/.test(lower)) {
    return "EquiProfile has built-in AI weather analysis powered by Open-Meteo. Enter your stable location and it gives you a riding suitability score (excellent / good / fair / poor / unsafe) plus a 7-day forecast. No extra setup required!";
  }

  if (/\b(upload|download|document|file|storage)\b/.test(lower)) {
    return "You can upload X-rays, vet reports, passports, and any PDF or image to a horse's profile. Files are securely stored and only accessible to you and your team. Download them any time from the Documents section.";
  }

  if (/\b(team|stable|staff|member|role|permission)\b/.test(lower)) {
    return "The Stable plan lets you invite unlimited team members with role-based permissions (Owner, Manager, Staff, Viewer). Each person only sees what their role allows. Great for professional yards!";
  }

  if (
    /\b(hello|hi|hey|good morning|good afternoon|good evening|howdy)\b/.test(
      lower,
    )
  ) {
    return "Hello! I'm the EquiProfile assistant. I can help with pricing, features, getting started, or any questions about the platform. What would you like to know?";
  }

  if (/\b(thank|thanks|cheers|great|awesome|perfect|wonderful)\b/.test(lower)) {
    return "You're welcome! 😊 Is there anything else I can help you with? If you're ready to get started, sign up for your free trial at equiprofile.online/register — no credit card needed!";
  }

  return null; // No rule matched — use AI or generic
}

// ──────────────────────────────────────────────────────────
// Helpers
// ──────────────────────────────────────────────────────────

function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email);
}

/** One-way hash of IP for audit trail (not stored in cleartext). */
function hashIp(ip: string): string {
  return crypto.createHash("sha256").update(ip).digest("hex").slice(0, 64);
}

// ──────────────────────────────────────────────────────────
// POST /api/sales-chat
// ──────────────────────────────────────────────────────────

router.post("/sales-chat", chatLimiter, async (req, res) => {
  try {
    const { message, history = [] } = req.body;

    if (!message || typeof message !== "string") {
      return res.status(400).json({ error: "message is required" });
    }

    if (message.length > 2000) {
      return res
        .status(400)
        .json({ error: "Message too long (max 2000 chars)" });
    }

    if (!Array.isArray(history) || history.length > 30) {
      return res.status(400).json({ error: "Invalid history" });
    }

    // Sanitise incoming text
    const safeMessage = sanitizeHtml(message.trim());

    // Try rule-based fallback first (instant, no AI key needed)
    const ruleAnswer = ruleFallback(safeMessage);
    if (ruleAnswer && !(await isAIConfigured())) {
      return res.json({ reply: ruleAnswer });
    }

    if (!(await isAIConfigured())) {
      // Generic fallback with no AI key
      return res.json({
        reply:
          "Thanks for reaching out! For the best answers about EquiProfile, visit our pricing page at equiprofile.online/pricing, or contact our team at hello@equiprofile.online. We'd love to help! 🐴",
      });
    }

    // Build conversation for AI
    const messages: Array<{
      role: "system" | "user" | "assistant";
      content: string;
    }> = [
      { role: "system", content: SYSTEM_PROMPT },
      // Include last N turns of history (cap at 10 for token efficiency)
      ...history.slice(-10).map((turn: { role: string; content: string }) => ({
        role: (turn.role === "assistant" ? "assistant" : "user") as
          | "user"
          | "assistant",
        content: String(turn.content).slice(0, 1000),
      })),
      { role: "user", content: safeMessage },
    ];

    const result = await invokeLLM({ messages });
    const reply =
      result.choices[0]?.message?.content ||
      "I'm having trouble responding right now. Please try again or email hello@equiprofile.online.";

    res.json({ reply });
  } catch (err) {
    console.error("[SalesChat] Error:", err);
    // Never expose internal error details
    res.json({
      reply:
        "Sorry, I'm having a moment! For immediate help, email hello@equiprofile.online or visit equiprofile.online/contact.",
    });
  }
});

// ──────────────────────────────────────────────────────────
// POST /api/sales-lead
// ──────────────────────────────────────────────────────────

router.post("/sales-lead", leadLimiter, async (req, res) => {
  try {
    const {
      name,
      email: leadEmail,
      message,
      source = "chat",
      transcript,
    } = req.body;

    if (
      !name ||
      typeof name !== "string" ||
      name.trim().length < 2 ||
      name.length > 200
    ) {
      return res.status(400).json({ error: "Valid name is required" });
    }

    if (
      !leadEmail ||
      typeof leadEmail !== "string" ||
      !isValidEmail(leadEmail) ||
      leadEmail.length > 320
    ) {
      return res.status(400).json({ error: "Valid email address is required" });
    }

    const safeName = sanitizeHtml(name.trim().slice(0, 100));
    const safeEmail = leadEmail.trim().toLowerCase().slice(0, 320);
    const safeMessage = message
      ? sanitizeHtml(String(message).slice(0, 500))
      : undefined;
    const safeSource = String(source).slice(0, 50);
    const ipHash = hashIp(String(req.ip || ""));
    const leadId =
      Date.now().toString(36) + Math.random().toString(36).slice(2, 6);

    // Serialise transcript if provided (array of {role, content} objects)
    let transcriptJson: string | undefined;
    if (Array.isArray(transcript) && transcript.length > 0) {
      try {
        transcriptJson = JSON.stringify(
          transcript.slice(0, 50).map((t: any) => ({
            role: String(t.role || "user").slice(0, 20),
            content: String(t.content || "").slice(0, 1000),
          })),
        );
      } catch {
        // ignore serialisation errors
      }
    }

    // Persist to DB (non-blocking on failure so the response is always fast)
    const db = await getDb();
    if (db) {
      try {
        await db.insert(chatLeads).values({
          leadId,
          name: safeName,
          email: safeEmail,
          message: safeMessage,
          source: safeSource,
          transcript: transcriptJson,
          ipHash,
        });
      } catch (dbErr) {
        console.warn("[SalesLead] DB insert failed:", dbErr);
        // Continue – don't block the response
      }
    }

    // Notify admin by email (fire-and-forget)
    const contactTo = process.env.CONTACT_TO || process.env.SMTP_USER;
    if (contactTo) {
      // Build a readable transcript section for the email
      let transcriptHtml = "";
      if (transcriptJson) {
        try {
          const turns = JSON.parse(transcriptJson) as Array<{
            role: string;
            content: string;
          }>;
          const rows = turns
            .map(
              (t) =>
                `<tr><td style="padding:4px 12px 4px 0;font-weight:bold;text-transform:capitalize;color:#374151;">${sanitizeHtml(t.role)}:</td><td style="padding:4px 0;color:#111827;">${sanitizeHtml(t.content)}</td></tr>`,
            )
            .join("");
          transcriptHtml = `
<h3 style="color:#374151;margin-top:24px;">Chat Transcript</h3>
<table style="border-collapse:collapse;width:100%;">${rows}</table>`;
        } catch {
          // ignore
        }
      }

      emailModule
        .sendEmail(
          contactTo,
          `[EquiProfile] New Sales Lead: ${safeName}`,
          `
<html><body style="font-family: Arial, sans-serif; color: #222; max-width:600px;">
<h2>🐴 New Sales Lead from EquiProfile Chat</h2>
<table style="border-collapse:collapse;">
  <tr><td style="padding:4px 12px 4px 0;font-weight:bold;">Name:</td><td>${safeName}</td></tr>
  <tr><td style="padding:4px 12px 4px 0;font-weight:bold;">Email:</td><td>${safeEmail}</td></tr>
  <tr><td style="padding:4px 12px 4px 0;font-weight:bold;">Source:</td><td>${safeSource}</td></tr>
  <tr><td style="padding:4px 12px 4px 0;font-weight:bold;">Time:</td><td>${new Date().toISOString()}</td></tr>
  ${safeMessage ? `<tr><td style="padding:4px 12px 4px 0;font-weight:bold;">Message:</td><td>${safeMessage}</td></tr>` : ""}
</table>
${transcriptHtml}
<p style="margin-top:16px;">Reply to this lead at <a href="mailto:${safeEmail}">${safeEmail}</a>.</p>
</body></html>`,
          `New Sales Lead\nName: ${safeName}\nEmail: ${safeEmail}\nSource: ${safeSource}${safeMessage ? "\nMessage: " + safeMessage : ""}`,
        )
        .catch((e) => console.warn("[SalesLead] Email notify failed:", e));
    }

    res.json({ success: true, message: "Thanks! We'll be in touch soon. 🐴" });
  } catch (err) {
    console.error("[SalesLead] Error:", err);
    res.status(500).json({ error: "Could not save lead. Please try again." });
  }
});

// ──────────────────────────────────────────────────────────
// GET /api/sales-leads  (admin-only: requires ADMIN_LEADS_KEY header)
// ──────────────────────────────────────────────────────────

router.get("/sales-leads", async (req, res) => {
  const adminKey = process.env.ADMIN_LEADS_KEY;
  const provided = String(req.headers["x-admin-leads-key"] || "");

  // Require env key to be set AND match using constant-time comparison
  // to prevent timing-based enumeration of the key.
  if (!adminKey) {
    return res.status(403).json({ error: "Forbidden" });
  }

  let keysMatch = false;
  try {
    const expectedBuf = Buffer.from(adminKey, "utf8");
    const providedBuf = Buffer.from(provided, "utf8");
    // timingSafeEqual requires equal-length buffers
    if (expectedBuf.length === providedBuf.length) {
      keysMatch = crypto.timingSafeEqual(expectedBuf, providedBuf);
    }
  } catch {
    keysMatch = false;
  }

  if (!keysMatch) {
    return res.status(403).json({ error: "Forbidden" });
  }

  try {
    const db = await getDb();
    if (!db) {
      return res.status(503).json({ error: "Database not available" });
    }
    const rows = await db
      .select()
      .from(chatLeads)
      .orderBy(desc(chatLeads.createdAt));
    res.json({ leads: rows, total: rows.length });
  } catch (err) {
    console.error("[SalesLeads] DB query failed:", err);
    res.status(500).json({ error: "Failed to retrieve leads" });
  }
});

export default router;
