import { useEffect, useState } from "react";
import { Link } from "wouter";
import { ArrowLeft, Loader2, Save } from "lucide-react";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

export default function AcademySettings() {
  const utils = trpc.useUtils();
  const profile = trpc.user.getProfile.useQuery();
  const [form, setForm] = useState({ name: "", phone: "", location: "" });
  useEffect(() => {
    if (!profile.data) return;
    setForm({
      name: profile.data.name ?? "",
      phone: profile.data.phone ?? "",
      location: profile.data.location ?? "",
    });
  }, [profile.data]);
  const update = trpc.user.updateProfile.useMutation({
    onSuccess: async () => {
      await Promise.all([profile.refetch(), utils.auth.me.invalidate()]);
      toast.success("Academy profile saved");
    },
    onError: (error) => toast.error(error.message || "Academy profile could not be saved"),
  });

  return (
    <main className="min-h-screen bg-slate-50 px-4 py-8 text-[#102a43]">
      <div className="mx-auto max-w-2xl">
        <Link href="/dashboard" className="inline-flex min-h-11 items-center gap-2 text-sm font-medium text-[#245a8a] hover:underline">
          <ArrowLeft className="h-4 w-4" /> Back to EquiProfile Academy
        </Link>
        <section className="mt-4 rounded-2xl border bg-white p-6 shadow-sm sm:p-8">
          <div className="flex items-center gap-3">
            <img src="/logo.png" alt="EquiProfile Academy" className="h-11 w-auto" />
            <div><h1 className="font-serif text-2xl font-bold">EquiProfile Academy settings</h1><p className="text-sm text-slate-500">Your shared account details</p></div>
          </div>
          {profile.isLoading ? (
            <div className="flex min-h-48 items-center justify-center"><Loader2 className="h-7 w-7 animate-spin text-[#245a8a]" /></div>
          ) : (
            <form className="mt-8 space-y-5" onSubmit={(event) => { event.preventDefault(); update.mutate(form); }}>
              <div className="space-y-2"><Label htmlFor="academy-name">Name</Label><Input id="academy-name" value={form.name} onChange={(event) => setForm((current) => ({ ...current, name: event.target.value }))} maxLength={500} /></div>
              <div className="space-y-2"><Label htmlFor="academy-email">Email</Label><Input id="academy-email" value={profile.data?.email ?? ""} disabled /><p className="text-xs text-slate-500">Your email is shared securely across EquiProfile products.</p></div>
              <div className="space-y-2"><Label htmlFor="academy-phone">Phone</Label><Input id="academy-phone" value={form.phone} onChange={(event) => setForm((current) => ({ ...current, phone: event.target.value }))} maxLength={50} /></div>
              <div className="space-y-2"><Label htmlFor="academy-location">Location</Label><Input id="academy-location" value={form.location} onChange={(event) => setForm((current) => ({ ...current, location: event.target.value }))} maxLength={500} /></div>
              <div className="flex flex-col gap-3 sm:flex-row">
                <Button type="submit" disabled={update.isPending}><Save className="mr-2 h-4 w-4" />{update.isPending ? "Saving…" : "Save profile"}</Button>
                <Button asChild variant="outline"><a href="/api/v1/billing/launch?product=academy&action=home">Open central Billing</a></Button>
              </div>
            </form>
          )}
        </section>
      </div>
    </main>
  );
}
