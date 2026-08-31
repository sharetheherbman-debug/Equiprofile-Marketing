import { useState, useEffect } from "react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";
import {
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
            className="fixed bottom-0 left-0 right-0 z-[9999] p-4 md:p-6"
          >
            <div className="max-w-3xl mx-auto bg-gray-900/95 backdrop-blur-md border border-white/10 rounded-2xl shadow-2xl p-4 md:p-5 flex flex-col sm:flex-row items-start sm:items-center gap-4">
              <p className="flex-1 text-sm text-gray-300 leading-relaxed">
                Necessary storage keeps sign-in and security features working.
                With your permission, optional measurement helps us understand
                how EquiProfile is discovered and used. Rejecting it does not
                affect the application. See our{" "}
                <Link
                  href="/privacy"
                  className="text-indigo-400 hover:text-indigo-300 underline underline-offset-2 transition-colors"
                >
                  Privacy Policy
                </Link>{" "}
                for details.
              </p>
              <div className="flex gap-2 flex-shrink-0">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => persist("declined")}
                  className="border-white/20 text-gray-300 hover:bg-white/10 hover:text-white"
                >
                  Reject optional
                </Button>
                <Button
                  size="sm"
                  onClick={() => persist("accepted")}
                  className="bg-gradient-to-r from-[#2e86ab] to-[#5b8def] hover:from-[#3a93b8] hover:to-[#5b8def] text-white border-0"
                >
                  Accept optional
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      {!visible && choice && (
        <button
          type="button"
          onClick={() => setVisible(true)}
          className="fixed bottom-3 left-3 z-[9998] rounded-full border border-gray-300 bg-white/95 px-3 py-2 text-xs font-medium text-gray-700 shadow-md hover:bg-gray-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500"
          aria-label={`Privacy choices. Optional measurement is currently ${choice === "accepted" ? "accepted" : "rejected"}.`}
        >
          Privacy choices
        </button>
      )}
    </>
  );
}
