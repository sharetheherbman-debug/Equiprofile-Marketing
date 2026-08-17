import { useCallback, useEffect, useState } from "react";
import { ArrowUpRight, CheckCircle2, Loader2, RefreshCw, ShieldCheck, XCircle } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface MarketingStatus {
  available: boolean;
}

export function MarketingConnectionCard() {
  const [status, setStatus] = useState<MarketingStatus | null>(null);
  const [loading, setLoading] = useState(true);
  const [opening, setOpening] = useState(false);
  const [ownerDenied, setOwnerDenied] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadStatus = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch("/api/v1/admin/marketing/status", {
        credentials: "include",
      });
      const payload = await response.json().catch(() => ({}));

      // The Marketing launcher is an EquiProfile-owner tool, not a general
      // administrator feature. A non-owner admin should not see the launcher at
      // all; the server independently enforces the same owner boundary.
      if (response.status === 403) {
        setOwnerDenied(true);
        setStatus(null);
        return;
      }

      if (!response.ok) throw new Error("Marketing is temporarily unavailable");
      setOwnerDenied(false);
      setStatus(payload as MarketingStatus);
    } catch {
      setStatus(null);
      setError("Marketing is temporarily unavailable. Management is still fully available.");
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
        throw new Error("Marketing is temporarily unavailable. Management is still fully available.");
      }
      window.location.assign(String(payload.redirect_url));
    } catch {
      setError("Marketing is temporarily unavailable. Management is still fully available.");
      setOpening(false);
    }
  };

  if (ownerDenied) return null;

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
              Open your EquiProfile Marketing workspace without leaving your Management account.
            </CardDescription>
          </div>
          {loading ? (
            <Badge variant="secondary"><Loader2 className="mr-1 h-3 w-3 animate-spin" />Checking</Badge>
          ) : status?.available ? (
            <Badge className="bg-emerald-600 text-white"><CheckCircle2 className="mr-1 h-3 w-3" />Available</Badge>
          ) : (
            <Badge variant="secondary"><XCircle className="mr-1 h-3 w-3" />Unavailable</Badge>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {error && (
          <div className="rounded-lg border border-amber-300 bg-amber-50 px-4 py-3 text-sm text-amber-900">
            {error}
          </div>
        )}

        <div className="flex flex-wrap gap-3">
          <Button onClick={openMarketing} disabled={!status?.available || opening || loading}>
            {opening ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <ArrowUpRight className="mr-2 h-4 w-4" />}
            Open EquiProfile Marketing
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
