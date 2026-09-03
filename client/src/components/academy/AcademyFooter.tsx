/**
 * AcademyFooter — EquiProfile Academy footer.
 *
 * Academy remains a separate learning product while sharing the same
 * EquiProfile brand system and clear product-family navigation.
 */
import { Link } from "wouter";
import { Mail } from "lucide-react";
import { openPrivacyChoices } from "@/analytics";

export function AcademyFooter() {
  return (
    <footer className="relative bg-[#0a1628] text-gray-300 overflow-hidden">
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#2e6da4]/30 to-transparent" />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[200px] bg-[#2e6da4]/4 rounded-full blur-3xl pointer-events-none" />

      <div className="container relative mx-auto px-4 sm:px-6 pt-16 pb-10">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-10 mb-12">
          <div className="col-span-2 md:col-span-1">
            <Link
              href="/academy"
              className="inline-flex items-center gap-3 mb-5 group"
            >
              <img
                src="/logo.png"
                alt="EquiProfile"
                className="h-9 w-auto object-contain opacity-90 group-hover:opacity-100 transition-opacity"
              />
              <div className="flex flex-col">
                <span className="text-base font-bold font-serif text-white leading-none">
                  EquiProfile
                </span>
                <span className="text-[10px] font-semibold uppercase tracking-[0.16em] text-[#c5a55a] mt-1">
                  Academy
                </span>
              </div>
            </Link>
            <p className="text-sm text-gray-500 leading-relaxed mb-5 max-w-xs">
              Practical equestrian learning for individual riders, coaches,
              riding schools and equestrian organisations, with progress that
              carries from lesson to lesson.
            </p>
            <a
              href="mailto:hello@equiprofile.online"
              className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-[#4a9eca] transition-colors"
            >
              <Mail className="w-3.5 h-3.5" /> hello@equiprofile.online
            </a>
          </div>

          <div>
            <h4 className="text-xs font-bold text-white/80 uppercase tracking-[0.18em] mb-4">
              Academy
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link
                  href="/academy/features"
                  className="text-gray-500 hover:text-white transition-colors"
                >
                  Features
                </Link>
              </li>
              <li>
                <Link
                  href="/academy/pricing"
                  className="text-gray-500 hover:text-white transition-colors"
                >
                  Pricing
                </Link>
              </li>
              <li>
                <Link
                  href="/register"
                  className="text-[#c5a55a]/80 hover:text-[#c5a55a] transition-colors font-medium"
                >
                  Start Learning
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-xs font-bold text-white/80 uppercase tracking-[0.18em] mb-4">
              EquiProfile
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <a
                  href="https://equiprofile.online"
                  className="text-gray-500 hover:text-white transition-colors"
                >
                  Management
                </a>
              </li>
              <li>
                <Link
                  href="/academy/about"
                  className="text-gray-500 hover:text-white transition-colors"
                >
                  About
                </Link>
              </li>
              <li>
                <Link
                  href="/academy/contact"
                  className="text-gray-500 hover:text-white transition-colors"
                >
                  Contact
                </Link>
              </li>
              <li>
                <a
                  href="https://shop.equiprofile.online"
                  className="text-gray-500 hover:text-white transition-colors"
                >
                  Shop · Coming Soon
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-xs font-bold text-white/80 uppercase tracking-[0.18em] mb-4">
              Legal
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link
                  href="/privacy"
                  className="text-gray-500 hover:text-white transition-colors"
                >
                  Privacy Policy
                </Link>
              </li>
              <li>
                <button
                  type="button"
                  onClick={openPrivacyChoices}
                  className="text-gray-500 hover:text-white transition-colors"
                >
                  Privacy choices
                </button>
              </li>
              <li>
                <Link
                  href="/terms"
                  className="text-gray-500 hover:text-white transition-colors"
                >
                  Terms of Service
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-white/[0.05] pt-6 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-xs text-gray-600">
            © {new Date().getFullYear()} EquiProfile Academy · Part of{" "}
            <a
              href="https://amarktai.co.za"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-gray-400 transition-colors"
            >
              Amarkt<span className="text-[#4a9eca] font-semibold">AI</span>{" "}
              Network
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}
