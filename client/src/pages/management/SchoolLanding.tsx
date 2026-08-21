import { useEffect } from "react";

const ACADEMY_URL = "https://academy.equiprofile.online/academy";

/**
 * LEGACY_COMPAT_ONLY.
 *
 * The former /for-schools Management campaign route is intentionally retained
 * so old bookmarks and indexed links do not break. EquiProfile Academy is now
 * the canonical education product and all customer-facing School content has
 * been retired from Management.
 */
export default function SchoolLanding() {
  useEffect(() => {
    window.location.replace(ACADEMY_URL);
  }, []);

  return (
    <main className="min-h-screen bg-[#0f1d2e] text-white flex items-center justify-center px-6">
      <div className="max-w-lg text-center">
        <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#c5a55a]">
          EquiProfile Academy
        </p>
        <h1 className="mt-4 font-serif text-3xl font-semibold">
          Education has moved to EquiProfile Academy
        </h1>
        <p className="mt-4 text-sm leading-6 text-slate-300">
          This legacy School link is being redirected to the canonical Academy
          experience.
        </p>
        <a
          href={ACADEMY_URL}
          className="mt-7 inline-flex rounded-full bg-[#c5a55a] px-5 py-2.5 text-sm font-semibold text-[#0f1d2e] hover:bg-[#d4b468]"
        >
          Continue to Academy
        </a>
      </div>
    </main>
  );
}
