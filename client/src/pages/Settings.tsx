import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { PageTransition } from "@/components/PageTransition";
import PlanAwareLayout from "@/components/PlanAwareLayout";
import { useState, useEffect, useRef } from "react";
import { toast } from "sonner";
import {
  Bell,
  Lock,
  User,
  Moon,
  MapPin,
  Loader2,
  Smartphone,
  Download,
  Share,
  HelpCircle,
  RotateCcw,
  Sparkles,
  Tag,
  Mic,
  Brain,
  CloudSun,
  BarChart3,
  FileUp,
  Calendar,
  Dumbbell,
  Heart,
  ChevronDown,
  ChevronRight,
} from "lucide-react";
import { useTheme } from "@/contexts/ThemeContext";
import { trpc } from "@/lib/trpc";
import { usePWAInstall } from "@/hooks/usePWAInstall";
import { OnboardingWizard } from "@/components/OnboardingWizard";
import { PageHeader } from "@/components/PageHeader";

export default function Settings() {
  const { user } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const [isCapturingLocation, setIsCapturingLocation] = useState(false);
  const [showOnboarding, setShowOnboarding] = useState(false);
  const pwa = usePWAInstall();
  const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
  const isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent);

  const resetOnboarding = trpc.user.resetOnboarding.useMutation();

  const handleRestartSetup = async () => {
    try {
      await resetOnboarding.mutateAsync();
      setShowOnboarding(true);
    } catch {
      toast.error("Unable to restart setup. Please try again.");
    }
  };

  const adminStatus = trpc.adminUnlock.getStatus.useQuery(undefined, {
    staleTime: 60_000,
  });

  const updateLocation = trpc.weather.updateLocation.useMutation({
    onSuccess: () => {
      toast.success("Location updated successfully");
      setIsCapturingLocation(false);
    },
    onError: (error) => {
      toast.error(error.message || "Failed to update location");
      setIsCapturingLocation(false);
    },
  });

  const updateProfile = trpc.user.updateProfile.useMutation({
    onSuccess: () => {
      toast.success("Profile updated successfully");
    },
    onError: (error) => {
      toast.error(error.message || "Failed to update profile");
    },
  });

  const updateNotificationPreferences =
    trpc.user.updateNotificationPreferences.useMutation({
      onSuccess: () => {
        toast.success("Notification preferences saved");
      },
      onError: (error) => {
        toast.error(error.message || "Failed to save preferences");
      },
    });

  const { data: savedNotificationPrefs } =
    trpc.user.getNotificationPreferences.useQuery();

  const [profileData, setProfileData] = useState({
    name: user?.name || "",
    email: user?.email || "",
  });

  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [isChangingPassword, setIsChangingPassword] = useState(false);

  const [notifications, setNotifications] = useState({
    emailNotifications: true,
    healthReminders: true,
    trainingReminders: true,
    feedingReminders: true,
    weatherAlerts: true,
    weeklyDigest: true,
    trainingCalendarIntegration: false,
    marketingAnalyticsConsent: false,
  });

  const [whatsappPhone, setWhatsappPhone] = useState<string>("");

  // Sync notification prefs from server when loaded
  useEffect(() => {
    if (savedNotificationPrefs) {
      setNotifications((prev) => ({ ...prev, ...savedNotificationPrefs }));
      setWhatsappPhone((savedNotificationPrefs as any).whatsappPhone ?? "");
    }
  }, [savedNotificationPrefs]);

  const handleProfileSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateProfile.mutate({ name: profileData.name });
  };

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast.error("Passwords don't match");
      return;
    }

    if (passwordData.newPassword.length < 8) {
      toast.error("Password must be at least 8 characters");
      return;
    }

    setIsChangingPassword(true);
    try {
      const res = await fetch("/api/auth/change-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          currentPassword: passwordData.currentPassword,
          newPassword: passwordData.newPassword,
        }),
      });
      if (res.ok) {
        toast.success("Password changed successfully");
        setPasswordData({
          currentPassword: "",
          newPassword: "",
          confirmPassword: "",
        });
      } else {
        const data = await res.json().catch(() => ({}));
        toast.error(data.error || "Failed to change password");
      }
    } catch {
      toast.error("Failed to change password. Please try again.");
    } finally {
      setIsChangingPassword(false);
    }
  };

  const handleNotificationSave = () => {
    updateNotificationPreferences.mutate({
      ...notifications,
      whatsappPhone: whatsappPhone.trim() || null,
    });
  };

  const captureLocation = () => {
    if (!navigator.geolocation) {
      toast.error("Geolocation is not supported by your browser");
      return;
    }

    setIsCapturingLocation(true);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        updateLocation.mutate({
          latitude: position.coords.latitude.toString(),
          longitude: position.coords.longitude.toString(),
          location: "",
        });
      },
      (error) => {
        toast.error(`Failed to get location: ${error.message}`);
        setIsCapturingLocation(false);
      },
    );
  };

  const avatarInputRef = useRef<HTMLInputElement>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);

  /** Compress and resize an image data URL to a max dimension of 512px JPEG */
  function compressAvatar(dataUrl: string): Promise<string> {
    return new Promise((resolve) => {
      const img = new Image();
      img.onload = () => {
        const MAX = 512;
        const scale = Math.min(MAX / img.width, MAX / img.height, 1);
        const canvas = document.createElement("canvas");
        canvas.width = Math.round(img.width * scale);
        canvas.height = Math.round(img.height * scale);
        const ctx = canvas.getContext("2d");
        if (!ctx) { resolve(dataUrl); return; }
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        resolve(canvas.toDataURL("image/jpeg", 0.82));
      };
      img.onerror = () => resolve(dataUrl);
      img.src = dataUrl;
    });
  }

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 2 * 1024 * 1024) {
      toast.error("Avatar image must be under 2MB");
      return;
    }
    const reader = new FileReader();
    reader.onload = async (ev) => {
      const rawDataUrl = ev.target?.result as string;
      const compressed = await compressAvatar(rawDataUrl);
      setAvatarPreview(compressed);
      updateProfile.mutate({ avatarData: compressed });
    };
    reader.readAsDataURL(file);
  };

  const isProfileLoading = updateProfile.isPending;

  return (
    <PlanAwareLayout>
      {showOnboarding && (
        <OnboardingWizard
          userName={user?.name || ""}
          onComplete={() => setShowOnboarding(false)}
          onSkip={() => setShowOnboarding(false)}
        />
      )}
      <PageTransition>
        <div className="container max-w-4xl py-8">
          <div className="mb-8">
            <PageHeader
              title="Settings"
              subtitle="Manage your account settings and preferences"
            />
          </div>

          <Tabs defaultValue="profile" className="space-y-6">
            <TabsList className="grid grid-cols-5 h-auto w-full gap-0 rounded-xl p-1">
              <TabsTrigger value="profile" className="flex flex-col items-center gap-1 py-2.5 px-1 rounded-lg text-[10px] sm:text-xs min-h-[52px] sm:min-h-[48px]">
                <User className="w-4 h-4 shrink-0" />
                <span className="leading-none">Profile</span>
              </TabsTrigger>
              <TabsTrigger value="security" className="flex flex-col items-center gap-1 py-2.5 px-1 rounded-lg text-[10px] sm:text-xs min-h-[52px] sm:min-h-[48px]">
                <Lock className="w-4 h-4 shrink-0" />
                <span className="leading-none">Security</span>
              </TabsTrigger>
              <TabsTrigger value="notifications" className="flex flex-col items-center gap-1 py-2.5 px-1 rounded-lg text-[10px] sm:text-xs min-h-[52px] sm:min-h-[48px]">
                <Bell className="w-4 h-4 shrink-0" />
                <span className="leading-none">Notifs</span>
              </TabsTrigger>
              <TabsTrigger value="install" className="flex flex-col items-center gap-1 py-2.5 px-1 rounded-lg text-[10px] sm:text-xs min-h-[52px] sm:min-h-[48px]">
                <Smartphone className="w-4 h-4 shrink-0" />
                <span className="leading-none">App</span>
              </TabsTrigger>
              <TabsTrigger value="help" className="flex flex-col items-center gap-1 py-2.5 px-1 rounded-lg text-[10px] sm:text-xs min-h-[52px] sm:min-h-[48px]">
                <HelpCircle className="w-4 h-4 shrink-0" />
                <span className="leading-none">Help</span>
              </TabsTrigger>

            </TabsList>

            {/* Profile Tab */}
            <TabsContent value="profile">
              <Card>
                <CardHeader>
                  <CardTitle>Profile Information</CardTitle>
                  <CardDescription>
                    Update your account profile information
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleProfileSave} className="space-y-6">
                    <div className="flex items-center gap-6">
                      <Avatar className="w-20 h-20">
                        <AvatarImage
                          src={
                            avatarPreview ?? user?.profileImageUrl ?? undefined
                          }
                          alt={user?.name ?? "Avatar"}
                        />
                        <AvatarFallback className="text-2xl">
                          {user?.name?.charAt(0).toUpperCase() || "U"}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <input
                          ref={avatarInputRef}
                          type="file"
                          accept="image/jpeg,image/png,image/webp,image/gif"
                          className="hidden"
                          onChange={handleAvatarChange}
                        />
                        <Button
                          variant="outline"
                          size="sm"
                          type="button"
                          onClick={() => avatarInputRef.current?.click()}
                          disabled={isProfileLoading}
                        >
                          Change Photo
                        </Button>
                        <p className="text-xs text-muted-foreground mt-2">
                          JPG, PNG or GIF. Max 2MB.
                        </p>
                      </div>
                    </div>

                    <Separator />

                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="name">Full Name</Label>
                        <Input
                          id="name"
                          value={profileData.name}
                          onChange={(e) =>
                            setProfileData({
                              ...profileData,
                              name: e.target.value,
                            })
                          }
                          disabled={isProfileLoading}
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="email">Email</Label>
                        <Input
                          id="email"
                          type="email"
                          value={profileData.email}
                          disabled
                          className="opacity-70"
                        />
                        <p className="text-xs text-muted-foreground">
                          Email cannot be changed here. Contact support if
                          needed.
                        </p>
                      </div>

                      <Separator />

                      <div className="space-y-3">
                        <Label>Location for Weather</Label>
                        <p className="text-sm text-muted-foreground">
                          Allow EquiProfile to access your location for accurate
                          weather forecasts and riding conditions.
                        </p>
                        <Button
                          type="button"
                          variant="outline"
                          onClick={captureLocation}
                          disabled={isCapturingLocation}
                        >
                          {isCapturingLocation ? (
                            <>
                              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                              Getting Location...
                            </>
                          ) : (
                            <>
                              <MapPin className="mr-2 h-4 w-4" />
                              Use My Current Location
                            </>
                          )}
                        </Button>
                      </div>
                    </div>

                    <Button type="submit" disabled={isProfileLoading}>
                      {isProfileLoading ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Saving...
                        </>
                      ) : (
                        "Save Changes"
                      )}
                    </Button>
                  </form>
                </CardContent>
              </Card>

            </TabsContent>

            {/* Security Tab */}
            <TabsContent value="security">
              <Card>
                <CardHeader>
                  <CardTitle>Change Password</CardTitle>
                  <CardDescription>
                    Update your password to keep your account secure
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handlePasswordChange} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="current-password">Current Password</Label>
                      <Input
                        id="current-password"
                        type="password"
                        value={passwordData.currentPassword}
                        onChange={(e) =>
                          setPasswordData({
                            ...passwordData,
                            currentPassword: e.target.value,
                          })
                        }
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="new-password">New Password</Label>
                      <Input
                        id="new-password"
                        type="password"
                        value={passwordData.newPassword}
                        onChange={(e) =>
                          setPasswordData({
                            ...passwordData,
                            newPassword: e.target.value,
                          })
                        }
                      />
                      <p className="text-xs text-muted-foreground">
                        Must be at least 8 characters
                      </p>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="confirm-password">
                        Confirm New Password
                      </Label>
                      <Input
                        id="confirm-password"
                        type="password"
                        value={passwordData.confirmPassword}
                        onChange={(e) =>
                          setPasswordData({
                            ...passwordData,
                            confirmPassword: e.target.value,
                          })
                        }
                      />
                    </div>

                    <Button type="submit" disabled={isChangingPassword}>
                      {isChangingPassword ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Changing...
                        </>
                      ) : (
                        "Change Password"
                      )}
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Notifications Tab */}
            <TabsContent value="notifications">
              <Card>
                <CardHeader>
                  <CardTitle>Notification Preferences</CardTitle>
                  <CardDescription>
                    Manage how you receive notifications
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    {[
                      {
                        key: "emailNotifications",
                        label: "Email Notifications",
                        description:
                          "Receive email notifications for important updates",
                      },
                      {
                        key: "healthReminders",
                        label: "Health Reminders",
                        description:
                          "Get notified about upcoming vet visits and vaccinations",
                      },
                      {
                        key: "trainingReminders",
                        label: "Training Reminders",
                        description:
                          "Reminders for scheduled training sessions",
                      },
                      {
                        key: "feedingReminders",
                        label: "Feeding Reminders",
                        description: "Notifications for feeding schedules",
                      },
                      {
                        key: "weatherAlerts",
                        label: "Weather Alerts",
                        description: "Alerts for adverse weather conditions",
                      },
                      {
                        key: "weeklyDigest",
                        label: "Weekly Digest",
                        description: "Receive a weekly summary of activities",
                      },
                      {
                        key: "trainingCalendarIntegration",
                        label: "Training → Calendar Auto-Events",
                        description:
                          "When you apply a training template to a horse, automatically create calendar events for each training session in the plan.",
                      },
                      {
                        key: "marketingAnalyticsConsent",
                        label: "Marketing Analytics",
                        description:
                          "Allow consented, non-identifying product conversion events to be shared with the separate marketing service. This does not affect essential account, payment, or safety notifications.",
                      },
                    ].map((item) => (
                      <div
                        key={item.key}
                        className="flex items-center justify-between"
                      >
                        <div className="space-y-0.5">
                          <Label htmlFor={item.key}>{item.label}</Label>
                          <p className="text-sm text-muted-foreground">
                            {item.description}
                          </p>
                        </div>
                        <Switch
                          id={item.key}
                          checked={
                            notifications[
                              item.key as keyof typeof notifications
                            ]
                          }
                          onCheckedChange={(checked) =>
                            setNotifications({
                              ...notifications,
                              [item.key]: checked,
                            })
                          }
                        />
                      </div>
                    ))}
                  </div>

                  {/* WhatsApp notification number */}
                  <div className="border-t pt-4 space-y-3">
                    <div>
                      <Label htmlFor="whatsapp-phone" className="flex items-center gap-1.5 text-sm font-medium">
                        <Smartphone className="w-4 h-4 text-green-600" />
                        WhatsApp Notifications
                      </Label>
                      <p className="text-xs text-muted-foreground mt-1 mb-2">
                        Enter your mobile number in international format (e.g. +447700900000) to receive WhatsApp reminders when the admin has WhatsApp configured.
                      </p>
                      <Input
                        id="whatsapp-phone"
                        type="tel"
                        placeholder="+447700900000"
                        value={whatsappPhone}
                        onChange={(e) => setWhatsappPhone(e.target.value)}
                        className="max-w-sm"
                        maxLength={20}
                      />
                    </div>
                  </div>

                  <Button
                    onClick={handleNotificationSave}
                    disabled={updateNotificationPreferences.isPending}
                  >
                    {updateNotificationPreferences.isPending ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Saving...
                      </>
                    ) : (
                      "Save Preferences"
                    )}
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Install App Tab */}
            <TabsContent value="install">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Smartphone className="w-5 h-5" />
                    Install EquiProfile App
                  </CardTitle>
                  <CardDescription>
                    Add EquiProfile to your phone home screen for instant access
                    — works like a native app
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  {pwa.isInstalled ? (
                    <div className="flex items-center gap-3 p-4 rounded-lg bg-green-50 dark:bg-green-950/30 border border-green-200 dark:border-green-800">
                      <Download className="w-5 h-5 text-green-600 dark:text-green-400" />
                      <div>
                        <p className="font-medium text-green-800 dark:text-green-300">
                          App installed
                        </p>
                        <p className="text-sm text-green-700 dark:text-green-400">
                          EquiProfile is installed on this device.
                        </p>
                      </div>
                    </div>
                  ) : pwa.canInstall ? (
                    <div className="space-y-4">
                      <div className="flex items-center gap-3 p-4 rounded-lg bg-indigo-50 dark:bg-indigo-950/30 border border-indigo-200 dark:border-indigo-800">
                        <Download className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                        <div className="flex-1">
                          <p className="font-medium text-indigo-800 dark:text-indigo-300">
                            Ready to install
                          </p>
                          <p className="text-sm text-indigo-700 dark:text-indigo-400">
                            One tap to add EquiProfile to your home screen.
                          </p>
                        </div>
                        <Button
                          onClick={pwa.install}
                          className="bg-gradient-to-r from-[#2e86ab] to-[#5b8def] text-white border-0"
                        >
                          <Download className="w-4 h-4 mr-2" />
                          Install Now
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-6">
                      {/* Android instructions */}
                      <div className="space-y-3">
                        <h3 className="font-semibold flex items-center gap-2">
                          <span className="text-lg">🤖</span> Android (Chrome)
                        </h3>
                        <ol className="list-decimal list-inside space-y-2 text-sm text-muted-foreground ml-1">
                          <li>
                            Open EquiProfile in <strong>Chrome</strong>
                          </li>
                          <li>
                            Tap the <strong>⋮ menu</strong> (three dots,
                            top-right)
                          </li>
                          <li>
                            Select <strong>"Add to Home screen"</strong> or{" "}
                            <strong>"Install app"</strong>
                          </li>
                          <li>
                            Tap <strong>Install</strong> to confirm
                          </li>
                        </ol>
                      </div>

                      {/* iOS instructions */}
                      <div className="space-y-3">
                        <h3 className="font-semibold flex items-center gap-2">
                          <span className="text-lg">🍎</span> iPhone / iPad
                          (Safari)
                        </h3>
                        <ol className="list-decimal list-inside space-y-2 text-sm text-muted-foreground ml-1">
                          <li>
                            Open EquiProfile in <strong>Safari</strong>
                          </li>
                          <li>
                            Tap the{" "}
                            <strong>
                              <Share className="w-3.5 h-3.5 inline-block mb-0.5" />{" "}
                              Share
                            </strong>{" "}
                            button (bottom toolbar)
                          </li>
                          <li>
                            Scroll down and tap{" "}
                            <strong>"Add to Home Screen"</strong>
                          </li>
                          <li>
                            Tap <strong>Add</strong> to confirm
                          </li>
                        </ol>
                      </div>

                      {isIOS && isSafari && (
                        <div className="p-3 rounded-lg bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 text-sm">
                          <p className="text-amber-800 dark:text-amber-300">
                            <strong>Tip:</strong> You're on Safari — tap the
                            Share button at the bottom of the screen, then "Add
                            to Home Screen".
                          </p>
                        </div>
                      )}
                    </div>
                  )}

                  <div className="pt-2 border-t">
                    <h3 className="font-semibold text-sm mb-2">What you get</h3>
                    <ul className="space-y-1.5 text-sm text-muted-foreground">
                      <li className="flex items-center gap-2">
                        ✓ Launch from home screen like a native app
                      </li>
                      <li className="flex items-center gap-2">
                        ✓ Full-screen experience (no browser bar)
                      </li>
                      <li className="flex items-center gap-2">
                        ✓ Push notifications for reminders
                      </li>
                      <li className="flex items-center gap-2">
                        ✓ Works offline for recent data
                      </li>
                    </ul>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Help & Setup Tab */}
            <TabsContent value="help">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <HelpCircle className="w-5 h-5" />
                    Help & Setup
                  </CardTitle>
                  <CardDescription>
                    Guides, tips, and quick links to help you get the most out of EquiProfile
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Guided Setup */}
                  <div className="flex items-start gap-4 p-4 rounded-xl border border-indigo-500/20 bg-indigo-500/5">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#3a93b8] to-[#5b8def] flex items-center justify-center shrink-0 mt-0.5">
                      <Sparkles className="w-5 h-5 text-white" />
                    </div>
                    <div className="flex-1 space-y-1">
                      <p className="font-semibold text-sm">Guided Setup</p>
                      <p className="text-sm text-muted-foreground">
                        Walk through adding your first horse, choosing your experience, and discovering the key areas of the dashboard.
                      </p>
                    </div>
                  </div>

                  <Button
                    onClick={handleRestartSetup}
                    disabled={resetOnboarding.isPending}
                    className="flex items-center gap-2"
                  >
                    {resetOnboarding.isPending ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <RotateCcw className="w-4 h-4" />
                    )}
                    Restart Setup
                  </Button>

                  <Separator />

                  {/* Quick Links */}
                  <div className="space-y-3">
                    <h3 className="text-sm font-semibold">Quick links</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm">
                      {[
                        { label: "My Horses", path: "/horses" },
                        { label: "Health Records", path: "/health" },
                        { label: "Training", path: "/training" },
                        { label: "Documents", path: "/documents" },
                        { label: "Calendar", path: "/calendar" },
                        { label: "Dashboard", path: "/dashboard" },
                        { label: "Analytics", path: "/analytics" },
                        { label: "AI Assistant", path: "/ai-chat" },
                      ].map(({ label, path }) => (
                        <a
                          key={path}
                          href={path}
                          className="flex items-center gap-2 p-2.5 rounded-lg border border-border hover:bg-accent transition-colors"
                        >
                          <span className="text-primary">→</span>
                          {label}
                        </a>
                      ))}
                    </div>
                  </div>

                  <Separator />

                  {/* Feature Guides */}
                  <div className="space-y-3">
                    <h3 className="text-sm font-semibold">Platform Feature Guides</h3>
                    <div className="space-y-3">

                      {/* AI Chat guide */}
                      <div className="rounded-lg border border-border bg-muted/30 p-4 space-y-2 text-sm">
                        <div className="flex items-center gap-2 font-semibold text-foreground">
                          <Brain className="w-4 h-4 text-indigo-500" />
                          AI Assistant
                        </div>
                        <p className="text-muted-foreground">Your built-in AI assistant can answer questions about horse care, help you navigate the platform, and suggest training ideas.</p>
                        <ul className="list-disc list-inside space-y-1 ml-1 text-muted-foreground">
                          <li>Ask anything about horse management, feeding, health, or training</li>
                          <li>Use <strong className="text-foreground">Voice Notes</strong> to dictate notes from the stable using your microphone</li>
                          <li>AI guidance is informational — always consult a vet for health decisions</li>
                          <li>Chat history is saved during your session; clear it from the AI Chat page</li>
                        </ul>
                      </div>

                      {/* Voice Notes guide */}
                      <div className="rounded-lg border border-border bg-muted/30 p-4 space-y-2 text-sm">
                        <div className="flex items-center gap-2 font-semibold text-foreground">
                          <Mic className="w-4 h-4 text-rose-500" />
                          Voice Notes
                        </div>
                        <p className="text-muted-foreground">Record notes hands-free from the stable or arena. Your speech is transcribed automatically.</p>
                        <ul className="list-disc list-inside space-y-1 ml-1 text-muted-foreground">
                          <li>Go to <strong className="text-foreground">AI Chat → Voice Notes tab</strong></li>
                          <li>Press the microphone button — your browser will ask for microphone permission</li>
                          <li>Speak clearly; the transcription appears in real time</li>
                          <li>Press stop when finished, then save your note</li>
                          <li><strong className="text-foreground">Note:</strong> Voice recognition works best in Chrome, Edge, or Safari. Firefox may not support it.</li>
                        </ul>
                      </div>

                      {/* Weather guide */}
                      <div className="rounded-lg border border-border bg-muted/30 p-4 space-y-2 text-sm">
                        <div className="flex items-center gap-2 font-semibold text-foreground">
                          <CloudSun className="w-4 h-4 text-sky-500" />
                          Weather & Riding Conditions
                        </div>
                        <p className="text-muted-foreground">Live weather data with intelligent recommendations on whether conditions are suitable for specific equestrian activities.</p>
                        <ul className="list-disc list-inside space-y-1 ml-1 text-muted-foreground">
                          <li>Set your location in <strong className="text-foreground">Settings → Location</strong> for accurate local weather</li>
                          <li>Recommendations cover hacking, arena work, jumping, competition prep, and groundwork</li>
                          <li>Warnings are shown for extreme heat, high wind, lightning risk, or heavy rain</li>
                          <li>The 7-day forecast helps you plan your weekly training schedule</li>
                        </ul>
                      </div>

                      {/* Analytics guide */}
                      <div className="rounded-lg border border-border bg-muted/30 p-4 space-y-2 text-sm">
                        <div className="flex items-center gap-2 font-semibold text-foreground">
                          <BarChart3 className="w-4 h-4 text-emerald-500" />
                          Analytics
                        </div>
                        <p className="text-muted-foreground">Visualise your horses' training progress, health spending, and competition results with clear charts and trend data.</p>
                        <ul className="list-disc list-inside space-y-1 ml-1 text-muted-foreground">
                          <li><strong className="text-foreground">Training tab:</strong> Monthly volume, session types, and performance ratings</li>
                          <li><strong className="text-foreground">Performance tab:</strong> Competition placements and prize winnings</li>
                          <li><strong className="text-foreground">Health tab:</strong> Monthly vet costs and health record categories</li>
                          <li><strong className="text-foreground">Comparison tab:</strong> Side-by-side activity comparison across all horses</li>
                          <li>Data updates automatically as you log records across the platform</li>
                        </ul>
                      </div>

                      {/* Documents / Uploads guide */}
                      <div className="rounded-lg border border-border bg-muted/30 p-4 space-y-2 text-sm">
                        <div className="flex items-center gap-2 font-semibold text-foreground">
                          <FileUp className="w-4 h-4 text-blue-500" />
                          Documents & File Uploads
                        </div>
                        <p className="text-muted-foreground">Upload, organise, and retrieve any file related to your horses — passports, vet records, competition certificates, photos, and more.</p>
                        <ul className="list-disc list-inside space-y-1 ml-1 text-muted-foreground">
                          <li>Supported formats: <strong className="text-foreground">JPEG, PNG, WebP, HEIC, PDF, Word, Excel, CSV, TXT</strong></li>
                          <li>Maximum file size: <strong className="text-foreground">10 MB</strong> per upload</li>
                          <li>iPhone photos (HEIC format) are automatically converted to JPEG</li>
                          <li>You can attach documents to a specific horse or keep them as general yard documents</li>
                          <li>Use the category selector (Health, Passport, Insurance, Gallery, etc.) to keep documents organised</li>
                        </ul>
                      </div>

                      {/* Training Templates guide */}
                      <div className="rounded-lg border border-border bg-muted/30 p-4 space-y-2 text-sm">
                        <div className="flex items-center gap-2 font-semibold text-foreground">
                          <Dumbbell className="w-4 h-4 text-violet-500" />
                          Training Templates
                        </div>
                        <p className="text-muted-foreground">Pre-designed training programmes to give structure to your horse's work. Choose from flatwork, jumping, conditioning, dressage, young horse development, and competition prep plans.</p>
                        <ul className="list-disc list-inside space-y-1 ml-1 text-muted-foreground">
                          <li>Browse templates under <strong className="text-foreground">Training → Training Templates</strong></li>
                          <li>Apply a template to start a structured programme for any horse</li>
                          <li>Each template includes warmup, main work, cooldown, and safety notes per week</li>
                          <li>Create your own custom templates and share them with the community</li>
                        </ul>
                      </div>

                      {/* Tags guide */}
                      <div className="rounded-lg border border-border bg-muted/30 p-4 space-y-2 text-sm">
                        <div className="flex items-center gap-2 font-semibold text-foreground">
                          <Tag className="w-4 h-4 text-primary" />
                          Using Tags
                        </div>
                        <p className="text-muted-foreground">Tags are coloured labels you can attach to horses to group and categorise them however suits your yard.</p>
                        <ul className="list-disc list-inside space-y-1 ml-1 text-muted-foreground">
                          <li>Go to <strong className="text-foreground">Tags</strong> in the sidebar to create and manage tags</li>
                          <li>Open any horse profile and add tags from the horse detail page</li>
                          <li>On the Horses list, click a tag chip to filter by that tag instantly</li>
                          <li>Examples: <em>In Training, For Sale, Competition Horse, Retired, Client: Smith</em></li>
                        </ul>
                      </div>

                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

          </Tabs>
        </div>
      </PageTransition>
    </PlanAwareLayout>
  );
}
