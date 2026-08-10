import { MarketingConnectionCard } from "@/components/admin/MarketingConnectionCard";
import LegacyAdmin from "./Admin";

/**
 * Transitional Phase 1 wrapper around the legacy admin console.
 *
 * Marketing is not an EquiProfile customer feature. The standalone owner
 * launcher lives here, inside hidden admin, while the legacy admin console is
 * retained temporarily for user/subscription/system administration during the
 * source split. Legacy credential cards and the obsolete embedded Marketing
 * menu entry are removed from the rendered admin surface.
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
        [data-slot="card"]:has(#whatsapp-from-number),
        [role="menuitem"]:has(.lucide-mail) {
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
