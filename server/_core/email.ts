import nodemailer from "nodemailer";
import type { Transporter } from "nodemailer";
import type { User } from "../../drizzle/schema";
import { getRuntimeConfig } from "../dynamicConfig";
import { DEFAULT_PRICING } from "../../shared/pricing";
import { sanitizeHtml } from "./htmlEscape";

// Initialize transporter lazily, checking DB settings as fallback
async function getTransporter(): Promise<Transporter | null> {
  const host =
    process.env.SMTP_HOST ||
    (await getRuntimeConfig("smtp_host", "SMTP_HOST")) ||
    "smtp.gmail.com";
  const port = parseInt(
    process.env.SMTP_PORT ||
      (await getRuntimeConfig("smtp_port", "SMTP_PORT")) ||
      "587",
  );
  const user =
    process.env.SMTP_USER ||
    (await getRuntimeConfig("smtp_user", "SMTP_USER")) ||
    "";
  const pass =
    process.env.SMTP_PASS ||
    (await getRuntimeConfig("smtp_pass", "SMTP_PASS")) ||
    "";

  if (!user || !pass) {
    console.warn(
      "[Email] SMTP not configured (smtp_user and smtp_pass required)",
    );
    return null;
  }

  try {
    const t = nodemailer.createTransport({
      host,
      port,
      secure: false,
      auth: { user, pass },
    });
    return t;
  } catch (error) {
    console.error("[Email] Failed to initialize transporter:", error);
    return null;
  }
}

async function getSmtpFrom(): Promise<string> {
  return (
    process.env.SMTP_FROM ||
    (await getRuntimeConfig("smtp_from", "SMTP_FROM")) ||
    '"EquiProfile" <noreply@equiprofile.online>'
  );
}

/**
 * Send a generic email (low-level function)
 */
export async function sendEmail(
  to: string,
  subject: string,
  html: string,
  text?: string,
  extraHeaders?: Record<string, string>,
): Promise<void> {
  const transporter = await getTransporter();
  if (!transporter) {
    console.warn("[Email] Skipping email send - SMTP not configured");
    return;
  }

  const from = await getSmtpFrom();
  try {
    await transporter.sendMail({
      from,
      to,
      subject,
      html,
      text: text || stripHtml(html),
      ...(extraHeaders ? { headers: extraHeaders } : {}),
    });
    console.log(`[Email] Sent "${subject}" to ${to}`);
  } catch (error) {
    console.error(`[Email] Failed to send "${subject}" to ${to}:`, error);
    // Don't throw - email failures should not break app flow
  }
}

export type TransactionalEmailDeliveryResult =
  | { delivered: true; providerMessageId: string | null }
  | {
      delivered: false;
      reason: "SMTP_NOT_CONFIGURED" | "SMTP_SEND_FAILED";
      error: string;
    };

function deliveryErrorMessage(error: unknown): string {
  const message = error instanceof Error ? error.message : String(error);
  return message.replace(/[\r\n]+/g, " ").slice(0, 500);
}

/**
 * Transactional delivery contract for domain workflows that must surface an
 * explicit outcome. Existing generic email callers retain their non-throwing
 * behavior; this helper gives invitation persistence a bounded result instead.
 */
export async function sendTransactionalEmailWithResult(
  to: string,
  subject: string,
  html: string,
  text?: string,
): Promise<TransactionalEmailDeliveryResult> {
  const transporter = await getTransporter();
  if (!transporter) {
    return {
      delivered: false,
      reason: "SMTP_NOT_CONFIGURED",
      error: "SMTP is not configured; no invitation email was sent.",
    };
  }
  try {
    const info = await transporter.sendMail({
      from: await getSmtpFrom(),
      to,
      subject,
      html,
      text: text || stripHtml(html),
    });
    return { delivered: true, providerMessageId: info.messageId ?? null };
  } catch (error) {
    return {
      delivered: false,
      reason: "SMTP_SEND_FAILED",
      error: deliveryErrorMessage(error),
    };
  }
}

/**
 * Send a marketing/campaign email with CAN-SPAM/PECR compliant headers.
 * Includes List-Unsubscribe header for one-click unsubscribe in Gmail/Outlook.
 */
export async function sendCampaignEmail(
  to: string,
  subject: string,
  html: string,
  unsubscribeUrl: string,
  text?: string,
): Promise<void> {
  await sendEmail(to, subject, html, text, {
    "List-Unsubscribe": `<${unsubscribeUrl}>`,
    "List-Unsubscribe-Post": "List-Unsubscribe=One-Click",
    "Precedence": "bulk",
  });
}

/**
 * Shared branded email wrapper — EquiProfile letterhead
 * Wraps all transactional email content with a consistent professional layout.
 */
