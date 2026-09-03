/**
 * AuthLayout — Minimal layout for authentication pages (Login, Register, etc.)
 *
 * Provides a clean, site-neutral auth experience:
 * - Minimal dark header with EquiProfile logo + Home link
 * - Minimal dark footer
 * - No marketing navigation links (keeps auth pages focused)
 *
 * Used by both management and school frontends — the auth experience is
 * shared and site-neutral by design (users authenticate into one account,
 * then see the appropriate dashboard based on their role).
 */
import { ReactNode } from "react";
import { Link } from "wouter";
import { ArrowLeft } from "lucide-react";
import { PageTransition } from "@/components/PageTransition";
import {
  getCoreProductContext,
  getProductHomePath,
  getProductName,
} from "@/lib/productContext";

interface AuthLayoutProps {
  children: ReactNode;
}

function AuthHeader() {
  const product = getCoreProductContext();
  const homePath = getProductHomePath(product);
  const productName = getProductName(product);
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-[#0f1d2e]/98 backdrop-blur-xl border-b border-white/[0.06]">
      <div className="container flex items-center justify-between h-16 px-4 md:px-6">
        {/* Logo — matches ManagementNavbar treatment */}
        <Link href={homePath} className="flex items-center gap-3 group">
          <img
            src="/logo.png"
            alt={productName}
            className="h-10 w-auto object-contain drop-shadow-sm"
          />
          <span className="flex flex-col font-serif text-white tracking-tight leading-none">
            <span className="text-xl font-bold">EquiProfile</span>
            {product === "academy" && (
              <span className="mt-1 text-[10px] font-semibold uppercase tracking-[0.16em] text-[#c5a55a]">Academy</span>
            )}
          </span>
        </Link>

        {/* Back to site */}
        <Link
          href={homePath}
          className="flex items-center gap-1.5 text-sm text-gray-400 hover:text-white transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span className="hidden sm:inline">Back to site</span>
        </Link>
      </div>
    </nav>
  );
}

function AuthFooter() {
  const product = getCoreProductContext();
  const productName = getProductName(product);
  return (
    <footer className="py-6 bg-[#0b1726] text-gray-500 text-center text-xs border-t border-white/[0.04]">
      <div className="container px-4">
        <p>
          © {new Date().getFullYear()} {productName}. All rights reserved.
          {" · "}
          <Link href="/terms" className="hover:text-gray-300 transition-colors">
            Terms
          </Link>
          {" · "}
          <Link href="/privacy" className="hover:text-gray-300 transition-colors">
            Privacy
          </Link>
        </p>
      </div>
    </footer>
  );
}

export function AuthLayout({ children }: AuthLayoutProps) {
  return (
    <>
      <AuthHeader />
      <PageTransition>{children}</PageTransition>
      <AuthFooter />
    </>
  );
}
