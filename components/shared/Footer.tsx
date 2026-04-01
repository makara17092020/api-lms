// components/shared/Footer.tsx
import Link from "next/link";
import { Linkedin, Send, Mail } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-zinc-50 border-t border-zinc-100">
      <div className="max-w-7xl mx-auto px-6 lg:px-8 pt-16 pb-12">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-y-12">
          {/* Branding */}
          <div className="md:col-span-5">
            <Link href="/" className="flex items-center gap-x-2">
              <span className="font-bold text-3xl tracking-tighter bg-linear-to-r from-indigo-600 to-violet-600 bg-clip-text text-transparent">
                NextGen Dev
              </span>
            </Link>
            <p className="mt-3 text-zinc-600 max-w-xs text-[15px] leading-relaxed">
              The modern platform for next-generation developers.
            </p>
          </div>

          {/* Product */}
          <div className="md:col-span-3">
            <h4 className="font-medium text-zinc-900 text-sm tracking-widest mb-5">
              PRODUCT
            </h4>
            <div className="flex flex-col gap-y-4 text-sm">
              <Link
                href="/login"
                className="text-zinc-600 hover:text-zinc-900 transition-colors duration-200"
              >
                Login
              </Link>
              <Link
                href="/register"
                className="text-zinc-600 hover:text-zinc-900 transition-colors duration-200"
              >
                Register
              </Link>
            </div>
          </div>

          {/* Company */}
          <div className="md:col-span-2">
            <h4 className="font-medium text-zinc-900 text-sm tracking-widest mb-5">
              COMPANY
            </h4>
            <div className="flex flex-col gap-y-4 text-sm">
              <Link
                href="/about"
                className="text-zinc-600 hover:text-zinc-900 transition-colors duration-200"
              >
                About Us
              </Link>
              <Link
                href="/contact"
                className="text-zinc-600 hover:text-zinc-900 transition-colors duration-200"
              >
                Contact
              </Link>
            </div>
          </div>

          {/* Connect */}
          <div className="md:col-span-2">
            <h4 className="font-medium text-zinc-900 text-sm tracking-widest mb-5">
              CONNECT
            </h4>
            <div className="flex items-center gap-x-6">
              <a
                href="https://linkedin.com/company/nextgendev"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="LinkedIn"
                className="text-zinc-400 hover:text-indigo-600 hover:scale-110 transition-all duration-200"
              >
                <Linkedin className="h-5 w-5" />
              </a>
              <a
                href="https://t.me/nextgendev"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Telegram"
                className="text-zinc-400 hover:text-indigo-600 hover:scale-110 transition-all duration-200"
              >
                <Send className="h-5 w-5" />
              </a>
              <a
                href="mailto:hello@nextgendev.com"
                aria-label="Email"
                className="text-zinc-400 hover:text-indigo-600 hover:scale-110 transition-all duration-200"
              >
                <Mail className="h-5 w-5" />
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-zinc-100 bg-white py-6">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 text-center md:text-left">
          <p className="text-zinc-500 text-sm">
            © 2026 NextGen Dev. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