function brandedEmail(body: string): string {
  const BASE_URL = process.env.BASE_URL || "https://equiprofile.online";
  const LOGO_URL = `${BASE_URL}/logo.png`;
  const year = new Date().getFullYear();
  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8"/>
<meta name="viewport" content="width=device-width,initial-scale=1.0"/>
<title>EquiProfile</title>
</head>
<body style="margin:0;padding:0;background:#f0f4f8;font-family:'Segoe UI',Roboto,Arial,sans-serif;-webkit-text-size-adjust:100%;">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#f0f4f8;">
<tr><td align="center" style="padding:24px 12px;">
  <table role="presentation" width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;background:#ffffff;border-radius:12px;overflow:hidden;box-shadow:0 2px 12px rgba(0,0,0,0.08);">

    <!-- Letterhead header -->
    <tr><td style="background:linear-gradient(135deg,#0f2e6b 0%,#4f5fd6 100%);padding:28px 40px;text-align:center;">
      <img src="${LOGO_URL}" alt="EquiProfile" width="120" style="display:block;margin:0 auto 10px auto;height:auto;max-width:120px;"/>
      <p style="margin:0;color:#ffffff;font-size:11px;letter-spacing:1.5px;text-transform:uppercase;opacity:0.85;">Professional Equine Management</p>
    </td></tr>

    <!-- Body content -->
    <tr><td style="padding:32px 40px 24px;">
      ${body}
    </td></tr>

    <!-- Footer -->
    <tr><td style="padding:20px 40px;border-top:1px solid #e8edf2;background:#f8fafc;text-align:center;">
      <p style="margin:0 0 6px;font-size:12px;color:#94a3b8;">EquiProfile — Professional Horse Management</p>
      <p style="margin:0;font-size:12px;color:#94a3b8;">
        <a href="${BASE_URL}" style="color:#4f5fd6;text-decoration:none;">equiprofile.online</a>
        &nbsp;·&nbsp;
        <a href="mailto:support@equiprofile.online" style="color:#4f5fd6;text-decoration:none;">support@equiprofile.online</a>
      </p>
      <p style="margin:8px 0 0;font-size:11px;color:#c0c8d4;">© ${year} EquiProfile. All rights reserved.</p>
    </td></tr>

  </table>
</td></tr>
</table>
</body>
</html>`;
}

/**
 * Branded CTA button HTML helper
 */
function ctaBtn(text: string, url: string): string {
  return `<table role="presentation" cellpadding="0" cellspacing="0" style="margin:24px auto;">
<tr><td style="border-radius:8px;background:linear-gradient(135deg,#4f5fd6,#3b82f6);">
  <a href="${url}" target="_blank" style="display:inline-block;padding:14px 36px;color:#ffffff;font-size:15px;font-weight:600;text-decoration:none;border-radius:8px;">${text}</a>
</td></tr>
</table>`;
}

export type AcademyInviteEmailInput = {
  recipientEmail: string;
  inviterName: string;
  organizationName: string;
  role: "teacher" | "student";
  token: string;
  expiresAt: Date;
};

/**
 * Send a canonical Academy invitation and report delivery truth to the caller.
 * The invitation token exists only in the recipient URL and is never returned
 * in an outcome or persisted error string.
 */
export async function sendAcademyInviteEmail(
  input: AcademyInviteEmailInput,
): Promise<TransactionalEmailDeliveryResult> {
  const academyBaseUrl = (
    process.env.ACADEMY_BASE_URL || "https://academy.equiprofile.online"
  ).replace(/\/$/, "");
  const inviteUrl = `${academyBaseUrl}/academy-invite?token=${encodeURIComponent(input.token)}`;
  const roleLabel = input.role === "teacher" ? "Teacher" : "Student";
  const safeInviterName = sanitizeHtml(input.inviterName || "An Academy owner");
  const safeOrganizationName = sanitizeHtml(input.organizationName);
  const expiry = new Intl.DateTimeFormat("en-GB", {
    dateStyle: "medium",
    timeStyle: "short",
    timeZone: "UTC",
  }).format(input.expiresAt);
  const subject = `Invitation to join ${input.organizationName} on EquiProfile Academy`;
  const html = brandedEmail(`
    <h1 style="margin:0 0 8px;font-size:24px;color:#1a2340;font-weight:700;">You’re invited to EquiProfile Academy</h1>
    <p style="margin:0 0 20px;font-size:15px;color:#64748b;line-height:1.6;">
      <strong>${safeInviterName}</strong> has invited you to join <strong>${safeOrganizationName}</strong> as a <strong>${roleLabel}</strong>.
    </p>
    ${ctaBtn("Accept Academy invitation", inviteUrl)}
    <p style="margin:0 0 16px;font-size:14px;color:#374151;line-height:1.6;">
      Sign in or create an EquiProfile account using this email address to accept. The invitation expires on <strong>${expiry} UTC</strong>.
    </p>
    <p style="font-size:13px;color:#94a3b8;margin:0 0 8px;">Button not working? Copy and paste this link:</p>
    <p style="font-size:12px;color:#4f5fd6;word-break:break-all;margin:0 0 16px;">${inviteUrl}</p>
    <p style="font-size:13px;color:#94a3b8;margin:0;">If you did not expect this invitation, you can ignore this email.</p>
  `);
  return sendTransactionalEmailWithResult(
    input.recipientEmail,
    subject,
    html,
    `You have been invited by ${input.inviterName || "an Academy owner"} to join ${input.organizationName} as a ${roleLabel}. Accept the invitation: ${inviteUrl}`,
  );
}

export async function sendWelcomeEmail(
  user: User,
  product: "management" | "academy" = "management",
): Promise<void> {
  if (!user.email) {
    console.warn("[Email] Cannot send welcome email - user has no email");
    return;
  }

  const baseUrl = product === "academy"
    ? process.env.ACADEMY_BASE_URL || "https://academy.equiprofile.online"
    : process.env.BASE_URL || "https://equiprofile.online";
  const productName = product === "academy"
    ? "EquiProfile Academy"
    : "EquiProfile Management";
  const trialDays = user.trialEndsAt
    ? Math.ceil(
        (user.trialEndsAt.getTime() - Date.now()) / (1000 * 60 * 60 * 24),
      )
    : 7;

  const subject = `Welcome to ${productName}! 🐴`;
  const html = brandedEmail(`
    <h1 style="margin:0 0 8px;font-size:24px;color:#1a2340;font-weight:700;">Welcome, ${user.name || "there"}!</h1>
    <p style="margin:0 0 20px;font-size:15px;color:#64748b;line-height:1.6;">
      ${product === "academy"
        ? "Your EquiProfile account is verified. Continue to the Academy to access the learning experience available for your role and entitlement."
        : "You're now part of EquiProfile Management — the professional horse management platform trusted by yards, trainers, and horse owners."}
    </p>
    ${product === "management" ? `<div style="background:#f0f4ff;border-radius:10px;padding:20px 24px;margin:0 0 24px;border:1px solid #dde3f8;">
      <p style="margin:0 0 12px;font-size:15px;font-weight:600;color:#1a2340;">Your ${trialDays}-Day Free Trial includes:</p>
      <table role="presentation" cellpadding="0" cellspacing="0" width="100%">
        ${["Health records &amp; vaccination tracking", "Training session management", "Feeding schedules &amp; nutrition plans", "Calendar &amp; event reminders", "AI-powered weather analysis", "Secure document storage"].map(f =>
          `<tr><td style="padding:5px 0;font-size:14px;color:#374151;">&#10003;&nbsp;&nbsp;${f}</td></tr>`).join("")}
      </table>
    </div>` : ""}
    ${ctaBtn(product === "academy" ? "Open EquiProfile Academy →" : "Go to Management Dashboard →", product === "academy" ? `${baseUrl}/academy` : `${baseUrl}/dashboard`)}
    <p style="font-size:13px;color:#94a3b8;text-align:center;margin:8px 0 0;">Questions? Simply reply to this email — we're happy to help.</p>
  `);

  await sendEmail(user.email, subject, html);
}

