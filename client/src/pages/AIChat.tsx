import { useState, useEffect, useRef } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import { AIChatBox, Message } from "@/components/AIChatBox";
import { trpc } from "@/lib/trpc";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  ShieldCheck,
  Lock,
  AlertCircle,
  Mic,
  MicOff,
  Save,
  Trash2,
  MessageSquare,
  FileText,
  ExternalLink,
  CalendarPlus,
  ListChecks,
  CheckCircle2,
  Info,
} from "lucide-react";
import { toast } from "sonner";
import { PageHeader } from "@/components/PageHeader";

const CHAT_SESSION_KEY = "equiprofile_ai_chat_session";
const AI_DISCLAIMER_KEY = "equiprofile_ai_disclaimer_accepted";

/**
 * Maps Web Speech API SpeechRecognitionErrorCode values to user-friendly messages.
 * https://developer.mozilla.org/en-US/docs/Web/API/SpeechRecognitionErrorEvent/error
 */
const SPEECH_ERROR_MESSAGES: Record<string, string> = {
  "not-allowed": "Microphone access denied. Please allow microphone permission in your browser settings and try again.",
  "permission-denied": "Microphone access denied. Please allow microphone permission in your browser settings and try again.",
  "network": "Network error during voice recognition. Please check your connection.",
  "audio-capture": "No microphone detected. Please connect a microphone and try again.",
  "service-not-allowed": "Voice recognition is not supported in this browser. Try Chrome or Edge.",
};

/** Build the system prompt with today's date. */
function buildSystemMessage(): Message {
  return {
    role: "system",
    content: `You are the EquiProfile in-app AI assistant. Today's date is ${new Date().toLocaleDateString("en-GB", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}. You speak in British English.

EquiProfile is a comprehensive horse management platform. You help users navigate the app, manage their horses, and get the most out of every feature.

SECTIONS & PAGES:
Dashboard (Standard view for individual owners, Stable view for professional yards), Horses (profiles, photos, details), Health Records (veterinary visits, vaccinations, medications, farrier visits, dental, worming), Calendar (events, appointments, reminders), Tasks (to-do items with priorities and due dates), Appointments (vet, farrier, dentist bookings), Training (session logs, goals, progress tracking), Feeding & Nutrition (diet plans, feed schedules, supplements), GPS Ride Tracking (live route recording, distance, duration, pace), Documents (upload and organise files per horse), Weather (local forecast for planning), Reports (health summaries, training reports, exportable records), Analytics (trends, charts, insights across your horses), Contacts (vets, farriers, trainers, suppliers), Messages (in-app messaging), AI Chat (this conversation), Settings (account, preferences, notifications), Billing (subscription management).

KEY WORKFLOWS:
- Creating a horse: go to Horses → Add Horse, fill in name, breed, age, colour, and photo.
- Adding health records: open a horse's profile → Health Records tab → add vet visits, vaccinations, medications, farrier visits, dental, or worming entries.
- Scheduling training: go to Training → log a new session with date, type, duration, and notes.
- Creating tasks: go to Tasks → New Task with title, description, priority, and due date. You can also use the quick-action button below this chat.
- Adding calendar events: go to Calendar → Add Event. You can also use the quick-action button below this chat.
- Starting GPS tracking: go to GPS Ride Tracking → Start Ride to record a live route.
- Generating reports: go to Reports → choose report type and date range → export as PDF.

QUICK-ACTION BUTTONS:
Below this chat the user has quick-action buttons: "Create Task" and "Add Calendar Event". When they ask you to create a task or event, clearly describe what you recommend (title, date, details) so they can tap the button and save it directly.

PRICING:
- 7-day free trial, no card required.
- Pro: £10/month or £100/year — up to 5 horses, full feature access.
- Stable: £30/month or £300/year — up to 20 horses, team/staff access, stable-management tools.

DASHBOARD TYPES:
- Standard Dashboard: designed for individual horse owners managing their own horses.
- Stable Dashboard: designed for professional stables and yards, with multi-horse overview, staff management, and yard-level insights.

RULES:
- Always give EquiProfile-specific guidance. Reference actual sections, pages, and workflows.
- Never send users to competitor platforms or external horse-management tools.
- Never invent features that do not exist in EquiProfile.
- Be practical, specific, and concise. If you are unsure whether a feature exists, say so honestly.
- When answering horse care, health, training, or nutrition questions, give expert advice and explain how to record or track it within EquiProfile.
- If you are unable to help with a query, direct the user to support@equiprofile.online as a last resort — never as a first response.`,
  };
}

