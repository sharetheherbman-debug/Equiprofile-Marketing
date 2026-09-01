import { useEffect } from "react";
import { Loader2 } from "lucide-react";
import ManagementBillingHub from "./billing/ManagementBillingHub";

function isAcademySurface() {
  if (typeof window === "undefined") return false;
  return (
    window.location.hostname === "academy.equiprofile.online" ||
    window.location.hostname.startsWith("academy.")
  );
}

/**
 * Billing is now a product boundary rather than a shared mixed pricing screen.
 * Management keeps this route for backward-compatible links. Academy traffic
 * is handed to the central Billing service with the Academy product selected.
 */
export default function BillingPage() {
  const academy = isAcademySurface();

  useEffect(() => {
    if (academy) {
      window.location.replace(
        "/api/v1/billing/launch?product=academy&action=home",
      );
    }
  }, [academy]);

  if (academy) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="text-center">
          <Loader2 className="mx-auto mb-3 h-7 w-7 animate-spin text-primary" />
          <p className="text-sm text-muted-foreground">
            Opening EquiProfile Academy Billing…
          </p>
        </div>
      </div>
    );
  }

  return <ManagementBillingHub />;
}
