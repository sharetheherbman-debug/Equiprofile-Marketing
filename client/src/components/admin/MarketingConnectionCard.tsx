import { useCallback, useEffect, useState } from "react";
import { ArrowUpRight, CheckCircle2, Loader2, RefreshCw, ShieldCheck, XCircle } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface MarketingStatus {
  configured: boolean;
  applicationId: string;
  marketingUrl: string;
  authentication: string;
  secretLocation: string;
}

export function MarketingConnectionCard() {
  const [status, setStatus] = useState<MarketingStatus | null>(null);
  const [loading, setLoading] = useState(true);
  const [opening, setOpening] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadStatus = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch("/api/v1/admin/marketing/status", {
        credentials: "include",
      });
      const payload = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(payload.error || "Could not read Marketing connection status");
      setStatus(payload as MarketingStatus);
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Could not read Marketing connection status");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadStatus();
  }, [loadStatus]);

  const openMarketing = async () => {
    try {
      setOpening(true);
      setError(null);
      const response = await fetch("/api/v1/admin/marketing/sso", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({}),
      });
      const payload = await response.json().catch(() => ({}));
      if (!response.ok || !payload.redirect_url) {
        throw new Error(payload.error || "Could not create the secure Marketing sign-in");
      }
      window.location.assign(String(payload.redirect_url));
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Could not open EquiProfile Marketing");
      setOpening(false);
    }
  };

  return (
    <Card className="border-emerald-500/20 bg-emerald-500/[0.03]">
      <CardHeader>
        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <ShieldCheck className="h-5 w-5 text-emerald-600" />
              EquiProfile Marketing
            </CardTitle>
            <CardDescription className="mt-2">
              Open the standalone autonomous Marketing workspace through a signed, one-use administrator login.
            </CardDescription>
          </div>
          {loading ? (
            <Badge variant="secondary"><Loader2 className="mr-1 h-3 w-3 animate-spin" />Checking</Badge>
          ) : status?.configured ? (
            <Badge className="bg-emerald-600 text-white"><CheckCircle2 className="mr-1 h-3 w-3" />Connected</Badge>
          ) : (
            <Badge variant="destructive"><XCircle className="mr-1 h-3 w-3" />Not configured</Badge>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid gap-3 text-sm sm:grid-cols-3">
          <div className="rounded-lg border bg-background/70 p-3">
            <p className="text-xs text-muted-foreground">Application</p>
            <p className="mt-1 font-medium">{status?.applicationId || "equiprofile"}</p>
          </div>
          <div className="rounded-lg border bg-background/70 p-3">
            <p className="text-xs text-muted-foreground">Authentication</p>
            <p className="mt-1 font-medium">{status?.authentication || "Signed one-use SSO"}</p>
          </div>
          <div className="rounded-lg border bg-background/70 p-3">
            <p className="text-xs text-muted-foreground">Connector secret</p>
            <p className="mt-1 font-medium">{status?.secretLocation || "VPS environment only"}</p>
          </div>
        </div>

        {error && (
          <div className="rounded-lg border border-destructive/30 bg-destructive/5 px-4 py-3 text-sm text-destructive">
            {error}
          </div>
        )}

        <div className="flex flex-wrap gap-3">
          <Button onClick={openMarketing} disabled={!status?.configured || opening || loading}>
            {opening ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <ArrowUpRight className="mr-2 h-4 w-4" />}
            Open Marketing
          </Button>
          <Button variant="outline" onClick={() => void loadStatus()} disabled={loading || opening}>
            <RefreshCw className={`mr-2 h-4 w-4 ${loading ? "animate-spin" : ""}`} />
            Refresh status
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
