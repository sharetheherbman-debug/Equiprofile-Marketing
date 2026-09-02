/**
 * SchoolFooter — Premium footer for school.equiprofile.online
 *
 * Academic blue-green palette, school-focused links, subtle cross-link to Management.
 */
import { Link } from "wouter";
import { Mail, GraduationCap } from "lucide-react";

export function SchoolFooter() {
  return (
    <footer className="relative bg-[#0f1f35] text-gray-300 overflow-hidden">
      {/* Top gradient line */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-emerald-500/30 to-transparent" />

      {/* Decorative glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[200px] bg-emerald-600/5 rounded-full blur-3xl pointer-events-none" />

      <div className="container relative mx-auto px-4 sm:px-6 pt-16 pb-10">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-10 mb-12">
          {/* Brand */}
          <div className="col-span-2 md:col-span-1">
            <div className="flex items-center gap-2.5 mb-4">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#2d6a4f] to-[#1e4d8c] flex items-center justify-center">
                <GraduationCap className="w-4 h-4 text-white" />
              </div>
              <span className="text-xl font-bold font-serif text-white">
                EquiProfile <span className="text-emerald-400">School</span>
              </span>
            </div>
            <p className="text-sm text-gray-400 leading-relaxed mb-5 max-w-xs">
              Premium equestrian learning platform. Structured lessons,
              progressive pathways, assignments, and complete school management
              for riding schools and equestrian centres.
            </p>
            <a
              href="mailto:hello@equiprofile.online"
              className="inline-flex items-center gap-2 text-sm text-gray-400 hover:text-emerald-300 transition-colors"
            >
              <Mail className="w-3.5 h-3.5" /> hello@equiprofile.online
            </a>
          </div>

          {/* Platform */}
          <div>
            <h4 className="text-xs font-semibold text-white uppercase tracking-[0.15em] mb-4">
              Platform
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link href="/features" className="text-gray-400 hover:text-white transition-colors">
                  Features
                </Link>
              </li>
              <li>
                <Link href="/pricing" className="text-gray-400 hover:text-white transition-colors">
                  Pricing
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-gray-400 hover:text-white transition-colors">
                  Contact Us
                </Link>
              </li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="text-xs font-semibold text-white uppercase tracking-[0.15em] mb-4">
              Company
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link href="/about" className="text-gray-400 hover:text-white transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-gray-400 hover:text-white transition-colors">
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="text-xs font-semibold text-white uppercase tracking-[0.15em] mb-4">
              Legal
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link href="/privacy" className="text-gray-400 hover:text-white transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/terms" className="text-gray-400 hover:text-white transition-colors">
                  Terms of Service
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-white/[0.06] pt-6 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-xs text-gray-500">
            © {new Date().getFullYear()} EquiProfile School · Part of{" "}
            <a
              href="https://amarktai.com"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-gray-300 transition-colors"
            >
              Amarkt<span className="text-emerald-400 font-semibold">AI</span> Network
            </a>
          </p>
          <a
            href="https://equiprofile.online"
            className="text-xs text-gray-500 hover:text-emerald-400 transition-colors"
          >
            EquiProfile Horse Management →
          </a>
        </div>
      </div>
    </footer>
  );
}
