import { useState } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { trpc } from "@/lib/trpc";
import {
  Mail,
  Trash2,
  UserCog,
  Shield,
  ChevronRight,
  Users,
  Loader2,
  UserPlus,
  Clock,
  CheckCircle,
  Crown,
} from "lucide-react";
import { toast } from "sonner";
import { Link } from "wouter";
import { PageHeader } from "@/components/PageHeader";
import { useAuth } from "@/_core/hooks/useAuth";

const INVITE_ROLES = [
  { value: "admin", label: "Admin" },
  { value: "trainer", label: "Trainer" },
  { value: "member", label: "Member" },
  { value: "viewer", label: "Viewer" },
] as const;

type InviteRole = (typeof INVITE_ROLES)[number]["value"];

const ROLE_COLORS: Record<string, string> = {
  owner: "bg-amber-500/20 text-amber-300 border-amber-500/30",
  admin: "bg-purple-500/20 text-purple-300 border-purple-500/30",
  trainer: "bg-blue-500/20 text-blue-300 border-blue-500/30",
  member: "bg-emerald-500/20 text-emerald-300 border-emerald-500/30",
  viewer: "bg-slate-500/20 text-slate-300 border-slate-500/30",
};

const ROLE_ICONS: Record<string, React.ReactNode> = {
  owner: <Crown className="w-3 h-3" />,
  admin: <Shield className="w-3 h-3" />,
};

function getRoleColor(role: string) {
  return ROLE_COLORS[role] ?? "bg-slate-500/20 text-slate-300 border-slate-500/30";
}

