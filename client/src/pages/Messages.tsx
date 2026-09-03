import { useState, useRef, useEffect } from "react";
import { Link } from "wouter";
import DashboardLayout from "@/components/DashboardLayout";
import { Send, MessageSquare, Plus, Users, Shield, ChevronRight, Loader2 } from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { ScrollArea } from "../components/ui/scroll-area";
import { Badge } from "../components/ui/badge";
import { trpc } from "@/lib/trpc";
import { useRealtimeModule } from "@/hooks/useRealtime";
import { toast } from "sonner";
import { PageHeader } from "@/components/PageHeader";

interface MessageThread {
  id: number;
  stableId: number;
  title: string | null;
  isActive: boolean;
  createdAt: Date | string;
  updatedAt: Date | string;
  unreadCount?: number;
}

interface ThreadMessage {
  id: number;
  threadId: number;
  senderId: number;
  senderName?: string | null;
  content: string;
  attachments?: string | null;
  isRead: boolean;
  createdAt: Date | string;
}

export default function MessagesPage() {
  const [message, setMessage] = useState("");
  const [selectedThreadId, setSelectedThreadId] = useState<number | null>(null);
  const [newThreadTitle, setNewThreadTitle] = useState("");
  const [showNewThread, setShowNewThread] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  const { data: subscriptionStatus, isLoading: subLoading } =
    trpc.user.getSubscriptionStatus.useQuery();
  const isStablePlan =
    subscriptionStatus?.planTier === "stable" ||
    subscriptionStatus?.bothDashboardsUnlocked;

  // Get user's stables — disabled until we know the user has stable plan
  const { data: stables = [] } = trpc.stables.list.useQuery(undefined, {
    enabled: isStablePlan,
  });
  const selectedStableId = stables[0]?.id;

  // Get threads for the first stable
  const { data: threads = [], refetch: refetchThreads } =
    trpc.messages.getThreads.useQuery(
      { stableId: selectedStableId! },
      { enabled: isStablePlan && !!selectedStableId },
    );

  // Get messages for selected thread
  const { data: threadMessages = [], refetch: refetchMessages } =
    trpc.messages.getMessages.useQuery(
      { threadId: selectedThreadId! },
      { enabled: isStablePlan && !!selectedThreadId },
    );

  // Send message mutation
  const sendMutation = trpc.messages.sendMessage.useMutation({
    onSuccess: () => {
      setMessage("");
      refetchMessages();
    },
    onError: (error) => toast.error(error.message),
  });

  // Create thread mutation
  const createThreadMutation = trpc.messages.createThread.useMutation({
    onSuccess: (data) => {
      setNewThreadTitle("");
      setShowNewThread(false);
      setSelectedThreadId(data.id);
      refetchThreads();
      toast.success("Conversation created");
    },
    onError: (error) => toast.error(error.message),
  });

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [threadMessages]);

  // Real-time: refresh messages and thread list when any stable member sends a message
  useRealtimeModule(
    "messages",
    (_action) => {
      refetchMessages();
      refetchThreads();
    },
    isStablePlan && !!selectedStableId,
  );

  const handleSendMessage = () => {
    if (!message.trim() || !selectedThreadId) return;
    sendMutation.mutate({ threadId: selectedThreadId, content: message });
  };

  const handleCreateThread = () => {
    if (!selectedStableId) {
      toast.error("You need to be a member of a stable to use messaging");
      return;
    }
    createThreadMutation.mutate({
      stableId: selectedStableId,
      title: newThreadTitle.trim() || undefined,
    });
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  // Plan loading state
  if (subLoading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center min-h-[60vh]">
          <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
        </div>
      </DashboardLayout>
    );
  }

  // Upgrade gate for non-stable users
  if (!isStablePlan) {
    return (
      <DashboardLayout>
        <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
          <div className="w-12 h-12 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center mb-5">
            <Shield className="w-5 h-5 text-primary" />
          </div>
          <h2 className="font-serif text-2xl font-bold mb-2">Stable Plan Required</h2>
          <p className="text-muted-foreground mb-6 max-w-sm text-sm">
            Stable Messaging is exclusively for Stable plan subscribers. Upgrade to
            communicate with your yard team, clients, and staff.
          </p>
          <a href="/api/v1/billing/launch?product=management&action=home">
            <Button>
              Upgrade to Stable Plan
              <ChevronRight className="w-4 h-4 ml-1.5" />
            </Button>
          </a>
        </div>
      </DashboardLayout>
    );
  }

  const noStable = stables.length === 0;

  return (
    <DashboardLayout>
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <div>
            <PageHeader
              title="Messages"
              subtitle={selectedStableId && stables[0] ? stables[0].name : "Team communication for your stable"}
            />
          </div>
          {!noStable && (
            <Button
              size="sm"
              onClick={() => setShowNewThread(true)}
              disabled={createThreadMutation.isPending}
            >
              <Plus className="h-4 w-4 mr-1" />
              New Message
            </Button>
          )}
        </div>

        {noStable ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-16 text-center">
              <Users className="h-16 w-16 text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold mb-2">
                No stable membership
              </h3>
              <p className="text-muted-foreground max-w-sm">
                Messages are shared with stable members. Join or create a stable
                on the{" "}
                <a href="/stable" className="text-primary underline">
                  Stable page
                </a>{" "}
                to start messaging.
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid md:grid-cols-[300px_1fr] gap-4 h-auto md:h-[calc(100vh-12rem)]">
            {/* Threads List */}
            <Card className="flex flex-col">
              <CardHeader className="pb-2">
                <CardTitle className="text-base">
                  Messages
                </CardTitle>
              </CardHeader>
              <CardContent className="flex-1 p-0">
                <ScrollArea className="h-full">
                  {showNewThread && (
                    <div className="flex gap-2 p-3 border-b">
                      <Input
                        placeholder="Thread title (optional)"
                        value={newThreadTitle}
                        onChange={(e) => setNewThreadTitle(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter") handleCreateThread();
                          if (e.key === "Escape") setShowNewThread(false);
                        }}
                        autoFocus
                        className="text-sm"
                      />
                      <Button
                        size="sm"
                        onClick={handleCreateThread}
                        disabled={createThreadMutation.isPending}
                      >
                        {createThreadMutation.isPending ? "..." : "Create"}
                      </Button>
                    </div>
                  )}
                  {threads.length === 0 && !showNewThread ? (
                    <div className="flex flex-col items-center justify-center py-8 text-center px-4">
                      <MessageSquare className="h-10 w-10 text-muted-foreground mb-3" />
                      <p className="text-sm text-muted-foreground">
                        No messages yet
                      </p>
                      <Button
                        variant="outline"
                        size="sm"
                        className="mt-3"
                        onClick={() => setShowNewThread(true)}
                      >
                        <Plus className="h-3 w-3 mr-1" />
                        Start a conversation
                      </Button>
                    </div>
                  ) : (
                    threads.map((thread: MessageThread) => (
                      <button
                        key={thread.id}
                        className={`w-full text-left p-3 border-b hover:bg-muted/50 transition-colors ${
                          selectedThreadId === thread.id ? "bg-muted" : ""
                        }`}
                        onClick={() => setSelectedThreadId(thread.id)}
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium truncate">
                            {thread.title || "General"}
                          </span>
                          {(thread.unreadCount ?? 0) > 0 && (
                            <Badge variant="default" className="text-xs ml-1">
                              {thread.unreadCount}
                            </Badge>
                          )}
                        </div>
                        {thread.updatedAt && (
                          <p className="text-xs text-muted-foreground mt-0.5">
                            {new Date(thread.updatedAt).toLocaleDateString()}
                          </p>
                        )}
                      </button>
                    ))
                  )}
                </ScrollArea>
              </CardContent>
            </Card>

            {/* Chat Area */}
            <Card className="flex flex-col overflow-hidden">
              {selectedThreadId ? (
                <>
                  <CardHeader className="pb-2 border-b">
                    <CardTitle className="text-base">
                      {threads.find(
                        (th: MessageThread) => th.id === selectedThreadId,
                      )?.title || "General"}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="flex-1 flex flex-col p-0 overflow-hidden">
                    <ScrollArea className="flex-1 p-4">
                      {threadMessages.length === 0 ? (
                        <div className="flex flex-col items-center justify-center h-32 text-center">
                          <p className="text-sm text-muted-foreground">
                            No messages yet. Say hello!
                          </p>
                        </div>
                      ) : (
                        <div className="space-y-3">
                          {[...threadMessages]
                            .reverse()
                            .map((msg: ThreadMessage) => (
                              <div key={msg.id} className="flex flex-col gap-1">
                                <div className="flex items-center gap-2">
                                  <span className="text-xs font-medium text-muted-foreground">
                                    {msg.senderName || `User ${msg.senderId}`}
                                  </span>
                                  <span className="text-xs text-muted-foreground/60">
                                    {new Date(msg.createdAt).toLocaleTimeString(
                                      [],
                                      {
                                        hour: "2-digit",
                                        minute: "2-digit",
                                      },
                                    )}
                                  </span>
                                </div>
                                <p className="text-sm bg-muted rounded-lg px-3 py-2 w-fit max-w-[80%]">
                                  {msg.content}
                                </p>
                              </div>
                            ))}
                          <div ref={bottomRef} />
                        </div>
                      )}
                    </ScrollArea>

                    <div className="flex gap-2 p-3 border-t">
                      <Input
                        placeholder="Type a message..."
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        onKeyDown={handleKeyPress}
                      />
                      <Button
                        onClick={handleSendMessage}
                        disabled={!message.trim() || sendMutation.isPending}
                      >
                        <Send className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardContent>
                </>
              ) : (
                <CardContent className="flex-1 flex flex-col items-center justify-center text-center p-8">
                  <MessageSquare className="h-16 w-16 text-muted-foreground mb-4" />
                  <p className="text-muted-foreground">
                    Select a conversation to start messaging
                  </p>
                </CardContent>
              )}
            </Card>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