/** Load persisted user/assistant messages from sessionStorage. */
function loadPersistedMessages(): Message[] {
  try {
    const raw = sessionStorage.getItem(CHAT_SESSION_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) return parsed as Message[];
    }
  } catch {
    // Ignore parse errors — start fresh
  }
  return [];
}

/** Save non-system messages to sessionStorage. */
function persistMessages(messages: Message[]) {
  try {
    const toSave = messages.filter((m) => m.role !== "system");
    sessionStorage.setItem(CHAT_SESSION_KEY, JSON.stringify(toSave));
  } catch (err) {
    console.warn("[AIChat] Failed to persist chat session:", err);
  }
}

export default function AIChat() {
  const [messages, setMessages] = useState<Message[]>(() => {
    const persisted = loadPersistedMessages();
    return [buildSystemMessage(), ...persisted];
  });
  const [showPasswordInput, setShowPasswordInput] = useState(false);
  const [password, setPassword] = useState("");
  const [adminStatus, setAdminStatus] = useState<{
    isUnlocked: boolean;
    expiresAt?: Date;
  }>({ isUnlocked: false });

  // AI disclaimer — shown once per browser; remembered in localStorage
  const [showDisclaimer, setShowDisclaimer] = useState(() => {
    try {
      return !localStorage.getItem(AI_DISCLAIMER_KEY);
    } catch {
      return true;
    }
  });

  function acceptDisclaimer() {
    try { localStorage.setItem(AI_DISCLAIMER_KEY, "1"); } catch { /* ignore */ }
    setShowDisclaimer(false);
  }

  // Quick action dialog state
  const [taskDialogOpen, setTaskDialogOpen] = useState(false);
  const [eventDialogOpen, setEventDialogOpen] = useState(false);
  const [quickTaskForm, setQuickTaskForm] = useState({
    title: "",
    description: "",
    taskType: "general_care" as string,
    priority: "medium" as string,
    dueDate: "",
  });
  const [quickEventForm, setQuickEventForm] = useState({
    title: "",
    description: "",
    eventType: "other" as string,
    startDate: "",
    startTime: "",
  });

  const utils = trpc.useUtils();

  // Quick task creation from AI context
  const createTaskMutation = trpc.tasks.create.useMutation({
    onSuccess: () => {
      toast.success("Task created successfully!");
      setTaskDialogOpen(false);
      setQuickTaskForm({ title: "", description: "", taskType: "general_care", priority: "medium", dueDate: "" });
      utils.tasks.list.invalidate();
    },
    onError: (error) => {
      toast.error(error.message || "Failed to create task");
    },
  });

  // Quick calendar event creation from AI context
  const createEventMutation = trpc.calendar.createEvent.useMutation({
    onSuccess: () => {
      toast.success("Calendar event added successfully!");
      setEventDialogOpen(false);
      setQuickEventForm({ title: "", description: "", eventType: "other", startDate: "", startTime: "" });
      utils.calendar.getEvents.invalidate();
    },
    onError: (error) => {
      toast.error(error.message || "Failed to add calendar event");
    },
  });

  const handleCreateTask = () => {
    if (!quickTaskForm.title.trim()) {
      toast.error("Task title is required");
      return;
    }
    createTaskMutation.mutate({
      title: quickTaskForm.title.trim(),
      description: quickTaskForm.description.trim() || undefined,
      taskType: quickTaskForm.taskType as any,
      priority: quickTaskForm.priority as any,
      status: "pending",
      dueDate: quickTaskForm.dueDate || undefined,
      isRecurring: false,
    });
  };

  const handleCreateEvent = () => {
    if (!quickEventForm.title.trim()) {
      toast.error("Event title is required");
      return;
    }
    if (!quickEventForm.startDate) {
      toast.error("Start date is required");
      return;
    }
    const startDate = quickEventForm.startTime
      ? new Date(`${quickEventForm.startDate}T${quickEventForm.startTime}`)
      : new Date(`${quickEventForm.startDate}T09:00`);
    createEventMutation.mutate({
      title: quickEventForm.title.trim(),
      description: quickEventForm.description.trim() || undefined,
      eventType: quickEventForm.eventType as any,
      startDate: startDate.toISOString(),
      isAllDay: !quickEventForm.startTime,
    });
  };

  // Pre-fill quick action forms from last AI message context
  const MAX_AI_CONTEXT_LENGTH = 200;
  const lastAIMessage = messages.filter((m) => m.role === "assistant").at(-1);
  const hasAIConversation = messages.some((m) => m.role === "assistant");

  /** Extract a short title from an AI message (first meaningful sentence/line) */
  const extractTitleFromMessage = (content: string): string => {
    const firstLine = content.split(/[\n.!?]/)[0].replace(/[#*_`]/g, "").trim();
    return firstLine.length > 5 && firstLine.length <= 80 ? firstLine : "";
  };

  const openTaskDialog = () => {
    if (lastAIMessage) {
      const title = extractTitleFromMessage(lastAIMessage.content);
      setQuickTaskForm((f) => ({ ...f, title, description: lastAIMessage.content.slice(0, MAX_AI_CONTEXT_LENGTH) }));
    }
    setTaskDialogOpen(true);
  };

  const openEventDialog = () => {
    if (lastAIMessage) {
      const title = extractTitleFromMessage(lastAIMessage.content);
      // Default to tomorrow
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      setQuickEventForm((f) => ({
        ...f,
        title,
        description: lastAIMessage.content.slice(0, MAX_AI_CONTEXT_LENGTH),
        startDate: tomorrow.toISOString().split("T")[0],
      }));
    }
    setEventDialogOpen(true);
  };

  // Notes functionality
  const [isListening, setIsListening] = useState(false);
  const [wasVoiceRecorded, setWasVoiceRecorded] = useState(false);
  const [noteContent, setNoteContent] = useState("");
  const [noteTitle, setNoteTitle] = useState("");
  const recognitionRef = useRef<any>(null);

  const { data: notes, refetch: refetchNotes } = trpc.notes.list.useQuery({
    limit: 50,
  });

  const createNote = trpc.notes.create.useMutation({
    onSuccess: () => {
      toast.success("Note saved successfully!");
      setNoteContent("");
      setNoteTitle("");
      setWasVoiceRecorded(false);
      refetchNotes();
    },
    onError: (error) => {
      toast.error(error.message || "Failed to save note");
    },
  });

  const deleteNote = trpc.notes.delete.useMutation({
    onSuccess: () => {
      toast.success("Note deleted");
      refetchNotes();
    },
    onError: (error) => {
      toast.error(error.message || "Failed to delete note");
    },
  });

  const saveToCalendar = trpc.calendar.createEvent.useMutation({
    onSuccess: () => {
      toast.success("Note saved to calendar!");
    },
    onError: (error) => {
      toast.error(error.message || "Failed to save to calendar");
    },
  });

  const handleSaveToCalendar = (note: { title?: string | null; content: string; createdAt: string | Date }) => {
    const title = note.title || "Voice Note";
    // Schedule for the next whole hour (e.g., if it's 2:35 PM, schedule for 3:00 PM)
    const now = new Date();
    const startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate(), now.getHours() + 1, 0, 0, 0);
    saveToCalendar.mutate({
      title,
      description: note.content,
      eventType: "other",
      startDate: startDate.toISOString(),
    });
  };

  // Initialize Web Speech API — support both standard and webkit-prefixed versions
  useEffect(() => {
    if (typeof window === "undefined") return;
    const SpeechRecognitionAPI =
      (window as any).SpeechRecognition ||
      (window as any).webkitSpeechRecognition;
    if (!SpeechRecognitionAPI) return;

    const recognition = new SpeechRecognitionAPI();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = "en-US";

    recognition.onresult = (event: any) => {
      let finalTranscript = "";
      for (let i = event.resultIndex; i < event.results.length; i++) {
        const transcript = event.results[i][0].transcript;
        if (event.results[i].isFinal) {
          finalTranscript += transcript + " ";
        }
      }
      if (finalTranscript) {
        setNoteContent((prev) => prev + finalTranscript);
      }
    };

    recognition.onerror = (event: any) => {
      console.error("Speech recognition error:", event.error);
      setIsListening(false);
      const message = SPEECH_ERROR_MESSAGES[event.error as string];
      if (message) {
        toast.error(message);
      } else if (event.error !== "no-speech" && event.error !== "aborted") {
        toast.error("Voice recognition failed. Please try again.");
      }
    };

    recognition.onend = () => {
      setIsListening(false);
      // Mark that voice was used for this note so transcribed flag is set correctly on save
      setWasVoiceRecorded(true);
    };

    recognitionRef.current = recognition;

    return () => {
      if (recognitionRef.current) {
        try { recognitionRef.current.stop(); } catch { /* ignore stop errors on unmount */ }
      }
    };
  }, []);

  const toggleListening = () => {
    if (!recognitionRef.current) {
      toast.error("Voice recognition is not supported in your browser. Try Chrome or Edge for best results.");
      return;
    }

    if (isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    } else {
      // Starting a new recording — reset the voice flag for fresh session
      setWasVoiceRecorded(false);
      try {
        recognitionRef.current.start();
        setIsListening(true);
      } catch (err: any) {
        if (err?.message?.includes("already started")) {
          recognitionRef.current.stop();
          setIsListening(false);
        } else {
          toast.error("Could not start voice recording. Please ensure microphone access is allowed.");
        }
      }
    }
  };

  const handleSaveNote = () => {
    if (!noteContent.trim()) {
      toast.error("Note content is required");
      return;
    }

    createNote.mutate({
      title: noteTitle.trim() || undefined,
      content: noteContent.trim(),
      // Mark as transcribed if voice was used (even after stopping recording)
      transcribed: isListening || wasVoiceRecorded,
    });
  };

  const chatMutation = trpc.ai.chat.useMutation({
    onSuccess: (response: any) => {
      const message: Message = {
        role: response?.role === "assistant" ? "assistant" : "assistant",
        content: typeof response?.content === "string" ? response.content : "The AI assistant returned an unreadable response. No records were changed.",
      };
      setMessages((prev) => {
        const next = [...prev, message];
        persistMessages(next);
        return next;
      });
      if (response?.status === "unavailable") {
        toast.error("AI assistant unavailable — no records were changed.");
      }

      // Check if this is an admin challenge
      if (response.metadata?.adminChallenge) {
        setShowPasswordInput(true);
      }
    },
    onError: (error) => {
      // tRPC INTERNAL_SERVER_ERROR from the LLM wrapper, or a client-side
      // response-transform failure — both surface as non-actionable to the user.
      const isTransformOrInternal =
        (error as any)?.data?.code === "INTERNAL_SERVER_ERROR" ||
        error.message?.toLowerCase().includes("transform");
      const msg = isTransformOrInternal
        ? "Could not reach the AI service. Please try again in a moment."
        : (error.message || "Something went wrong — please try again.");
      toast.error(msg);
    },
  });

  const unlockMutation = trpc.adminUnlock.submitPassword.useMutation({
    onSuccess: (data) => {
      setShowPasswordInput(false);
      setPassword("");
      setAdminStatus({ isUnlocked: true, expiresAt: data.expiresAt });
      setMessages((prev) => {
        const next = [
          ...prev,
          {
            role: "assistant" as const,
            content: `✅ **Admin mode unlocked!**\n\nYou now have full admin access until ${new Date(data.expiresAt).toLocaleString()}.\n\n👉 The **[Open Admin Panel]** button has appeared in the top right — click it to access user management, system settings, API keys, and more.`,
          },
        ];
        persistMessages(next);
        return next;
      });
      toast.success("Admin mode unlocked successfully!");
    },
    onError: (error: any) => {
      setMessages((prev) => {
        const next = [
          ...prev,
          {
            role: "assistant" as const,
            content: `❌ ${error.message}`,
          },
        ];
        persistMessages(next);
        return next;
      });
      setPassword("");
      toast.error(error.message);
    },
  });

  const statusQuery = trpc.adminUnlock.getStatus.useQuery(undefined, {
    refetchInterval: 60000, // Check every minute
  });

  useEffect(() => {
    if (statusQuery.data) {
      setAdminStatus(statusQuery.data);
    }
  }, [statusQuery.data]);

  /** Matches "show admin" and "show afmin" (common typo) — stealth command */
  const ADMIN_COMMAND_PATTERN = /^show\s+(admin|afmin)\b/i;

  const handleSend = (content: string) => {
    // Stealth intercept: if the message matches the admin command, do NOT
    // add it to the chat transcript and do NOT send it to the backend.
    // Instead, silently open the password prompt.
    if (ADMIN_COMMAND_PATTERN.test(content.trim())) {
      setShowPasswordInput(true);
      return;
    }
    const newMessage: Message = { role: "user", content };
    setMessages((prev) => {
      const next = [...prev, newMessage];
      persistMessages(next);
      return next;
    });
    chatMutation.mutate({ messages: [...messages, newMessage] });
  };

  const handlePasswordSubmit = () => {
    if (password.trim()) {
      unlockMutation.mutate({ password });
    }
  };

  return (
    <DashboardLayout>
      {/* ── AI Disclaimer Modal ─────────────────────────────────────────────── */}
      <Dialog open={showDisclaimer} onOpenChange={(open) => { if (!open) acceptDisclaimer(); }}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Info className="w-5 h-5 text-amber-500" />
              AI Assistant — Important Notice
            </DialogTitle>
            <DialogDescription>
              Please read the following information before using the AI assistant.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 text-sm text-muted-foreground leading-relaxed">
            <p>
              The EquiProfile AI Assistant provides general information and guidance to
              help you manage your horses and use the platform effectively.
            </p>
            <div className="bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 rounded-lg p-3 space-y-2">
              <p className="font-semibold text-amber-800 dark:text-amber-300 text-xs uppercase tracking-wide">Please note:</p>
              <ul className="space-y-1.5 text-amber-700 dark:text-amber-400 text-xs">
                <li>• AI responses are <strong>informational only</strong> — not veterinary, medical, or professional advice</li>
                <li>• Always consult a qualified vet for any health or welfare concerns</li>
                <li>• AI guidance should never replace professional judgement for safety-critical decisions</li>
                <li>• The AI can make mistakes — always verify important information</li>
              </ul>
            </div>
            <p className="text-xs">
              By continuing, you acknowledge that AI-generated content is provided for
              general guidance purposes only.
            </p>
          </div>
          <DialogFooter>
            <Button onClick={acceptDisclaimer} className="w-full">
              <CheckCircle2 className="w-4 h-4 mr-2" />
              I understand — continue to AI Chat
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <div className="max-w-6xl mx-auto space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center gap-2 justify-between">
          <PageHeader title="AI Assistant & Notes" />
          {adminStatus.isUnlocked && (
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-3">
              <Alert className="w-full sm:w-auto border-green-500/50 bg-green-500/10 py-2">
                <ShieldCheck className="h-4 w-4 text-green-500" />
                <AlertDescription className="text-green-700 dark:text-green-400 text-xs">
                  Admin unlocked until{" "}
                  {adminStatus.expiresAt &&
                    new Date(adminStatus.expiresAt).toLocaleTimeString()}
                </AlertDescription>
              </Alert>
              <a href="/admin" className="shrink-0">
                <Button className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white border-0 w-full sm:w-auto">
                  <ExternalLink className="mr-2 h-4 w-4" />
                  Open Admin Panel
                </Button>
              </a>
            </div>
          )}
        </div>

        <Tabs defaultValue="chat" className="space-y-4">
          <TabsList className="grid w-full max-w-md grid-cols-2">
            <TabsTrigger value="chat">
              <MessageSquare className="w-4 h-4 mr-2" />
              AI Chat
            </TabsTrigger>
            <TabsTrigger value="notes">
              <FileText className="w-4 h-4 mr-2" />
              Voice Notes
            </TabsTrigger>
          </TabsList>

          <TabsContent value="chat">
            <div className="rounded-xl overflow-hidden border shadow-sm">
              <AIChatBox
                messages={messages}
                onSendMessage={handleSend}
                isLoading={chatMutation.isPending}
                placeholder="Ask about horse care, training, or management..."
                height="calc(100dvh - 280px)"
                suggestedPrompts={[
                  "Which horses have upcoming care tasks?",
                  "What is due this week?",
                  "Summarise my horses’ recent training.",
                  "Help me prepare a reminder or task.",
                ]}
              />

              {showPasswordInput && (
                <div className="mt-4 p-4 border rounded-lg bg-muted">
                  <div className="flex items-center gap-2 mb-2">
                    <Lock className="h-4 w-4" />
                    <span className="font-semibold">
                      Admin Password Required
                    </span>
                  </div>
                  <div className="flex gap-2">
                    <Input
                      type="password"
                      placeholder="Enter admin password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      onKeyDown={(e) =>
                        e.key === "Enter" && handlePasswordSubmit()
                      }
                      disabled={unlockMutation.isPending}
                    />
                    <Button
                      onClick={handlePasswordSubmit}
                      disabled={unlockMutation.isPending || !password.trim()}
                    >
                      Unlock
                    </Button>
                  </div>
                </div>
              )}

              {/* Quick Actions — save AI advice directly to Tasks or Calendar */}
              {hasAIConversation && !chatMutation.isPending && (
                <div className="mt-3 px-4 py-3 border-t bg-muted/30 flex flex-wrap items-center gap-2">
                  <span className="text-xs text-muted-foreground font-medium">
                    Save from this chat:
                  </span>
                  <Button
                    size="sm"
                    variant="outline"
                    className="h-8 text-xs gap-1.5"
                    onClick={openTaskDialog}
                  >
                    <ListChecks className="h-3.5 w-3.5" />
                    Create Task
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    className="h-8 text-xs gap-1.5"
                    onClick={openEventDialog}
                  >
                    <CalendarPlus className="h-3.5 w-3.5" />
                    Add to Calendar
                  </Button>
                </div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="notes" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Create Voice Note</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="note-title">Title (optional)</Label>
                  <Input
                    id="note-title"
                    placeholder="Note title..."
                    value={noteTitle}
                    onChange={(e) => setNoteTitle(e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="note-content">Content</Label>
                  <Textarea
                    id="note-content"
                    placeholder="Start dictating or type here..."
                    value={noteContent}
                    onChange={(e) => setNoteContent(e.target.value)}
                    rows={8}
                  />
                </div>

                <div className="flex gap-2">
                  <Button
                    onClick={toggleListening}
                    variant={isListening ? "destructive" : "default"}
                    disabled={!recognitionRef.current}
                  >
                    {isListening ? (
                      <>
                        <MicOff className="mr-2 h-4 w-4" />
                        Stop Recording
                      </>
                    ) : (
                      <>
                        <Mic className="mr-2 h-4 w-4" />
                        Start Voice Dictation
                      </>
                    )}
                  </Button>
                  <Button
                    onClick={handleSaveNote}
                    disabled={createNote.isPending || !noteContent.trim()}
                  >
                    <Save className="mr-2 h-4 w-4" />
                    Save Note
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => {
                      setNoteContent("");
                      setNoteTitle("");
                    }}
                  >
                    Clear
                  </Button>
                </div>

                {!recognitionRef.current && (
                  <Alert>
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>
                      Voice recognition is not supported in your browser. You
                      can still type notes manually.
                    </AlertDescription>
                  </Alert>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Saved Notes</CardTitle>
              </CardHeader>
              <CardContent>
                {notes && notes.length > 0 ? (
                  <div className="space-y-3">
                    {notes.map((note) => (
                      <Card key={note.id} className="p-4">
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex-1">
                            {note.title && (
                              <div className="font-semibold text-sm mb-1 flex items-center gap-2">
                                {note.transcribed && (
                                  <Badge
                                    variant="secondary"
                                    className="text-xs"
                                  >
                                    <Mic className="w-3 h-3 mr-1" />
                                    Voice
                                  </Badge>
                                )}
                                {note.title}
                              </div>
                            )}
                            <p className="text-sm text-muted-foreground line-clamp-3">
                              {note.content}
                            </p>
                            <div className="text-xs text-muted-foreground mt-2">
                              {new Date(note.createdAt).toLocaleString()}
                            </div>
                          </div>
                          <div className="flex items-center gap-1">
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => handleSaveToCalendar(note)}
                              disabled={saveToCalendar.isPending}
                              title="Save to Calendar"
                            >
                              <CalendarPlus className="w-4 h-4 text-primary" />
                            </Button>
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => deleteNote.mutate({ id: note.id })}
                              disabled={deleteNote.isPending}
                              title="Delete note"
                            >
                              <Trash2 className="w-4 h-4 text-destructive" />
                            </Button>
                          </div>
                        </div>
                      </Card>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    <FileText className="w-12 h-12 mx-auto mb-3 opacity-50" />
                    <p>No notes yet. Create your first note above!</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      {/* Quick Task Creation Dialog */}
      <Dialog open={taskDialogOpen} onOpenChange={setTaskDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <ListChecks className="h-5 w-5 text-primary" />
              Create Task
            </DialogTitle>
            <DialogDescription>
              Add a new task to your to-do list.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-3 py-2">
            <div className="space-y-1.5">
              <Label htmlFor="qt-title">Title</Label>
              <Input
                id="qt-title"
                value={quickTaskForm.title}
                onChange={(e) => setQuickTaskForm((f) => ({ ...f, title: e.target.value }))}
                placeholder="Task title..."
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="qt-desc">Description (optional)</Label>
              <Textarea
                id="qt-desc"
                value={quickTaskForm.description}
                onChange={(e) => setQuickTaskForm((f) => ({ ...f, description: e.target.value }))}
                placeholder="Details from AI conversation..."
                rows={3}
              />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label>Type</Label>
                <Select
                  value={quickTaskForm.taskType}
                  onValueChange={(v) => setQuickTaskForm((f) => ({ ...f, taskType: v }))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="general_care">General Care</SelectItem>
                    <SelectItem value="health_appointment">Health</SelectItem>
                    <SelectItem value="training">Training</SelectItem>
                    <SelectItem value="feeding">Feeding</SelectItem>
                    <SelectItem value="vaccination">Vaccination</SelectItem>
                    <SelectItem value="deworming">Deworming</SelectItem>
                    <SelectItem value="hoofcare">Hoof Care</SelectItem>
                    <SelectItem value="dental">Dental</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1.5">
                <Label>Priority</Label>
                <Select
                  value={quickTaskForm.priority}
                  onValueChange={(v) => setQuickTaskForm((f) => ({ ...f, priority: v }))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low">Low</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="high">High</SelectItem>
                    <SelectItem value="urgent">Urgent</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="qt-due">Due Date (optional)</Label>
              <Input
                id="qt-due"
                type="date"
                value={quickTaskForm.dueDate}
                onChange={(e) => setQuickTaskForm((f) => ({ ...f, dueDate: e.target.value }))}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setTaskDialogOpen(false)}>
              Cancel
            </Button>
            <Button
              onClick={handleCreateTask}
              disabled={createTaskMutation.isPending || !quickTaskForm.title.trim()}
            >
              <CheckCircle2 className="mr-2 h-4 w-4" />
              {createTaskMutation.isPending ? "Creating..." : "Create Task"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Quick Calendar Event Dialog */}
      <Dialog open={eventDialogOpen} onOpenChange={setEventDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <CalendarPlus className="h-5 w-5 text-primary" />
              Add to Calendar
            </DialogTitle>
            <DialogDescription>
              Schedule a new event on your calendar.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-3 py-2">
            <div className="space-y-1.5">
              <Label htmlFor="qe-title">Title</Label>
              <Input
                id="qe-title"
                value={quickEventForm.title}
                onChange={(e) => setQuickEventForm((f) => ({ ...f, title: e.target.value }))}
                placeholder="Event title..."
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="qe-desc">Description (optional)</Label>
              <Textarea
                id="qe-desc"
                value={quickEventForm.description}
                onChange={(e) => setQuickEventForm((f) => ({ ...f, description: e.target.value }))}
                placeholder="Details..."
                rows={2}
              />
            </div>
            <div className="space-y-1.5">
              <Label>Event Type</Label>
              <Select
                value={quickEventForm.eventType}
                onValueChange={(v) => setQuickEventForm((f) => ({ ...f, eventType: v }))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="training">Training</SelectItem>
                  <SelectItem value="veterinary">Vet</SelectItem>
                  <SelectItem value="farrier">Farrier</SelectItem>
                  <SelectItem value="competition">Competition</SelectItem>
                  <SelectItem value="lesson">Lesson</SelectItem>
                  <SelectItem value="meeting">Meeting</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label htmlFor="qe-date">Date</Label>
                <Input
                  id="qe-date"
                  type="date"
                  value={quickEventForm.startDate}
                  onChange={(e) => setQuickEventForm((f) => ({ ...f, startDate: e.target.value }))}
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="qe-time">Time (optional)</Label>
                <Input
                  id="qe-time"
                  type="time"
                  value={quickEventForm.startTime}
                  onChange={(e) => setQuickEventForm((f) => ({ ...f, startTime: e.target.value }))}
                />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setEventDialogOpen(false)}>
              Cancel
            </Button>
            <Button
              onClick={handleCreateEvent}
              disabled={createEventMutation.isPending || !quickEventForm.title.trim() || !quickEventForm.startDate}
            >
              <CalendarPlus className="mr-2 h-4 w-4" />
              {createEventMutation.isPending ? "Adding..." : "Add to Calendar"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
}