/**
 * Send email verification email with a secure token link
 */
export async function sendVerificationEmail(
  userEmail: string,
  token: string,
  userName?: string,
  product: "management" | "academy" = "management",
): Promise<void> {
  const baseUrl = product === "academy"
    ? process.env.ACADEMY_BASE_URL || "https://academy.equiprofile.online"
    : process.env.BASE_URL || "https://equiprofile.online";
  const verifyUrl = `${baseUrl}/verify-email?token=${encodeURIComponent(token)}`;

  const productName = product === "academy" ? "EquiProfile Academy" : "EquiProfile Management";
  const subject = `Verify your ${productName} email address`;
  const html = brandedEmail(`
    <h1 style="margin:0 0 8px;font-size:24px;color:#1a2340;font-weight:700;">Verify Your Email Address</h1>
    <p style="margin:0 0 20px;font-size:15px;color:#64748b;line-height:1.6;">
      Hi ${userName || "there"}, please verify your email to activate your ${productName} account.
    </p>
    ${ctaBtn("Verify Email Address →", verifyUrl)}
    <div style="background:#f0f4ff;border-radius:8px;padding:16px 20px;margin:24px 0;border:1px solid #dde3f8;">
      <p style="margin:0;font-size:14px;color:#374151;">
        <strong>This link expires in 24 hours.</strong> If it expires, you can request a new one from the login page.
      </p>
    </div>
    <p style="font-size:13px;color:#94a3b8;margin:0 0 8px;">Button not working? Copy and paste this link:</p>
    <p style="font-size:12px;color:#4f5fd6;word-break:break-all;margin:0 0 16px;">${verifyUrl}</p>
    <p style="font-size:13px;color:#94a3b8;margin:0;">Didn't create an account? You can safely ignore this email.</p>
  `);

  await sendEmail(userEmail, subject, html);
}

/**
 * Send trial reminder email
 */