function StableStaffContent() {
  const { user } = useAuth();
  const utils = trpc.useUtils();

  // Get the user's first stable
  const { data: stablesList = [] } = trpc.stables.list.useQuery();
  const stableId = stablesList[0]?.id;
  const stableName = stablesList[0]?.name;

  // Determine if the current user is admin/owner of this stable
  const { data: members = [], isLoading: membersLoading } =
    trpc.stables.getMembers.useQuery(
      { stableId: stableId! },
      { enabled: !!stableId },
    );

  const currentMember = members.find((m) => m.userId === user?.id);
  const isAdminOrOwner = currentMember
    ? ["owner", "admin"].includes(currentMember.role)
    : false;

  const { data: pendingInvites = [], isLoading: invitesLoading } =
    trpc.stables.getInvites.useQuery(
      { stableId: stableId! },
      { enabled: !!stableId && isAdminOrOwner },
    );

  const inviteMutation = trpc.stables.inviteMember.useMutation({
    onSuccess: () => {
      toast.success("Invite sent! They'll receive an email with the invite link.");
      setIsInviteOpen(false);
      setInviteEmail("");
      setInviteRole("member");
      utils.stables.getInvites.invalidate({ stableId: stableId! });
    },
    onError: (err) => toast.error(err.message ?? "Failed to send invite"),
  });

  const cancelInviteMutation = trpc.stables.cancelInvite.useMutation({
    onSuccess: () => {
      toast.success("Invite cancelled");
      utils.stables.getInvites.invalidate({ stableId: stableId! });
    },
    onError: (err) => toast.error(err.message ?? "Failed to cancel invite"),
  });

  const removeMemberMutation = trpc.stables.removeMember.useMutation({
    onSuccess: () => {
      toast.success("Member removed from stable");
      utils.stables.getMembers.invalidate({ stableId: stableId! });
      setRemoveTarget(null);
    },
    onError: (err) => toast.error(err.message ?? "Failed to remove member"),
  });

  const [isInviteOpen, setIsInviteOpen] = useState(false);
  const [inviteEmail, setInviteEmail] = useState("");
  const [inviteRole, setInviteRole] = useState<InviteRole>("member");
  const [removeTarget, setRemoveTarget] = useState<{
    id: number;
    name: string | null;
  } | null>(null);

  const handleInvite = () => {
    if (!inviteEmail.trim() || !stableId) return;
    inviteMutation.mutate({
      stableId,
      email: inviteEmail.trim().toLowerCase(),
      role: inviteRole,
    });
  };

  const isLoading = membersLoading || invitesLoading;

  return (
    <div className="space-y-6 pb-6">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <PageHeader
          title="Staff &amp; Team"
          subtitle={
            stableName
              ? `Manage your team for ${stableName}`
              : "Manage your stable's team members and invitations."
          }
        />
        {isAdminOrOwner && (
          <Button
            onClick={() => setIsInviteOpen(true)}
            className="bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white border-0 gap-2"
          >
            <UserPlus className="w-4 h-4" /> Invite Member
          </Button>
        )}
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
        </div>
      ) : (
        <>
          {/* Current members */}
          <Card className="border-white/5 bg-card/80 backdrop-blur-sm">
            <CardHeader className="pb-3">
              <CardTitle className="font-serif text-base flex items-center gap-2">
                <Users className="w-4 h-4 text-blue-400" />
                Team Members
              </CardTitle>
              <CardDescription className="text-xs">
                {members.length} active member{members.length !== 1 ? "s" : ""}{" "}
                in your stable
              </CardDescription>
            </CardHeader>
            <CardContent>
              {members.length === 0 ? (
                <div className="text-center py-10 text-muted-foreground">
                  <UserCog className="w-10 h-10 mx-auto mb-3 opacity-30" />
                  <p className="text-sm font-medium mb-1">No team members yet</p>
                  <p className="text-xs">
                    Invite someone to get started.
                  </p>
                </div>
              ) : (
                <div className="space-y-2">
                  {members.map((member) => (
                    <div
                      key={member.id}
                      className="flex items-center gap-3 p-3 rounded-lg border border-muted/40 bg-muted/20 hover:bg-muted/30 transition-colors"
                    >
                      <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center shrink-0">
                        {member.avatarUrl ? (
                          <img
                            src={member.avatarUrl}
                            alt=""
                            className="w-10 h-10 rounded-full object-cover"
                          />
                        ) : (
                          <span className="text-sm text-foreground font-bold">
                            {(member.name ?? member.email ?? "?")
                              .charAt(0)
                              .toUpperCase()}
                          </span>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <p className="text-sm font-medium">
                            {member.name ?? member.email ?? "Unknown"}
                          </p>
                          <Badge
                            className={`text-[10px] px-1.5 py-0 border flex items-center gap-1 ${getRoleColor(member.role)}`}
                          >
                            {ROLE_ICONS[member.role]}
                            {member.role.charAt(0).toUpperCase() +
                              member.role.slice(1)}
                          </Badge>
                          {member.userId === user?.id && (
                            <span className="text-[10px] text-muted-foreground">(you)</span>
                          )}
                        </div>
                        {member.email && (
                          <span className="text-xs text-muted-foreground flex items-center gap-1 mt-0.5">
                            <Mail className="w-3 h-3" /> {member.email}
                          </span>
                        )}
                      </div>
                      {isAdminOrOwner &&
                        member.userId !== user?.id &&
                        member.role !== "owner" && (
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-muted-foreground hover:text-destructive shrink-0"
                            onClick={() =>
                              setRemoveTarget({
                                id: member.id,
                                name: member.name ?? member.email,
                              })
                            }
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </Button>
                        )}
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Pending invites */}
          {isAdminOrOwner && (
            <Card className="border-white/5 bg-card/80 backdrop-blur-sm">
              <CardHeader className="pb-3">
                <CardTitle className="font-serif text-base flex items-center gap-2">
                  <Clock className="w-4 h-4 text-amber-400" />
                  Pending Invitations
                </CardTitle>
                <CardDescription className="text-xs">
                  {pendingInvites.length} pending invite
                  {pendingInvites.length !== 1 ? "s" : ""}
                </CardDescription>
              </CardHeader>
              <CardContent>
                {pendingInvites.length === 0 ? (
                  <div className="text-center py-6 text-muted-foreground">
                    <CheckCircle className="w-8 h-8 mx-auto mb-2 opacity-30" />
                    <p className="text-xs">No pending invites</p>
                  </div>
                ) : (
                  <div className="space-y-2">
                    {pendingInvites.map((invite) => (
                      <div
                        key={invite.id}
                        className="flex items-center gap-3 p-3 rounded-lg border border-amber-500/20 bg-amber-500/5"
                      >
                        <div className="w-9 h-9 rounded-full bg-amber-500/20 flex items-center justify-center shrink-0">
                          <Mail className="w-4 h-4 text-amber-400" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium truncate">
                            {invite.email}
                          </p>
                          <div className="flex items-center gap-2 mt-0.5 flex-wrap">
                            <Badge
                              className={`text-[10px] px-1.5 py-0 border ${getRoleColor(invite.role)}`}
                            >
                              {invite.role.charAt(0).toUpperCase() +
                                invite.role.slice(1)}
                            </Badge>
                            <span className="text-[10px] text-muted-foreground">
                              Expires{" "}
                              {new Date(invite.expiresAt).toLocaleDateString()}
                            </span>
                          </div>
                        </div>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-muted-foreground hover:text-destructive shrink-0"
                          onClick={() =>
                            cancelInviteMutation.mutate({
                              stableId: stableId!,
                              inviteId: invite.id,
                            })
                          }
                          disabled={cancelInviteMutation.isPending}
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          )}
        </>
      )}

      {/* Link to full contacts for non-staff contacts */}
      <div className="flex items-center justify-between rounded-xl border border-white/5 bg-card/60 p-4">
        <div>
          <p className="text-sm font-medium">Owners &amp; Clients</p>
          <p className="text-xs text-muted-foreground">
            Manage horse owners, livery clients, breeders, and other external
            contacts
          </p>
        </div>
        <Link href="/contacts">
          <Button variant="outline" size="sm" className="gap-1">
            Open Contacts <ChevronRight className="w-3.5 h-3.5" />
          </Button>
        </Link>
      </div>

      {/* Invite Dialog */}
      <Dialog
        open={isInviteOpen}
        onOpenChange={(v) => {
          setIsInviteOpen(v);
          if (!v) {
            setInviteEmail("");
            setInviteRole("member");
          }
        }}
      >
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <UserPlus className="w-5 h-5 text-blue-400" />
              Invite Team Member
            </DialogTitle>
            <DialogDescription>
              Enter their email address. They'll receive an invite link to join
              your stable on EquiProfile.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-1.5">
              <Label>Email address *</Label>
              <Input
                type="email"
                placeholder="name@example.com"
                value={inviteEmail}
                onChange={(e) => setInviteEmail(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") handleInvite();
                }}
              />
            </div>
            <div className="space-y-1.5">
              <Label>Role</Label>
              <Select
                value={inviteRole}
                onValueChange={(v) => setInviteRole(v as InviteRole)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {INVITE_ROLES.map((role) => (
                    <SelectItem key={role.value} value={role.value}>
                      {role.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <p className="text-[11px] text-muted-foreground">
                Admins can manage staff and invites. Trainers and Members can
                access stable tools. Viewers have read-only access.
              </p>
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsInviteOpen(false)}
            >
              Cancel
            </Button>
            <Button
              onClick={handleInvite}
              disabled={!inviteEmail.trim() || inviteMutation.isPending}
              className="bg-gradient-to-r from-blue-600 to-cyan-600 text-white border-0"
            >
              {inviteMutation.isPending ? (
                <Loader2 className="w-4 h-4 animate-spin mr-2" />
              ) : (
                <Mail className="w-4 h-4 mr-2" />
              )}
              Send Invite
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Confirm remove member dialog */}
      <AlertDialog
        open={!!removeTarget}
        onOpenChange={(v) => {
          if (!v) setRemoveTarget(null);
        }}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Remove team member?</AlertDialogTitle>
            <AlertDialogDescription>
              {removeTarget?.name
                ? `This will remove ${removeTarget.name} from your stable.`
                : "This will remove this member from your stable."}{" "}
              They will lose access immediately. You can re-invite them later.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              onClick={() => {
                if (removeTarget) {
                  removeMemberMutation.mutate({
                    stableId: stableId!,
                    memberId: removeTarget.id,
                  });
                }
              }}
            >
              Remove member
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

export default function StableStaff() {
  const { data: subscriptionStatus, isLoading: subLoading } =
    trpc.user.getSubscriptionStatus.useQuery();
  const isStablePlan =
    subscriptionStatus?.planTier === "stable" ||
    subscriptionStatus?.bothDashboardsUnlocked;

  if (subLoading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center min-h-[60vh]">
          <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
        </div>
      </DashboardLayout>
    );
  }

  if (!isStablePlan) {
    return (
      <DashboardLayout>
        <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
          <div className="w-12 h-12 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center mb-5">
            <Shield className="w-5 h-5 text-primary" />
          </div>
          <h2 className="font-serif text-2xl font-bold mb-2">
            Stable Plan Required
          </h2>
          <p className="text-muted-foreground mb-6 max-w-sm text-sm">
            Staff &amp; Team Management is exclusively for Stable plan
            subscribers. Upgrade to invite and manage your stable's team.
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

  return (
    <DashboardLayout>
      <StableStaffContent />
    </DashboardLayout>
  );
}

