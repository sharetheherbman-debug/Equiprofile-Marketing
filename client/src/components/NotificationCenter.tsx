import { useState, useEffect, useCallback } from "react";
import {
  Bell,
  X,
  Check,
  AlertTriangle,
  Calendar,
  Heart,
  Activity,
  DollarSign,
  Syringe,
  Cloud,
  Trash2,
} from "lucide-react";
import { Button } from "./ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "./ui/sheet";
import { Badge } from "./ui/badge";
import { useRealtime } from "../hooks/useRealtime";
import { useAuth } from "../_core/hooks/useAuth";

interface AppNotification {
  id: string;
  type:
    | "health"
    | "training"
    | "calendar"
    | "billing"
    | "vaccination"
    | "weather"
    | "system";
  title: string;
  message: string;
  timestamp: number;
  read: boolean;
  actionUrl?: string;
}

const LEGACY_NOTIFICATIONS_KEY = "equiprofile-notifications";
const MAX_NOTIFICATIONS = 50;

function notificationsKey(userId: number): string {
  return `equiprofile-notifications-${userId}`;
}

function getStoredNotifications(userId: number): AppNotification[] {
  try {
    const stored = localStorage.getItem(notificationsKey(userId));
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
}

function storeNotifications(userId: number, notifications: AppNotification[]) {
  const trimmed = notifications.slice(0, MAX_NOTIFICATIONS);
  localStorage.setItem(notificationsKey(userId), JSON.stringify(trimmed));
}

function getNotificationIcon(type: AppNotification["type"]) {
  switch (type) {
    case "health":
      return <Heart className="w-4 h-4 text-red-500" />;
    case "training":
      return <Activity className="w-4 h-4 text-green-500" />;
    case "calendar":
      return <Calendar className="w-4 h-4 text-blue-500" />;
    case "billing":
      return <DollarSign className="w-4 h-4 text-amber-500" />;
    case "vaccination":
      return <Syringe className="w-4 h-4 text-purple-500" />;
    case "weather":
      return <Cloud className="w-4 h-4 text-cyan-500" />;
    case "system":
      return <AlertTriangle className="w-4 h-4 text-orange-500" />;
    default:
      return <Bell className="w-4 h-4 text-muted-foreground" />;
  }
}

function mapRealtimeEventToNotification(
  event: string,
  data: any,
): AppNotification | null {
  const id = `${event}-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;
  const timestamp = Date.now();

  if (event.startsWith("horses:")) {
    const action = event.split(":")[1];
    return {
      id,
      type: "system",
      title: `Horse ${action}`,
      message: data?.name
        ? `Horse "${data.name}" has been ${action}`
        : `A horse has been ${action}`,
      timestamp,
      read: false,
      actionUrl: "/horses",
    };
  }

  if (event.startsWith("health:")) {
    const action = event.split(":")[1];
    return {
      id,
      type: "health",
      title: `Health Record ${action}`,
      message: data?.title
        ? `Health record "${data.title}" has been ${action}`
        : `A health record has been ${action}`,
      timestamp,
      read: false,
      actionUrl: "/health",
    };
  }

  if (event.startsWith("training:")) {
    const action = event.split(":")[1];
    return {
      id,
      type: "training",
      title: `Training ${action}`,
      message: `Training session has been ${action}`,
      timestamp,
      read: false,
      actionUrl: "/training",
    };
  }

  return null;
}

export function NotificationCenter() {
  const { user } = useAuth();
  const userId = user?.id ?? null;

  const [notifications, setNotifications] = useState<AppNotification[]>(() =>
    userId != null ? getStoredNotifications(userId) : [],
  );
  const [isOpen, setIsOpen] = useState(false);
  const { subscribe, isConnected } = useRealtime();

  // When user changes (e.g. login/logout), load the correct notifications and
  // clear the legacy browser-wide key to avoid cross-user leakage.
  useEffect(() => {
    if (userId != null) {
      setNotifications(getStoredNotifications(userId));
      // Remove the old unscoped key if it still exists
      localStorage.removeItem(LEGACY_NOTIFICATIONS_KEY);
    } else {
      setNotifications([]);
    }
  }, [userId]);

  const unreadCount = notifications.filter((n) => !n.read).length;

  // Subscribe to real-time events and create notifications
  useEffect(() => {
    if (userId == null) return;

    const eventTypes = [
      "horses:created",
      "horses:updated",
      "horses:deleted",
      "health:created",
      "health:updated",
      "training:created",
      "training:completed",
    ];

    const unsubscribers = eventTypes.map((eventType) =>
      subscribe(eventType, (data) => {
        const notification = mapRealtimeEventToNotification(eventType, data);
        if (notification) {
          setNotifications((prev) => {
            const updated = [notification, ...prev].slice(0, MAX_NOTIFICATIONS);
            storeNotifications(userId, updated);
            return updated;
          });
        }
      }),
    );

    return () => {
      unsubscribers.forEach((unsub) => unsub());
    };
  }, [subscribe, userId]);

  const markAsRead = useCallback((id: string) => {
    setNotifications((prev) => {
      const updated = prev.map((n) => (n.id === id ? { ...n, read: true } : n));
      if (userId != null) storeNotifications(userId, updated);
      return updated;
    });
  }, [userId]);

  const markAllAsRead = useCallback(() => {
    setNotifications((prev) => {
      const updated = prev.map((n) => ({ ...n, read: true }));
      if (userId != null) storeNotifications(userId, updated);
      return updated;
    });
  }, [userId]);

  const clearAll = useCallback(() => {
    setNotifications([]);
    if (userId != null) storeNotifications(userId, []);
  }, [userId]);

  const deleteNotification = useCallback((id: string) => {
    setNotifications((prev) => {
      const updated = prev.filter((n) => n.id !== id);
      if (userId != null) storeNotifications(userId, updated);
      return updated;
    });
  }, [userId]);

  const formatTime = (timestamp: number) => {
    const diff = Date.now() - timestamp;
    const mins = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (mins < 1) return "Just now";
    if (mins < 60) return `${mins}m ago`;
    if (hours < 24) return `${hours}h ago`;
    return `${days}d ago`;
  };

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="relative" aria-label="Open notifications">
          <Bell className="w-5 h-5" />
          {unreadCount > 0 && (
            <span className="absolute -top-0.5 -right-0.5 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center min-w-[18px] h-[18px] px-1">
              {unreadCount > 9 ? "9+" : unreadCount}
            </span>
          )}
        </Button>
      </SheetTrigger>
      <SheetContent className="w-full sm:max-w-md">
        <SheetHeader>
          <div className="flex items-center justify-between">
            <SheetTitle className="flex items-center gap-2">
              <Bell className="w-5 h-5" />
              Notifications
              {isConnected && (
                <span className="w-2 h-2 bg-green-500 rounded-full" />
              )}
            </SheetTitle>
          </div>
          <SheetDescription className="sr-only">
            Your recent activity notifications
          </SheetDescription>
          {notifications.length > 0 && (
            <div className="flex gap-2 pt-1">
              <Button
                variant="ghost"
                size="sm"
                className="text-xs h-7"
                onClick={markAllAsRead}
              >
                <Check className="w-3 h-3 mr-1" />
                Mark all read
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="text-xs h-7 text-destructive"
                onClick={clearAll}
              >
                <Trash2 className="w-3 h-3 mr-1" />
                Clear all
              </Button>
            </div>
          )}
        </SheetHeader>

        <div className="mt-4 space-y-2 max-h-[calc(100vh-120px)] overflow-y-auto">
          {notifications.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              <Bell className="w-10 h-10 mx-auto mb-3 opacity-30" />
              <p className="text-sm">No notifications yet</p>
              <p className="text-xs mt-1">
                You'll see updates here as they happen
              </p>
            </div>
          ) : (
            notifications.map((notification) => (
              <div
                key={notification.id}
                className={`flex items-start gap-3 p-3 rounded-lg border transition-colors cursor-pointer ${
                  notification.read
                    ? "bg-background hover:bg-muted/50"
                    : "bg-blue-50/50 dark:bg-blue-950/20 border-blue-200 dark:border-blue-800 hover:bg-blue-50 dark:hover:bg-blue-950/30"
                }`}
                onClick={() => {
                  markAsRead(notification.id);
                  if (notification.actionUrl) {
                    window.location.href = notification.actionUrl;
                    setIsOpen(false);
                  }
                }}
              >
                <div className="p-1.5 bg-muted rounded-md shrink-0">
                  {getNotificationIcon(notification.type)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-medium truncate">
                      {notification.title}
                    </p>
                    {!notification.read && (
                      <span className="w-2 h-2 bg-blue-500 rounded-full shrink-0" />
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground mt-0.5 line-clamp-2">
                    {notification.message}
                  </p>
                  <p className="text-[10px] text-muted-foreground mt-1">
                    {formatTime(notification.timestamp)}
                  </p>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  className="shrink-0 w-7 h-7"
                  aria-label={`Dismiss ${notification.title}`}
                  onClick={(e) => {
                    e.stopPropagation();
                    deleteNotification(notification.id);
                  }}
                >
                  <X className="w-3.5 h-3.5" />
                </Button>
              </div>
            ))
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}
