import { MarketingConnectionCard } from "@/components/admin/MarketingConnectionCard";
import LegacyAdmin from "./Admin";

/**
 * Transitional Phase 1 wrapper around the legacy admin console.
 *
 * The legacy page contains useful user, subscription and system administration,
 * but it also contains old browser forms for infrastructure credentials. Those
 * credentials are now environment-only and database writes are blocked. This
 * wrapper removes only the credential cards from the rendered dashboard while
 * the oversized legacy Admin component is split into maintainable modules.
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
