import { useEffect, useMemo, useState } from "react";
import { useLocation } from "wouter";
import {
  CreditCard,
  Eye,
  Gift,
  Loader2,
  Search,
  Shield,
  ShieldCheck,
  Users,
} from "lucide-react";
import { toast } from "sonner";
import DashboardLayout from "@/components/DashboardLayout";
import { MarketingConnectionCard } from "@/components/admin/MarketingConnectionCard";
import { PageHeader } from "@/components/PageHeader";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { useAdminViewMode } from "@/contexts/AdminViewContext";
import { trpc } from "@/lib/trpc";

type Product = "management" | "academy" | "marketing" | "shop";

type ComplimentaryGrant = {
  product: Product;
  active: boolean;
  grant: null | {
    tier: string;
    startsAt: string;
    endsAt: string | null;
    reason?: string;
    note?: string;
  };
};

type AdminUser = {
  id: number;
  name: string | null;
  email: string | null;
  role: "user" | "admin";
  isActive: boolean;
  isSuspended: boolean;
  createdAt: string;
  lastSignedIn: string | null;
  managementPayment: {
    status: string;
    plan: string | null;
    currentPeriodEndsAt: string | null;
    lastPaymentAt: string | null;
    stripeCustomerId: string | null;
  };
  academyOrganizations: Array<{
    id: number;
    name: string;
    planTier: string;
    billingStatus: string;
    billingInterval: string | null;
    billingCurrentPeriodEndsAt: string | null;
  }>;
  complimentary: ComplimentaryGrant[];
};

const PRODUCT_LABELS: Record<Product, string> = {
  management: "Management",
  academy: "Academy",
  marketing: "Marketing",
  shop: "Shop",
};

const PRODUCT_TIERS: Record<Product, Array<{ value: string; label: string }>> = {
  management: [
    { value: "pro", label: "Pro" },
    { value: "stable", label: "Stable" },
    { value: "management_full", label: "Full Management" },
  ],
  academy: [
    { value: "rider", label: "Rider" },
    { value: "academy_full", label: "Full Academy" },
  ],
  marketing: [{ value: "marketing_full", label: "Full Marketing" }],
  shop: [{ value: "shop_full", label: "Full Shop" }],
};

function statusBadge(status: string) {
  const normalized = status?.toLowerCase?.() ?? "unknown";
  if (normalized === "active" || normalized === "paid") {
    return <Badge className="bg-emerald-600 text-white">Paid</Badge>;
  }
  if (normalized === "trial" || normalized === "trialing") {
    return <Badge className="bg-blue-600 text-white">Trial</Badge>;
  }
  if (normalized === "overdue" || normalized === "past_due" || normalized === "unpaid") {
    return <Badge variant="destructive">Payment due</Badge>;
  }
  return <Badge variant="outline" className="capitalize">{normalized || "Unknown"}</Badge>;
}

function formatDate(value: string | null | undefined) {
  if (!value) return "—";
  const parsed = new Date(value);
  return Number.isFinite(parsed.getTime())
    ? parsed.toLocaleDateString("en-GB")
    : "—";
}

/**
 * Customer-safe Administration surface. Infrastructure credentials and provider
 * secrets are intentionally absent from this bundle. Payment truth, access
 * grants and account roles are safe operational controls and are protected by
 * the existing unlocked-admin session on every API call.
 */
