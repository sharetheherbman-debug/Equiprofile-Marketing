/**
 * AcademyNavbar — EquiProfile Academy navigation.
 *
 * Academy is a separate product, but it intentionally shares EquiProfile's
 * visual identity. Keep the same logo, navy foundation and interaction
 * patterns as the Management site while routing authenticated users to their
 * Academy-specific dashboard.
 */
import { useEffect, useMemo, useState } from "react";
import { Link, useLocation } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";
import { useAuth } from "@/_core/hooks/useAuth";

const navLinks = [
  { label: "About", path: "/academy/about" },
  { label: "Features", path: "/academy/features" },
  { label: "Pricing", path: "/academy/pricing" },
  { label: "Contact", path: "/academy/contact" },
];

function resolveAcademyDashboard(preferences: unknown) {
  if (typeof preferences !== "string" || !preferences) {
    return "/student-dashboard";
  }

  try {
    const parsed = JSON.parse(preferences) as {
      planTier?: string;
      selectedExperience?: string;
    };
    const experience = parsed.selectedExperience ?? parsed.planTier;
    if (experience === "teacher") return "/teacher-dashboard";
    if (experience === "school_owner") return "/academy-dashboard";
  } catch {
    // A malformed preference value must not break public navigation.
  }

  return "/student-dashboard";
}

export function AcademyNavbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [location] = useLocation();
  const { isAuthenticated, user } = useAuth();
  const dashboardPath = useMemo(
    () => resolveAcademyDashboard(user?.preferences),
    [user?.preferences],
  );

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled
          ? "bg-[#1e3a5f]/98 backdrop-blur-xl shadow-lg shadow-black/10 border-b border-white/[0.06]"
          : "bg-gradient-to-b from-[#1e3a5f]/95 to-[#1e3a5f]/80 backdrop-blur-md"
      }`}
    >
      <div className="container mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-[72px]">
          <Link
            href={isAuthenticated ? dashboardPath : "/academy"}
            className="flex items-center gap-3 group"
          >
            <img
              src="/logo.png"
              alt="EquiProfile"
              className="h-11 w-auto object-contain drop-shadow-sm"
            />
            <div className="flex flex-col">
              <span className="text-xl font-bold text-white tracking-tight font-serif leading-none">
                EquiProfile
              </span>
              <span className="text-[10px] font-semibold text-[#c5a55a] tracking-[0.16em] uppercase mt-1">
                Academy
              </span>
            </div>
          </Link>

          <div className="hidden lg:flex items-center gap-1">
            {navLinks.map((link) => {
              const isActive = location === link.path;
              return (
                <Link
                  key={link.path}
                  href={link.path}
                  className={`relative px-4 py-2 text-[13px] font-medium tracking-wide rounded-lg transition-all duration-200 ${
                    isActive
                      ? "text-white"
                      : "text-white/70 hover:text-white hover:bg-white/[0.06]"
                  }`}
                >
                  {link.label}
                  {isActive && (
                    <motion.div
                      layoutId="academy-nav-indicator"
                      className="absolute bottom-0 left-3 right-3 h-[2px] bg-gradient-to-r from-[#1a7a6d] to-[#2e6da4] rounded-full"
                      transition={{
                        type: "spring",
                        stiffness: 380,
                        damping: 30,
                      }}
                    />
                  )}
                </Link>
              );
            })}
          </div>

          <div className="hidden lg:flex items-center gap-3">
            {isAuthenticated ? (
              <Link href={dashboardPath}>
                <Button
                  size="sm"
                  className="bg-white/10 hover:bg-white/15 text-white border border-white/10 backdrop-blur-sm"
                >
                  Academy Dashboard
                </Button>
              </Link>
            ) : (
              <>
                <Link href="/login">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-white/80 hover:text-white hover:bg-white/[0.06]"
                  >
                    Log In
                  </Button>
                </Link>
                <Link href="/register">
                  <Button
                    size="sm"
                    className="bg-gradient-to-r from-[#2e6da4] to-[#3a8dc7] hover:from-[#3578b0] hover:to-[#4a9dd7] text-white shadow-lg shadow-blue-900/25 border-0"
                  >
                    Start Learning
                  </Button>
                </Link>
              </>
            )}
          </div>

          <button
            className="lg:hidden p-2.5 rounded-lg text-white/80 hover:text-white hover:bg-white/10 transition-colors"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Toggle menu"
          >
            {mobileOpen ? (
              <X className="w-5 h-5" />
            ) : (
              <Menu className="w-5 h-5" />
            )}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            key="academy-mobile"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25 }}
            className="lg:hidden bg-[#1e3a5f] border-t border-white/[0.06] overflow-hidden"
          >
            <div className="container mx-auto px-4 py-4 flex flex-col gap-1">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  href={link.path}
                  className={`px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                    location === link.path
                      ? "text-white bg-white/10"
                      : "text-white/70 hover:text-white hover:bg-white/[0.06]"
                  }`}
                  onClick={() => setMobileOpen(false)}
                >
                  {link.label}
                </Link>
              ))}
              <div className="flex flex-col gap-2 mt-3 pt-3 border-t border-white/10">
                {isAuthenticated ? (
                  <Link
                    href={dashboardPath}
                    onClick={() => setMobileOpen(false)}
                  >
                    <Button className="w-full bg-white/10 hover:bg-white/15 text-white border border-white/10">
                      Academy Dashboard
                    </Button>
                  </Link>
                ) : (
                  <>
                    <Link href="/login" onClick={() => setMobileOpen(false)}>
                      <Button
                        variant="outline"
                        className="w-full border-white/20 text-white hover:bg-white/10"
                      >
                        Log In
                      </Button>
                    </Link>
                    <Link
                      href="/register"
                      onClick={() => setMobileOpen(false)}
                    >
                      <Button className="w-full bg-gradient-to-r from-[#2e6da4] to-[#3a8dc7] text-white">
                        Start Learning
                      </Button>
                    </Link>
                  </>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
