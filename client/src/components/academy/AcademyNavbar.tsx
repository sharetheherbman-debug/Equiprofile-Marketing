/**
 * AcademyNavbar — compatibility component for the EquiProfile Academy frontend.
 *
 * The component name/path stays stable to avoid unnecessary churn in imports,
 * while all customer-facing navigation uses the Academy brand and canonical
 * /academy routes.
 */
import { useState, useEffect } from "react";
import { Link, useLocation } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Menu, X, GraduationCap } from "lucide-react";
import { useAuth } from "@/_core/hooks/useAuth";

const navLinks = [
  { label: "About", path: "/academy/about" },
  { label: "Features", path: "/academy/features" },
  { label: "Pricing", path: "/academy/pricing" },
  { label: "Contact", path: "/academy/contact" },
];

export function AcademyNavbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [location] = useLocation();
  const { isAuthenticated } = useAuth();

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
          ? "bg-[#0f1d2e]/98 backdrop-blur-xl shadow-lg shadow-black/10 border-b border-white/[0.06]"
          : "bg-gradient-to-b from-[#0f1d2e]/95 to-[#0f1d2e]/80 backdrop-blur-md"
      }`}
    >
      <div className="container mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-[72px]">
          {/* Logo */}
          <Link
            href={isAuthenticated ? "/student-dashboard" : "/academy"}
            className="flex items-center gap-3 group"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#c5a55a] to-[#163563] flex items-center justify-center shadow-lg shadow-amber-900/20">
              <GraduationCap className="w-5 h-5 text-white" />
            </div>
            <div className="flex flex-col">
              <span className="text-lg font-bold text-white tracking-tight font-serif leading-none">
                EquiProfile
              </span>
              <span className="text-[10px] font-medium text-amber-300 tracking-[0.15em] uppercase mt-0.5">
                Academy
              </span>
            </div>
          </Link>

          {/* Desktop Nav */}
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
                      className="absolute bottom-0 left-3 right-3 h-[2px] bg-gradient-to-r from-amber-400 to-[#3b82f6] rounded-full"
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

          {/* Desktop CTA */}
          <div className="hidden lg:flex items-center gap-3">
            {isAuthenticated ? (
              <Link href="/student-dashboard">
                <Button
                  size="sm"
                  className="bg-white/10 hover:bg-white/15 text-white border border-white/10 backdrop-blur-sm"
                >
                  Dashboard
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
                <Link href="/academy/contact">
                  <Button
                    size="sm"
                    className="bg-[#c5a55a] hover:from-[#d4b468] hover:to-[#2563a8] text-white shadow-lg shadow-amber-900/25 border-0"
                  >
                    Book Demo
                  </Button>
                </Link>
              </>
            )}
          </div>

          {/* Mobile Toggle */}
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

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            key="academy-mobile"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25 }}
            className="lg:hidden bg-[#0f1d2e] border-t border-white/[0.06] overflow-hidden"
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
                    href="/student-dashboard"
                    onClick={() => setMobileOpen(false)}
                  >
                    <Button className="w-full bg-white/10 hover:bg-white/15 text-white border border-white/10">
                      Dashboard
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
                      href="/academy/contact"
                      onClick={() => setMobileOpen(false)}
                    >
                      <Button className="w-full bg-[#c5a55a] text-white">
                        Book Demo
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
