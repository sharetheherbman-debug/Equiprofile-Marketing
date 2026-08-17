import { lazy, Suspense, useMemo, useState } from "react";
import { useLocation } from "wouter";
import { BarChart3, Eye, Loader2, Search, Shield, Users } from "lucide-react";
import DashboardLayout from "@/components/DashboardLayout";
import { MarketingConnectionCard } from "@/components/admin/MarketingConnectionCard";
import { PageHeader } from "@/components/PageHeader";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAdminViewMode } from "@/contexts/AdminViewContext";
import { trpc } from "@/lib/trpc";

const AdminAnalytics = lazy(() => import("./AdminAnalytics"));

/**
 * Dedicated client-safe Administration route. It intentionally does not
 * import the legacy operator console, so provider credentials, environment
 * health, infrastructure settings, and their queries are absent from the
 * customer bundle as well as the rendered page.
 */
export default function AdminEnvironmentSafe() {
  const [, navigate] = useLocation();
  const { setViewMode } = useAdminViewMode();
  const [search, setSearch] = useState("");
  const statusQuery = trpc.adminUnlock.getStatus.useQuery();
  const isUnlocked = !!statusQuery.data?.isUnlocked;
  const statsQuery = trpc.admin.getStats.useQuery(undefined, { enabled: isUnlocked });
  const usersQuery = trpc.admin.getUsers.useQuery(undefined, { enabled: isUnlocked });
  const users = useMemo(() => {
    const value = search.trim().toLowerCase();
    if (!value) return usersQuery.data ?? [];
    return (usersQuery.data ?? []).filter(
      (user) =>
        user.name?.toLowerCase().includes(value) ||
        user.email?.toLowerCase().includes(value),
    );
  }, [search, usersQuery.data]);

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
            <CardDescription>Unlock your administrator session to manage customer access.</CardDescription>
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
    { label: "Customers", value: stats?.users.totalUsers ?? 0 },
    { label: "Active accounts", value: stats?.users.activeUsers ?? 0 },
    { label: "Paid accounts", value: stats?.users.paidUsers ?? 0 },
    { label: "Managed horses", value: stats?.horses.totalHorses ?? 0 },
  ];

  return (
    <DashboardLayout>
      <div className="space-y-5">
        <MarketingConnectionCard />
        <PageHeader
          title="Account Administration"
          subtitle="Manage EquiProfile customers, insights, and workspace access"
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
            <TabsTrigger value="insights" className="gap-2"><BarChart3 className="h-4 w-4" />Insights</TabsTrigger>
            <TabsTrigger value="portals" className="gap-2"><Eye className="h-4 w-4" />Portals</TabsTrigger>
          </TabsList>

          <TabsContent value="customers">
            <Card className="border-gray-200 shadow-sm">
              <CardHeader className="gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <CardTitle>Customers</CardTitle>
                  <CardDescription>Account and subscription overview</CardDescription>
                </div>
                <div className="relative w-full sm:w-72">
                  <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                  <Input
                    aria-label="Search customers"
                    value={search}
                    onChange={(event) => setSearch(event.target.value)}
                    placeholder="Search customers"
                    className="pl-9"
                  />
                </div>
              </CardHeader>
              <CardContent className="space-y-2">
                {usersQuery.isLoading ? (
                  <div className="flex items-center gap-2 py-6 text-sm text-gray-500"><Loader2 className="h-4 w-4 animate-spin" />Loading customers</div>
                ) : users.length === 0 ? (
                  <p className="py-6 text-sm text-gray-500">No matching customers.</p>
                ) : users.map((user) => (
                  <div key={user.id} className="flex flex-col gap-2 rounded-lg border border-gray-200 p-3 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                      <p className="font-medium text-[#102a43]">{user.name || "Unnamed customer"}</p>
                      <p className="text-sm text-gray-500">{user.email}</p>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      <Badge variant="outline">{user.subscriptionPlan || "Standard"}</Badge>
                      <Badge className={user.isActive ? "bg-emerald-600 text-white" : "bg-gray-500 text-white"}>
                        {user.isActive ? "Active" : "Inactive"}
                      </Badge>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="insights">
            <Suspense fallback={<div className="flex justify-center py-12"><Loader2 className="h-7 w-7 animate-spin text-[#2e6da4]" /></div>}>
              <AdminAnalytics />
            </Suspense>
          </TabsContent>

          <TabsContent value="portals">
            <Card className="border-gray-200 shadow-sm">
              <CardHeader>
                <CardTitle>Workspace portals</CardTitle>
                <CardDescription>Preview the customer experiences available in EquiProfile.</CardDescription>
              </CardHeader>
              <CardContent className="grid gap-3 sm:grid-cols-2">
                <Button onClick={() => { setViewMode("pro"); navigate("/dashboard"); }} className="bg-[#2e6da4] hover:bg-[#245a8a]">
                  Open Pro workspace
                </Button>
                <Button onClick={() => { setViewMode("stable"); navigate("/stable-dashboard"); }} className="bg-[#2d6a4f] hover:bg-[#245a42]">
                  Open Stable workspace
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
}
