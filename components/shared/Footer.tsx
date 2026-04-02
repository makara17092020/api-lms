"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTranslations, useLocale } from "next-intl"; // 👈 Added i18n hooks
import { Linkedin, Send, Mail } from "lucide-react";

export default function Footer() {
  const t = useTranslations("Footer"); // Assumes you have a "Footer" section in your JSON
  const locale = useLocale();

  return (
    <footer className="bg-zinc-50 border-t border-zinc-100">
      <div className="max-w-7xl mx-auto px-6 lg:px-8 pt-16 pb-12">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-y-12">
          {/* Branding */}
          <div className="md:col-span-5">
            <Link href={`/${locale}`} className="flex items-center gap-x-2">
              <span className="font-bold text-3xl tracking-tighter bg-linear-to-r from-indigo-600 to-violet-600 bg-clip-text text-transparent">
                AI Academy
              </span>
            </Link>
            <p className="mt-3 text-zinc-600 max-w-xs text-[15px] leading-relaxed">
              {t("description")}
            </p>
          </div>

          {/* Product */}
          <div className="md:col-span-3">
            <h4 className="font-medium text-zinc-900 text-sm tracking-widest mb-5 uppercase">
              {t("productTitle")}
            </h4>
            <div className="flex flex-col gap-y-4 text-sm">
              <Link
                href={`/${locale}/login`}
                className="text-zinc-600 hover:text-zinc-900 transition-colors duration-200"
              >
                {t("login")}
              </Link>
              <Link
                href={`/${locale}/register`}
                className="text-zinc-600 hover:text-zinc-900 transition-colors duration-200"
              >
                {t("register")}
              </Link>
            </div>
          </div>

          {/* Company */}
          <div className="md:col-span-2">
            <h4 className="font-medium text-zinc-900 text-sm tracking-widest mb-5 uppercase">
              {t("companyTitle")}
            </h4>
            <div className="flex flex-col gap-y-4 text-sm">
              <Link
                href={`/${locale}/about`}
                className="text-zinc-600 hover:text-zinc-900 transition-colors duration-200"
              >
                {t("aboutUs")}
              </Link>
              <Link
                href={`/${locale}/contact`}
                className="text-zinc-600 hover:text-zinc-900 transition-colors duration-200"
              >
                {t("contact")}
              </Link>
            </div>
          </div>

          {/* Connect */}
          <div className="md:col-span-2">
            <h4 className="font-medium text-zinc-900 text-sm tracking-widest mb-5 uppercase">
              {t("connectTitle")}
            </h4>
            <div className="flex items-center gap-x-6">
              <a
                href="https://linkedin.com/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-zinc-400 hover:text-indigo-600 hover:scale-110 transition-all duration-200"
              >
                <Linkedin className="h-5 w-5" />
              </a>
              <a
                href="https://t.me/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-zinc-400 hover:text-indigo-600 hover:scale-110 transition-all duration-200"
              >
                <Send className="h-5 w-5" />
              </a>
              <a
                href="mailto:hello@aiacademy.com"
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
            © 2026 NextGen Dev. {t("allRightsReserved")}
          </p>
        </div>
      </div>
    </footer>
  );
}
