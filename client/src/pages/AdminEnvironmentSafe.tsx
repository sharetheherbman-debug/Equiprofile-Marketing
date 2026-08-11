import { MarketingConnectionCard } from "@/components/admin/MarketingConnectionCard";
import LegacyAdmin from "./Admin";

/**
 * Phase 1 owner-safe wrapper around the EquiProfile admin console.
 *
 * Marketing is not an EquiProfile customer feature. The standalone owner
 * launcher lives here, inside hidden admin, while infrastructure credential
 * cards from the legacy admin console remain removed from the rendered surface.
 */
export default function AdminEnvironmentSafe() {
  return (
    <>
      <style>{`
        [data-slot="card"]:has(#equiprofile-ai-genx-key),
        [data-slot="card"]:has(#equiprofile-ai-genx-model),
        [data-slot="card"]:has(#smtp-host),
        [data-slot="card"]:has(#smtp-port),
        [data-slot="card"]:has(#smtp-user),
        [data-slot="card"]:has(#smtp-pass),
        [data-slot="card"]:has(#smtp-from),
        [data-slot="card"]:has(#stripe-key),
        [data-slot="card"]:has(#stripe-webhook),
        [data-slot="card"]:has(#twilio-account-sid),
        [data-slot="card"]:has(#twilio-auth-token),
        [data-slot="card"]:has(#twilio-whatsapp-from),
        [data-slot="card"]:has(#whatsapp-account-sid),
        [data-slot="card"]:has(#whatsapp-auth-token),
        [data-slot="card"]:has(#whatsapp-from-number) {
          display: none !important;
        }
      `}</style>
      <div className="px-4 pt-4 md:px-6 md:pt-6">
        <MarketingConnectionCard />
      </div>
      <LegacyAdmin />
    </>
  );
}
