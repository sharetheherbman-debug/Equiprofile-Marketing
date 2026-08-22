/**
 * AcademyFooter — compatibility component for the EquiProfile Academy frontend.
 *
 * The internal filename/export remains stable while customer-facing copy and
 * public links use the Academy brand and canonical /academy routes.
 */
import { Link } from "wouter";
import { Mail, GraduationCap } from "lucide-react";

export function AcademyFooter() {
  return (
    <footer className="relative bg-[#0f1d2e] text-gray-300 overflow-hidden">
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-amber-500/30 to-transparent" />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[200px] bg-amber-600/5 rounded-full blur-3xl pointer-events-none" />

      <div className="container relative mx-auto px-4 sm:px-6 pt-16 pb-10">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-10 mb-12">
          <div className="col-span-2 md:col-span-1">
            <div className="flex items-center gap-2.5 mb-4">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#c5a55a] to-[#163563] flex items-center justify-center">
                <GraduationCap className="w-4 h-4 text-white" />
              </div>
              <span className="text-xl font-bold font-serif text-white">
                EquiProfile <span className="text-amber-400">Academy</span>
              </span>
            </div>
            <p className="text-sm text-gray-400 leading-relaxed mb-5 max-w-xs">
              Premium equestrian learning platform with structured lessons,
              progressive pathways, assignments, and tools for students,
              coaches, riding schools, and equestrian centres.
            </p>
            <a
              href="mailto:hello@equiprofile.online"
              className="inline-flex items-center gap-2 text-sm text-gray-400 hover:text-amber-300 transition-colors"
            >
              <Mail className="w-3.5 h-3.5" /> hello@equiprofile.online
            </a>
          </div>

          <div>
            <h4 className="text-xs font-semibold text-white uppercase tracking-[0.15em] mb-4">
              Academy
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link
                  href="/academy/features"
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  Features
                </Link>
              </li>
              <li>
                <Link
                  href="/academy/pricing"
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  Pricing
                </Link>
              </li>
              <li>
                <Link
                  href="/academy/contact"
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  Book a Demo
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-xs font-semibold text-white uppercase tracking-[0.15em] mb-4">
              Company
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link
                  href="/academy/about"
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  About Us
                </Link>
              </li>
              <li>
                <Link
                  href="/academy/contact"
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-xs font-semibold text-white uppercase tracking-[0.15em] mb-4">
              Legal
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link
                  href="/privacy"
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link
                  href="/terms"
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  Terms of Service
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-white/[0.06] pt-6 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-xs text-gray-500">
            © {new Date().getFullYear()} EquiProfile Academy · Part of{" "}
            <a
              href="https://amarktai.com"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-gray-300 transition-colors"
            >
              Amarkt<span className="text-amber-400 font-semibold">AI</span>{" "}
              Network
            </a>
          </p>
          <a
            href="https://equiprofile.online"
            className="text-xs text-gray-500 hover:text-amber-400 transition-colors"
          >
            EquiProfile Horse Management →
          </a>
        </div>
      </div>
    </footer>
  );
}
