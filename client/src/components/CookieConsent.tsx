import { useState, useEffect } from "react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";
import {
  OPEN_PRIVACY_CHOICES_EVENT,
  readConsentChoice,
  updateConsent,
  type ConsentChoice,
} from "@/analytics";

/**
 * Cookie consent banner.
 *
 * Shown on first visit. Once the user accepts or declines the banner is hidden
 * and the choice is persisted in localStorage so it never shows again.
 *
 * Accessible: keyboard-focusable buttons, role="dialog", aria-live region.
 */
export function CookieConsent() {
  const [visible, setVisible] = useState(false);
  const [choice, setChoice] = useState<ConsentChoice | null>(null);

  useEffect(() => {
    const stored = readConsentChoice();
    setChoice(stored);
    setVisible(!stored);
    const reopen = () => setVisible(true);
    window.addEventListener(OPEN_PRIVACY_CHOICES_EVENT, reopen);
    return () => window.removeEventListener(OPEN_PRIVACY_CHOICES_EVENT, reopen);
  }, []);

  const persist = (value: ConsentChoice) => {
    updateConsent(value);
    setChoice(value);
    setVisible(false);
  };

  return (
    <>
      <AnimatePresence>
        {visible && (
          <motion.div
            role="dialog"
            aria-modal="false"
            aria-label="Cookie consent"
            aria-live="polite"
            initial={{ y: 80, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 80, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed bottom-3 left-3 right-3 z-[9999] sm:left-auto sm:right-5 sm:w-[min(25rem,calc(100vw-2.5rem))]"
          >
            <div className="rounded-2xl border border-slate-200 bg-white/98 p-4 shadow-[0_16px_48px_rgba(15,35,55,0.18)] backdrop-blur-md">
              <h2 className="text-sm font-semibold text-[#102a43]">Privacy choices</h2>
              <p className="mt-1.5 text-xs leading-5 text-slate-600">
                We use essential cookies to keep EquiProfile secure and signed
                in. With your permission, optional analytics help us improve
                the experience. You can change this choice at any time. Read our{" "}
                <Link
                  href="/privacy"
                  className="font-medium text-[#2e6da4] underline underline-offset-2 transition-colors hover:text-[#245a8a]"
                >
                  Privacy Policy
                </Link>.
              </p>
              <div className="mt-3 flex flex-wrap justify-end gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => persist("declined")}
                  className="border-slate-300 bg-white text-slate-700 hover:bg-slate-50 hover:text-[#102a43]"
                >
                  Reject optional
                </Button>
                <Button
                  size="sm"
                  onClick={() => persist("accepted")}
                  className="border-0 bg-[#2e6da4] text-white hover:bg-[#245a8a]"
                >
                  Accept optional
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