export default function AdminEnvironmentSafe() {
  const [, navigate] = useLocation();
  const { setViewMode } = useAdminViewMode();
  const [search, setSearch] = useState("");
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [loadingUsers, setLoadingUsers] = useState(false);
  const [grantUser, setGrantUser] = useState<AdminUser | null>(null);
  const [grantProduct, setGrantProduct] = useState<Product>("management");
  const [grantTier, setGrantTier] = useState("pro");
  const [grantDays, setGrantDays] = useState("30");
  const [grantReason, setGrantReason] = useState("Client access");
  const [grantNote, setGrantNote] = useState("");
  const [saving, setSaving] = useState(false);

  const statusQuery = trpc.adminUnlock.getStatus.useQuery();
  const isUnlocked = !!statusQuery.data?.isUnlocked;
  const statsQuery = trpc.admin.getStats.useQuery(undefined, { enabled: isUnlocked });

  async function loadUsers() {
    if (!isUnlocked) return;
    setLoadingUsers(true);
    try {
      const response = await fetch("/api/v1/admin-access/users", {
        credentials: "include",
        headers: { Accept: "application/json" },
      });
      const body = await response.json();
      if (!response.ok) throw new Error(body?.error || "Unable to load customers");
      setUsers(body.users ?? []);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Unable to load customers");
    } finally {
      setLoadingUsers(false);
    }
  }

  useEffect(() => {
    void loadUsers();
  }, [isUnlocked]);

  useEffect(() => {
    setGrantTier(PRODUCT_TIERS[grantProduct][0].value);
  }, [grantProduct]);

  const filteredUsers = useMemo(() => {
    const value = search.trim().toLowerCase();
    if (!value) return users;
    return users.filter(
      (user) =>
        user.name?.toLowerCase().includes(value) ||
        user.email?.toLowerCase().includes(value),
    );
  }, [search, users]);

  async function updateRole(user: AdminUser, role: "user" | "admin") {
    setSaving(true);
    try {
      const response = await fetch(`/api/v1/admin-access/users/${user.id}/role`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({ role }),
      });
      const body = await response.json();
      if (!response.ok) throw new Error(body?.error || "Unable to update role");
      toast.success(role === "admin" ? "Administrator access granted" : "Administrator access removed");
      await loadUsers();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Unable to update role");
    } finally {
      setSaving(false);
    }
  }

  async function saveGrant() {
    if (!grantUser) return;
    const days = Number(grantDays);
    if (!Number.isInteger(days) || days < 1 || days > 3650) {
      toast.error("Access duration must be between 1 and 3650 days");
      return;
    }
    if (!grantReason.trim()) {
      toast.error("Please record a reason for the complimentary access");
      return;
    }
    setSaving(true);
    try {
      const response = await fetch(`/api/v1/admin-access/users/${grantUser.id}/grants`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({
          product: grantProduct,
          tier: grantTier,
          days,
          reason: grantReason.trim(),
          note: grantNote.trim() || undefined,
        }),
      });
      const body = await response.json();
      if (!response.ok) throw new Error(body?.error || "Unable to grant access");
      toast.success(`${PRODUCT_LABELS[grantProduct]} complimentary access granted`);
      setGrantUser(null);
      setGrantNote("");
      await loadUsers();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Unable to grant access");
    } finally {
      setSaving(false);
    }
  }

  async function revokeGrant(user: AdminUser, product: Product) {
    setSaving(true);
    try {
      const response = await fetch(`/api/v1/admin-access/users/${user.id}/grants/${product}`, {
        method: "DELETE",
        credentials: "include",
        headers: { Accept: "application/json" },
      });
      const body = await response.json();
      if (!response.ok) throw new Error(body?.error || "Unable to revoke access");
      toast.success(`${PRODUCT_LABELS[product]} complimentary access revoked`);
      await loadUsers();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Unable to revoke access");
    } finally {
      setSaving(false);
    }
  }

  if (statusQuery.isLoading) {
    return (
      <DashboardLayout>
        <div className="flex min-h-[40vh] items-center justify-center">
          <Loader2 className="h-7 w-7 animate-spin text-[#2e6da4]" />
        </div>
      </DashboardLayout>
    );
  }

  if (!isUnlocked) {
    return (
      <DashboardLayout>
        <Card className="mx-auto max-w-xl border-blue-100 shadow-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5 text-[#2e6da4]" /> Account Administration Locked
            </CardTitle>
            <CardDescription>Unlock your administrator session to manage payment visibility, customer access and administrator permissions.</CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={() => navigate("/ai-chat")}>Return to EquiProfile Assistant</Button>
          </CardContent>
        </Card>
      </DashboardLayout>
    );
  }

  const stats = statsQuery.data;
  const summary = [
    { label: "Customers", value: stats?.users.totalUsers ?? users.length },
    { label: "Active accounts", value: stats?.users.activeUsers ?? 0 },
    { label: "Paid Management", value: stats?.users.paidUsers ?? 0 },
    { label: "Payment issues", value: stats?.users.overdueUsers ?? 0 },
  ];

  return (
    <DashboardLayout>
      <div className="space-y-5">
        <MarketingConnectionCard />
        <PageHeader
          title="Account Administration"
          subtitle="Payment truth, complimentary access and administrator permissions"
        />

        <div className="grid grid-cols-2 gap-3 lg:grid-cols-4" aria-label="Account summary">
          {summary.map((item) => (
            <Card key={item.label} className="border-gray-200 bg-white shadow-sm">
              <CardContent className="p-4">
                <p className="text-xs font-medium text-gray-500">{item.label}</p>
                <p className="mt-1 text-2xl font-semibold text-[#102a43]">{item.value}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        <Tabs defaultValue="customers" className="space-y-4">
          <TabsList className="h-auto flex-wrap justify-start bg-[#eef5fb] p-1">
            <TabsTrigger value="customers" className="gap-2"><Users className="h-4 w-4" />Customers</TabsTrigger>
            <TabsTrigger value="payments" className="gap-2"><CreditCard className="h-4 w-4" />Payments</TabsTrigger>
            <TabsTrigger value="access" className="gap-2"><Gift className="h-4 w-4" />Access</TabsTrigger>
            <TabsTrigger value="portals" className="gap-2"><Eye className="h-4 w-4" />Portals</TabsTrigger>
          </TabsList>

          <div className="relative w-full sm:w-80">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <Input
              aria-label="Search customers"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search customers"
              className="pl-9"
            />
          </div>

          <TabsContent value="customers">
            <Card className="border-gray-200 shadow-sm">
              <CardHeader>
                <CardTitle>Customers & permissions</CardTitle>
                <CardDescription>Administrator permission is independent from payment and complimentary access.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-2">
                {loadingUsers ? (
                  <div className="flex items-center gap-2 py-6 text-sm text-gray-500"><Loader2 className="h-4 w-4 animate-spin" />Loading customers</div>
                ) : filteredUsers.length === 0 ? (
                  <p className="py-6 text-sm text-gray-500">No matching customers.</p>
                ) : filteredUsers.map((user) => (
                  <div key={user.id} className="flex flex-col gap-3 rounded-xl border border-gray-200 p-4 lg:flex-row lg:items-center lg:justify-between">
                    <div>
                      <div className="flex flex-wrap items-center gap-2">
                        <p className="font-medium text-[#102a43]">{user.name || "Unnamed customer"}</p>
                        {user.role === "admin" && <Badge className="bg-[#163563] text-white"><ShieldCheck className="mr-1 h-3 w-3" />Admin</Badge>}
                        {user.isSuspended && <Badge variant="destructive">Suspended</Badge>}
                      </div>
                      <p className="text-sm text-gray-500">{user.email}</p>
                    </div>
                    <div className="flex flex-wrap items-center gap-2">
                      {statusBadge(user.managementPayment.status)}
                      <Button
                        size="sm"
                        variant={user.role === "admin" ? "outline" : "default"}
                        disabled={saving}
                        onClick={() => void updateRole(user, user.role === "admin" ? "user" : "admin")}
                      >
                        {user.role === "admin" ? "Remove Admin" : "Make Admin"}
                      </Button>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="payments">
            <Card className="border-gray-200 shadow-sm">
              <CardHeader>
                <CardTitle>Payment status</CardTitle>
                <CardDescription>Only billing/Stripe state is shown as paid. Complimentary access never changes these statuses.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {filteredUsers.map((user) => (
                  <div key={user.id} className="rounded-xl border border-gray-200 p-4">
                    <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                      <div>
                        <p className="font-medium text-[#102a43]">{user.name || user.email}</p>
                        <p className="text-xs text-gray-500">{user.email}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-medium text-gray-500">Management</span>
                        {statusBadge(user.managementPayment.status)}
                      </div>
                    </div>
                    <div className="mt-3 grid gap-2 text-sm text-gray-600 sm:grid-cols-3">
                      <div><span className="text-gray-400">Plan:</span> {user.managementPayment.plan || "—"}</div>
                      <div><span className="text-gray-400">Last payment:</span> {formatDate(user.managementPayment.lastPaymentAt)}</div>
                      <div><span className="text-gray-400">Period ends:</span> {formatDate(user.managementPayment.currentPeriodEndsAt)}</div>
                    </div>
                    {user.academyOrganizations.length > 0 && (
                      <div className="mt-4 border-t border-gray-100 pt-3">
                        <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-gray-400">Academy organisations</p>
                        <div className="space-y-2">
                          {user.academyOrganizations.map((org) => (
                            <div key={org.id} className="flex flex-wrap items-center gap-2 text-sm">
                              <span className="font-medium">{org.name}</span>
                              {statusBadge(org.billingStatus)}
                              <Badge variant="outline">{org.planTier}</Badge>
                              <span className="text-xs text-gray-400">ends {formatDate(org.billingCurrentPeriodEndsAt)}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="access">
            <Card className="border-gray-200 shadow-sm">
              <CardHeader>
                <CardTitle>Complimentary product access</CardTitle>
                <CardDescription>Grant access without changing Stripe/payment truth. Every grant and revoke is audited.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {filteredUsers.map((user) => {
                  const activeGrants = user.complimentary.filter((entry) => entry.active && entry.grant);
                  return (
                    <div key={user.id} className="rounded-xl border border-gray-200 p-4">
                      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                        <div>
                          <p className="font-medium text-[#102a43]">{user.name || user.email}</p>
                          <p className="text-xs text-gray-500">{user.email}</p>
                        </div>
                        <Button size="sm" onClick={() => setGrantUser(user)}>
                          <Gift className="mr-2 h-4 w-4" />Grant access
                        </Button>
                      </div>
                      {activeGrants.length > 0 ? (
                        <div className="mt-3 flex flex-wrap gap-2">
                          {activeGrants.map((entry) => (
                            <div key={entry.product} className="inline-flex items-center gap-2 rounded-full border bg-emerald-50 px-3 py-1.5 text-xs text-emerald-800">
                              <strong>{PRODUCT_LABELS[entry.product]}</strong>
                              <span>{entry.grant?.tier}</span>
                              <span>until {formatDate(entry.grant?.endsAt)}</span>
                              <button
                                type="button"
                                className="font-semibold text-red-600 hover:text-red-700"
                                disabled={saving}
                                onClick={() => void revokeGrant(user, entry.product)}
                              >
                                Revoke
                              </button>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p className="mt-3 text-xs text-gray-400">No active complimentary product access.</p>
                      )}
                    </div>
                  );
                })}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="portals">
            <Card className="border-gray-200 shadow-sm">
              <CardHeader>
                <CardTitle>Workspace portals</CardTitle>
                <CardDescription>Preview customer experiences without changing their billing or permissions.</CardDescription>
              </CardHeader>
              <CardContent className="grid gap-3 sm:grid-cols-2">
                <Button onClick={() => { setViewMode("pro"); navigate("/dashboard"); }} className="bg-[#2e6da4] hover:bg-[#245a8a]">Open Pro workspace</Button>
                <Button onClick={() => { setViewMode("stable"); navigate("/stable-dashboard"); }} className="bg-[#2d6a4f] hover:bg-[#245a42]">Open Stable workspace</Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      <Dialog open={!!grantUser} onOpenChange={(open) => !open && setGrantUser(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Grant complimentary access</DialogTitle>
            <DialogDescription>
              {grantUser?.name || grantUser?.email} will receive access without being marked as paid.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <Label>Product</Label>
              <Select value={grantProduct} onValueChange={(value) => setGrantProduct(value as Product)}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="management">Management</SelectItem>
                  <SelectItem value="academy">Academy</SelectItem>
                  <SelectItem value="marketing">Marketing</SelectItem>
                  <SelectItem value="shop">Shop</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Access level</Label>
              <Select value={grantTier} onValueChange={setGrantTier}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {PRODUCT_TIERS[grantProduct].map((tier) => (
                    <SelectItem key={tier.value} value={tier.value}>{tier.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Duration in days</Label>
              <Input type="number" min={1} max={3650} value={grantDays} onChange={(event) => setGrantDays(event.target.value)} />
            </div>
            <div className="space-y-2">
              <Label>Reason</Label>
              <Input value={grantReason} onChange={(event) => setGrantReason(event.target.value)} placeholder="Client access, compensation, partner account…" />
            </div>
            <div className="space-y-2">
              <Label>Internal note (optional)</Label>
              <Textarea value={grantNote} onChange={(event) => setGrantNote(event.target.value)} placeholder="Visible in the audit trail only" />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setGrantUser(null)}>Cancel</Button>
            <Button disabled={saving} onClick={() => void saveGrant()}>
              {saving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Grant access
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
}
