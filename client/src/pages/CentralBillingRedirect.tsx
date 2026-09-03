import { useEffect } from "react";
import { Loader2 } from "lucide-react";
import { getCoreProductContext, getProductName } from "@/lib/productContext";

/** Backward-compatible handoff only; the customer Billing UI lives elsewhere. */
export default function CentralBillingRedirect() {
  const product = getCoreProductContext();
  const productName = getProductName(product);
  useEffect(() => {
    window.location.replace(`/api/v1/billing/launch?product=${product}&action=home`);
  }, [product]);
  return (
    <div className="flex min-h-screen items-center justify-center bg-background">
      <div className="text-center">
        <Loader2 className="mx-auto mb-3 h-7 w-7 animate-spin text-primary" />
        <p className="text-sm text-muted-foreground">Opening {productName} Billing…</p>
      </div>
    </div>
  );
}