export async function sendTrialReminderEmail(
  user: User,
  daysLeft: number,
): Promise<void> {
  if (!user.email) return;

  let subject: string;
  let urgency: string;

  if (daysLeft === 2) {
    subject = "Your EquiProfile trial ends in 2 days";
    urgency = "⏰ Only 2 days left in your free trial!";
  } else if (daysLeft === 1) {
    subject = "⚠️ Your EquiProfile trial ends tomorrow!";
    urgency = "⚠️ Your trial ends tomorrow!";
  } else if (daysLeft === 0) {
    subject = "Your EquiProfile trial has ended";
    urgency = "Your free trial has ended";
  } else {
    subject = `Your EquiProfile trial ends in ${daysLeft} days`;
    urgency = `Your trial ends in ${daysLeft} days`;
  }

  const BASE_URL = process.env.BASE_URL || "https://equiprofile.online";
  const html = brandedEmail(`
    <h1 style="margin:0 0 8px;font-size:22px;color:${daysLeft === 0 ? "#dc2626" : "#1a2340"};font-weight:700;">${urgency}</h1>
    <p style="margin:0 0 20px;font-size:15px;color:#64748b;line-height:1.6;">Hi ${user.name || "there"},</p>
    ${daysLeft > 0
      ? `<p style="margin:0 0 20px;font-size:15px;color:#374151;">Your free trial ends in <strong>${daysLeft} day${daysLeft === 1 ? "" : "s"}</strong>. Upgrade now to keep access to all your data and features.</p>`
      : `<p style="margin:0 0 20px;font-size:15px;color:#374151;">Your free trial has ended. Subscribe to restore full access.</p>`}
    <div style="background:#fff7ed;border-radius:10px;padding:20px 24px;margin:0 0 24px;border:1px solid #fed7aa;">
      <p style="margin:0 0 10px;font-size:14px;font-weight:600;color:#92400e;">Don't lose access to:</p>
      <table role="presentation" cellpadding="0" cellspacing="0" width="100%">
        ${["Horse profiles &amp; health records", "Training logs &amp; progress tracking", "Document storage &amp; reminders", "Calendar &amp; event management"].map(f =>
          `<tr><td style="padding:4px 0;font-size:14px;color:#374151;">&#10003;&nbsp;&nbsp;${f}</td></tr>`).join("")}
      </table>
    </div>
    <table role="presentation" cellpadding="0" cellspacing="0" width="100%" style="margin:0 0 24px;">
      <tr>
        <td style="padding:0 8px 0 0;" width="50%">
          <div style="border:2px solid #e2e8f0;border-radius:8px;padding:16px;text-align:center;">
            <p style="margin:0 0 4px;font-size:13px;font-weight:600;color:#64748b;text-transform:uppercase;">Monthly</p>
            <p style="margin:0;font-size:22px;font-weight:700;color:#1a2340;">${DEFAULT_PRICING.individual.monthly.display}<span style="font-size:13px;font-weight:400;color:#94a3b8;">/mo</span></p>
          </div>
        </td>
        <td style="padding:0 0 0 8px;" width="50%">
          <div style="border:2px solid #4f5fd6;border-radius:8px;padding:16px;text-align:center;background:#f0f4ff;">
            <p style="margin:0 0 4px;font-size:11px;font-weight:700;color:#4f5fd6;text-transform:uppercase;letter-spacing:0.5px;">Save 17%</p>
            <p style="margin:0 0 4px;font-size:13px;font-weight:600;color:#64748b;text-transform:uppercase;">Yearly</p>
            <p style="margin:0;font-size:22px;font-weight:700;color:#1a2340;">${DEFAULT_PRICING.individual.yearly.display}<span style="font-size:13px;font-weight:400;color:#94a3b8;">/yr</span></p>
            <p style="margin:4px 0 0;font-size:12px;color:#94a3b8;">Just £${(DEFAULT_PRICING.individual.yearly.amount / 100 / 12).toFixed(2)}/mo</p>
          </div>
        </td>
      </tr>
    </table>
    ${ctaBtn("Upgrade Now →", `${BASE_URL}/billing`)}
    <p style="font-size:13px;color:#94a3b8;text-align:center;margin:8px 0 0;">Questions about billing? Reply to this email.</p>
  `);

  await sendEmail(user.email, subject, html);
}

/**
 * Send payment success/subscription activated email
 */
export async function sendPaymentSuccessEmail(
  user: User,
  plan?: "monthly" | "yearly",
): Promise<void> {
  if (!user.email) return;

  const planName = plan === "yearly" ? "Yearly" : "Monthly";
  const amount = plan === "yearly" ? `${DEFAULT_PRICING.individual.yearly.display}/year` : `${DEFAULT_PRICING.individual.monthly.display}/month`;

  const subject = "Payment successful - Welcome to EquiProfile Premium! 🎉";
  const html = brandedEmail(`
    <h1 style="margin:0 0 8px;font-size:24px;color:#059669;font-weight:700;">Payment Successful! 🎉</h1>
    <p style="margin:0 0 20px;font-size:15px;color:#64748b;line-height:1.6;">
      Hi ${user.name || "there"}, thank you for subscribing to EquiProfile Premium!
    </p>
    <div style="background:#f0fdf4;border-radius:10px;padding:20px 24px;margin:0 0 24px;border:1px solid #86efac;">
      <p style="margin:0 0 10px;font-size:15px;font-weight:600;color:#065f46;">Subscription Details</p>
      <table role="presentation" cellpadding="0" cellspacing="0" width="100%">
        <tr><td style="padding:4px 0;font-size:14px;color:#374151;width:140px;"><strong>Plan:</strong></td><td style="padding:4px 0;font-size:14px;color:#374151;">${planName}</td></tr>
        <tr><td style="padding:4px 0;font-size:14px;color:#374151;"><strong>Amount:</strong></td><td style="padding:4px 0;font-size:14px;color:#374151;">${amount}</td></tr>
        <tr><td style="padding:4px 0;font-size:14px;color:#374151;"><strong>Status:</strong></td><td style="padding:4px 0;font-size:14px;color:#059669;font-weight:600;">Active ✅</td></tr>
        ${user.subscriptionEndsAt ? `<tr><td style="padding:4px 0;font-size:14px;color:#374151;"><strong>Next billing:</strong></td><td style="padding:4px 0;font-size:14px;color:#374151;">${user.subscriptionEndsAt.toLocaleDateString()}</td></tr>` : ""}
      </table>
    </div>
    <p style="margin:0 0 12px;font-size:14px;color:#374151;">You now have full access to all premium features:</p>
    <table role="presentation" cellpadding="0" cellspacing="0" width="100%" style="margin:0 0 24px;">
      ${["Unlimited horse profiles", "Complete health record tracking", "Training session management", "Document storage (up to 5GB)", "Advanced analytics &amp; reports", "Calendar &amp; reminders", "Priority support"].map(f =>
        `<tr><td style="padding:4px 0;font-size:14px;color:#374151;">&#10003;&nbsp;&nbsp;${f}</td></tr>`).join("")}
    </table>
    ${ctaBtn("Go to Dashboard →", `${process.env.BASE_URL || "https://equiprofile.online"}/dashboard`)}
    <p style="font-size:13px;color:#94a3b8;text-align:center;margin:8px 0 0;">
      Manage your subscription anytime from your <a href="${process.env.BASE_URL || "https://equiprofile.online"}/billing" style="color:#4f5fd6;text-decoration:none;">billing page</a>.
    </p>
  `);

  await sendEmail(user.email, subject, html);
}

/**
 * Send payment renewal / invoice receipt email (recurring payments)
 */
export async function sendRenewalReceiptEmail(
  user: User,
  plan?: "monthly" | "yearly",
): Promise<void> {
  if (!user.email) return;

  const planName = plan === "yearly" ? "Yearly" : "Monthly";
  const amount =
    plan === "yearly"
      ? `${DEFAULT_PRICING.individual.yearly.display}/year`
      : `${DEFAULT_PRICING.individual.monthly.display}/month`;

  const subject = "EquiProfile – Your payment receipt";
  const html = brandedEmail(`
    <h1 style="margin:0 0 8px;font-size:24px;color:#059669;font-weight:700;">Payment Received ✓</h1>
    <p style="margin:0 0 20px;font-size:15px;color:#64748b;line-height:1.6;">
      Hi ${user.name || "there"}, we've successfully processed your renewal payment.
    </p>
    <div style="background:#f0fdf4;border-radius:10px;padding:20px 24px;margin:0 0 24px;border:1px solid #86efac;">
      <table role="presentation" cellpadding="0" cellspacing="0" width="100%">
        <tr><td style="padding:4px 0;font-size:14px;color:#374151;width:120px;"><strong>Plan:</strong></td><td style="padding:4px 0;font-size:14px;color:#374151;">${planName}</td></tr>
        <tr><td style="padding:4px 0;font-size:14px;color:#374151;"><strong>Amount:</strong></td><td style="padding:4px 0;font-size:14px;color:#374151;">${amount}</td></tr>
        <tr><td style="padding:4px 0;font-size:14px;color:#374151;"><strong>Date:</strong></td><td style="padding:4px 0;font-size:14px;color:#374151;">${new Date().toLocaleDateString("en-GB")}</td></tr>
        <tr><td style="padding:4px 0;font-size:14px;color:#374151;"><strong>Status:</strong></td><td style="padding:4px 0;font-size:14px;color:#059669;font-weight:600;">Active ✅</td></tr>
      </table>
    </div>
    <p style="font-size:13px;color:#94a3b8;text-align:center;margin:0;">
      Manage your subscription anytime from your <a href="${process.env.BASE_URL || "https://equiprofile.online"}/billing" style="color:#4f5fd6;text-decoration:none;">billing page</a>.
    </p>
  `);

  await sendEmail(user.email, subject, html);
}

/**
 * Send payment failed / overdue notification email
 */
export async function sendPaymentFailedEmail(
  user: User,
): Promise<void> {
  if (!user.email) return;

  const subject = "⚠️ EquiProfile – Payment failed";
  const html = brandedEmail(`
    <h1 style="margin:0 0 8px;font-size:24px;color:#dc2626;font-weight:700;">Payment Failed</h1>
    <p style="margin:0 0 20px;font-size:15px;color:#64748b;line-height:1.6;">
      Hi ${user.name || "there"}, we were unable to process your latest payment and your account has been marked as <strong>overdue</strong>.
    </p>
    <div style="background:#fef2f2;border-radius:10px;padding:20px 24px;margin:0 0 24px;border:1px solid #fca5a5;">
      <p style="margin:0 0 10px;font-size:14px;font-weight:600;color:#991b1b;">What happens next?</p>
      <table role="presentation" cellpadding="0" cellspacing="0" width="100%">
        ${["We'll retry your payment automatically in a few days", "You can update your payment method in billing settings", "If payment remains outstanding, your access may be limited"].map(f =>
          `<tr><td style="padding:5px 0;font-size:14px;color:#374151;">&#8226;&nbsp;&nbsp;${f}</td></tr>`).join("")}
      </table>
    </div>
    ${ctaBtn("Update Payment Method →", `${process.env.BASE_URL || "https://equiprofile.online"}/billing`)}
    <p style="font-size:13px;color:#94a3b8;text-align:center;margin:8px 0 0;">Think this is a mistake? Reply to this email and we'll help.</p>
  `);

  await sendEmail(user.email, subject, html);
}

/**
 * Send cancellation confirmation email
 */
export async function sendCancellationEmail(
  user: User,
): Promise<void> {
  if (!user.email) return;

  const subject = "EquiProfile – Subscription cancelled";
  const html = brandedEmail(`
    <h1 style="margin:0 0 8px;font-size:24px;color:#1a2340;font-weight:700;">Subscription Cancelled</h1>
    <p style="margin:0 0 20px;font-size:15px;color:#64748b;line-height:1.6;">
      Hi ${user.name || "there"}, your EquiProfile subscription has been cancelled. We're sorry to see you go.
    </p>
    <div style="background:#f8fafc;border-radius:10px;padding:20px 24px;margin:0 0 24px;border:1px solid #e2e8f0;">
      <p style="margin:0 0 10px;font-size:14px;font-weight:600;color:#1a2340;">What happens now:</p>
      <table role="presentation" cellpadding="0" cellspacing="0" width="100%">
        ${["Your data will be retained for 30 days", "You can resubscribe at any time to restore full access", "Your horse profiles and records remain safe"].map(f =>
          `<tr><td style="padding:5px 0;font-size:14px;color:#374151;">&#8226;&nbsp;&nbsp;${f}</td></tr>`).join("")}
      </table>
    </div>
    ${ctaBtn("Resubscribe →", `${process.env.BASE_URL || "https://equiprofile.online"}/billing`)}
    <p style="font-size:13px;color:#94a3b8;text-align:center;margin:8px 0 0;">We'd love your feedback — reply to this email to let us know how we can improve.</p>
  `);

  await sendEmail(user.email, subject, html);
}

/**
 * Send password reset email
 */
export async function sendPasswordResetEmail(
  email: string,
  resetToken: string,
  name?: string,
  product: "management" | "academy" = "management",
): Promise<void> {
  const baseUrl = product === "academy"
    ? process.env.ACADEMY_BASE_URL || "https://academy.equiprofile.online"
    : process.env.BASE_URL || "https://equiprofile.online";
  const resetUrl = `${baseUrl}/reset-password?token=${encodeURIComponent(resetToken)}`;
  const productName = product === "academy" ? "EquiProfile Academy" : "EquiProfile Management";

  const subject = `Reset your ${productName} password`;
  const html = brandedEmail(`
    <h1 style="margin:0 0 8px;font-size:24px;color:#1a2340;font-weight:700;">Password Reset Request</h1>
    <p style="margin:0 0 20px;font-size:15px;color:#64748b;line-height:1.6;">
      Hi ${name || "there"}, we received a request to reset your ${productName} password. Click the button below to create a new one.
    </p>
    ${ctaBtn("Reset Password →", resetUrl)}
    <div style="background:#fef2f2;border-radius:8px;padding:16px 20px;margin:24px 0;border:1px solid #fca5a5;">
      <p style="margin:0;font-size:14px;color:#991b1b;">
        ⚠️ This link expires in <strong>1 hour</strong> for security reasons.
      </p>
    </div>
    <p style="font-size:13px;color:#94a3b8;margin:0 0 8px;">Button not working? Copy and paste this link:</p>
    <p style="font-size:12px;color:#4f5fd6;word-break:break-all;margin:0 0 16px;">${resetUrl}</p>
    <p style="font-size:13px;color:#94a3b8;margin:0;">Didn't request a reset? You can safely ignore this email — your password won't change.</p>
  `);

  await sendEmail(email, subject, html);
}

/**
 * Send contact-form email to the business inbox (CONTACT_TO)
 */
export async function sendContactEmail(fields: {
  name: string;
  email: string;
  subject: string;
  message: string;
}): Promise<void> {
  const to =
    process.env.CONTACT_TO ||
    process.env.SMTP_FROM ||
    "support@equiprofile.online";

  // Escape HTML entities to prevent XSS in email clients
  const esc = (s: string) =>
    s
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#39;");

  const safeName = esc(fields.name);
  const safeEmail = esc(fields.email);
  const safeSubject = esc(fields.subject);
  const safeMessage = esc(fields.message);

  const subject = `[Contact Form] ${safeSubject}`;
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
      <h2 style="color: #1e40af; border-bottom: 2px solid #1e40af; padding-bottom: 10px;">
        New Contact Form Submission
      </h2>
      <table style="width: 100%; border-collapse: collapse; margin: 20px 0;">
        <tr>
          <td style="padding: 8px; font-weight: bold; width: 120px; color: #374151;">Name:</td>
          <td style="padding: 8px; color: #111827;">${safeName}</td>
        </tr>
        <tr style="background: #f9fafb;">
          <td style="padding: 8px; font-weight: bold; color: #374151;">Email:</td>
          <td style="padding: 8px; color: #111827;">
            <a href="mailto:${safeEmail}" style="color: #1e40af;">${safeEmail}</a>
          </td>
        </tr>
        <tr>
          <td style="padding: 8px; font-weight: bold; color: #374151;">Subject:</td>
          <td style="padding: 8px; color: #111827;">${safeSubject}</td>
        </tr>
      </table>
      <div style="background: #f3f4f6; border-left: 4px solid #1e40af; padding: 16px; border-radius: 4px;">
        <p style="margin: 0; font-weight: bold; color: #374151; margin-bottom: 8px;">Message:</p>
        <p style="margin: 0; color: #111827; white-space: pre-wrap;">${safeMessage}</p>
      </div>
      <p style="color: #6b7280; font-size: 12px; margin-top: 24px;">
        Sent via EquiProfile Contact Form · ${new Date().toISOString()}
      </p>
    </div>
  `;

  await sendEmail(to, subject, html);
}

/**
 */
export async function sendTestEmail(to: string): Promise<boolean> {
  try {
    await sendEmail(
      to,
      "EquiProfile Test Email",
      `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h1 style="color: #1e40af;">Test Email</h1>
          <p>This is a test email from EquiProfile SMTP configuration.</p>
          <p>If you received this, your email settings are working correctly! ✅</p>
          <p style="color: #6b7280; margin-top: 30px;">
            Sent at: ${new Date().toISOString()}
          </p>
        </div>
      `,
    );
    return true;
  } catch (error) {
    console.error("[Email] Test email failed:", error);
    return false;
  }
}

/**
 * Send reminder email for events
 */
export async function sendReminderEmail(
  to: string,
  userName: string,
  eventTitle: string,
  eventDescription: string,
  eventDate: Date,
  horseName?: string,
): Promise<void> {
  const formattedDate = eventDate.toLocaleDateString("en-GB", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
  const formattedTime = eventDate.toLocaleTimeString("en-GB", {
    hour: "2-digit",
    minute: "2-digit",
  });

  const BASE_URL = process.env.BASE_URL || "https://equiprofile.online";
  const subject = `Reminder: ${eventTitle}`;

  const html = brandedEmail(`
    <h1 style="margin:0 0 8px;font-size:24px;color:#1a2340;font-weight:700;">Upcoming Event Reminder</h1>
    <p style="margin:0 0 20px;font-size:15px;color:#64748b;line-height:1.6;">
      Hi ${userName}, here's a reminder about your upcoming event:
    </p>
    <div style="background:#f0f4ff;border-radius:10px;padding:20px 24px;margin:0 0 24px;border:1px solid #dde3f8;">
      <p style="margin:0 0 8px;font-size:17px;font-weight:700;color:#1a2340;">${eventTitle}</p>
      ${horseName ? `<p style="margin:0 0 6px;font-size:14px;color:#374151;"><strong>Horse:</strong> ${horseName}</p>` : ""}
      <p style="margin:0 0 6px;font-size:14px;color:#374151;"><strong>Date:</strong> ${formattedDate}</p>
      <p style="margin:0 0 6px;font-size:14px;color:#374151;"><strong>Time:</strong> ${formattedTime}</p>
      ${eventDescription ? `<p style="margin:10px 0 0;font-size:14px;color:#374151;">${eventDescription}</p>` : ""}
    </div>
    ${ctaBtn("View in Calendar →", `${BASE_URL}/calendar`)}
    <p style="font-size:13px;color:#94a3b8;text-align:center;margin:8px 0 0;">You received this reminder because you have an event scheduled in EquiProfile.</p>
  `);

  await sendEmail(to, subject, html);
}

/**
 * Simple HTML strip utility for plain text fallback
 */
function stripHtml(html: string): string {
  return html
    .replace(/<style[^>]*>.*<\/style>/gm, "")
    .replace(/<script[^>]*>.*<\/script>/gm, "")
    .replace(/<[^>]+>/gm, "")
    .replace(/\s\s+/g, " ")
    .trim();
}

/**
 * Verify SMTP configuration at startup.
 * Logs the result clearly; never throws — SMTP is optional.
 * Call this once during server startup to surface misconfiguration early.
 */
export async function verifySmtpConfig(): Promise<void> {
  // Check env vars first, then fall back to dashboard settings
  const user =
    process.env.SMTP_USER ||
    (await getRuntimeConfig("smtp_user", "SMTP_USER")) ||
    "";
  const pass =
    process.env.SMTP_PASS ||
    (await getRuntimeConfig("smtp_pass", "SMTP_PASS")) ||
    "";

  if (!user || !pass) {
    console.warn(
      "⚠️  [Email] SMTP not configured — outbound email (registration, password reset) will not work.",
    );
    console.warn(
      "   Set SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS in environment or via Admin → Settings.",
    );
    return;
  }

  const source = process.env.SMTP_USER ? "environment" : "dashboard settings";

  // Attempt a connection to verify credentials
  try {
    const transporter = await getTransporter();
    if (!transporter) {
      console.warn("⚠️  [Email] SMTP transporter could not be initialised.");
      return;
    }
    await transporter.verify();
    console.log(
      `✅ [Email] SMTP connected successfully (user: ${user}, source: ${source})`,
    );
  } catch (err: any) {
    console.error(
      `❌ [Email] SMTP connection failed — emails will not send until this is fixed.`,
    );
    console.error(`   Error: ${err?.message ?? err}`);
    console.error(
      `   Check SMTP_HOST (${process.env.SMTP_HOST ?? "smtp.gmail.com"}), port, credentials, and firewall rules.`,
    );
  }
}

/**
 * Send stable team invite email
 */
export async function sendStableInviteEmail(
  recipientEmail: string,
  inviterName: string,
  stableName: string,
  role: string,
  token: string,
): Promise<void> {
  const baseUrl = process.env.BASE_URL || "https://equiprofile.online";
  const inviteUrl = `${baseUrl}/stable-invite?token=${encodeURIComponent(token)}`;
  const roleName = role.charAt(0).toUpperCase() + role.slice(1);

  const subject = `You've been invited to join ${stableName} on EquiProfile`;
  const html = brandedEmail(`
    <h1 style="margin:0 0 8px;font-size:24px;color:#1a2340;font-weight:700;">You're Invited! 🐴</h1>
    <p style="margin:0 0 20px;font-size:15px;color:#64748b;line-height:1.6;">
      <strong>${inviterName}</strong> has invited you to join <strong>${stableName}</strong> on EquiProfile as a <strong>${roleName}</strong>.
    </p>
    <div style="background:#f0f4ff;border-radius:10px;padding:20px 24px;margin:0 0 24px;border:1px solid #dde3f8;">
      <p style="margin:0 0 10px;font-size:14px;font-weight:600;color:#1a2340;">About EquiProfile</p>
      <p style="margin:0;font-size:14px;color:#374151;line-height:1.6;">EquiProfile is the professional horse management platform for yards, trainers, and horse owners — built for collaboration on horse care, training, health records, and stable operations.</p>
    </div>
    ${ctaBtn("Accept Invitation →", inviteUrl)}
    <div style="background:#f8fafc;border-radius:8px;padding:16px 20px;margin:24px 0;border-left:4px solid #4f5fd6;">
      <p style="margin:0;font-size:14px;color:#374151;">
        <strong>This invitation expires in 7 days.</strong> If you don't have an account yet, you'll be prompted to create one when you accept.
      </p>
    </div>
    <p style="font-size:13px;color:#94a3b8;margin:0 0 8px;">Button not working? Copy and paste this link:</p>
    <p style="font-size:12px;color:#4f5fd6;word-break:break-all;margin:0 0 16px;">${inviteUrl}</p>
    <p style="font-size:13px;color:#94a3b8;margin:0;">Didn't expect this invitation? You can safely ignore this email.</p>
  `);

  await sendEmail(recipientEmail, subject, html);
}

/**
 * Human-readable labels for each free-access reason template key.
 * Kept here so email copy and audit logs use the same strings.
 */
const FREE_ACCESS_REASON_LABELS: Record<string, string> = {
  system_maintenance: "System update / maintenance goodwill",
  service_disruption: "Service disruption apology",
  bug_compensation: "Bug impact compensation",
  support_resolution: "Manual support resolution",
  beta_evaluation: "Beta testing / temporary evaluation",
  special_approval: "Special approval / custom case",
};

/**
 * Send a complimentary access / goodwill email when admin grants free access.
 * Dynamic freeDays can be any admin-chosen value (default 7).
 * reason is a template key (see FREE_ACCESS_REASON_LABELS).
 */
export async function sendCompensationEmail(
  recipientEmail: string,
  userName: string,
  freeDays: number,
  reason?: string,
  customNote?: string,
): Promise<void> {
  const baseUrl = process.env.BASE_URL || "https://equiprofile.online";
  const dashboardUrl = `${baseUrl}/dashboard`;

  // Sanitize inputs at entry for defense in depth
  const safeCustomNote = customNote ? sanitizeHtml(customNote) : "";

  const reasonLabel = reason
    ? sanitizeHtml(FREE_ACCESS_REASON_LABELS[reason] ?? "Administrative action")
    : "Complimentary access";

  const subject = `Your complimentary ${freeDays}-day access — EquiProfile`;
  const reasonBlock = reason
    ? `<div style="background:#fff7ed;border-radius:8px;padding:14px 18px;margin:0 0 20px;border:1px solid #fed7aa;">
        <p style="margin:0;font-size:13px;color:#92400e;font-weight:600;text-transform:uppercase;letter-spacing:0.05em;">Reason</p>
        <p style="margin:6px 0 0;font-size:14px;color:#374151;">${reasonLabel}${safeCustomNote ? `<br/><span style="color:#6b7280;font-style:italic;">${safeCustomNote}</span>` : ""}</p>
      </div>`
    : "";
  const html = brandedEmail(`
    <h1 style="margin:0 0 8px;font-size:24px;color:#1a2340;font-weight:700;">We have granted you complimentary access</h1>
    <p style="margin:0 0 20px;font-size:15px;color:#64748b;line-height:1.6;">
      Hi ${userName || "there"},
    </p>
    ${reasonBlock}
    <p style="margin:0 0 24px;font-size:15px;color:#374151;line-height:1.6;">
      We have added <strong>${freeDays} days of complimentary full access</strong> to your account — no action required on your part.
    </p>
    <div style="background:#f0f4ff;border-radius:10px;padding:20px 24px;margin:0 0 24px;border:1px solid #dde3f8;">
      <table role="presentation" cellpadding="0" cellspacing="0" width="100%">
        <tr>
          <td style="padding:6px 0;font-size:14px;color:#374151;">
            ✓&nbsp;&nbsp;<strong>${freeDays} days</strong> of complimentary access added to your account
          </td>
        </tr>
        <tr>
          <td style="padding:6px 0;font-size:14px;color:#374151;">
            ✓&nbsp;&nbsp;All your horse data, health records, and documents remain intact
          </td>
        </tr>
        <tr>
          <td style="padding:6px 0;font-size:14px;color:#374151;">
            ✓&nbsp;&nbsp;No payment required — this access is already applied
          </td>
        </tr>
      </table>
    </div>
    ${ctaBtn("Go to My Dashboard →", dashboardUrl)}
    <p style="font-size:14px;color:#374151;line-height:1.6;margin:24px 0 8px;">
      If you have any questions at all, please do not hesitate to reach out.
    </p>
    <p style="font-size:14px;color:#374151;margin:0 0 24px;">
      Thank you for being part of EquiProfile.
    </p>
    <p style="font-size:13px;color:#94a3b8;margin:0;">This is a service notification. No action is required.</p>
  `);

  await sendEmail(recipientEmail, subject, html);
}
