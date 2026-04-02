"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useTranslations, useLocale } from "next-intl";
import LogoutButton from "@/components/auth/LogoutButton";
import { ChangeEvent, useTransition, useState } from "react";
import { Menu, X } from "lucide-react";

export default function Navbar() {
  const t = useTranslations("Navbar");
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  const [isPending, startTransition] = useTransition();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const isLoggedIn = false;
  const userName = "Student";
  const userRole = "student";
  const initial = userName.charAt(0).toUpperCase();

  // Handle Language Switching seamlessly
  const switchLanguage = (e: ChangeEvent<HTMLSelectElement>) => {
    const nextLocale = e.target.value;
    const newPath = pathname.replace(`/${locale}`, `/${nextLocale}`);
    startTransition(() => {
      router.replace(newPath);
    });
  };

  const closeMenu = () => setIsMobileMenuOpen(false);

  return (
    <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-xl border-b border-zinc-100 shadow-sm">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link
            href={`/${locale}`}
            onClick={closeMenu}
            className="group flex items-center gap-x-2 transition-transform hover:scale-[1.03]"
          >
            <span className="font-bold text-3xl tracking-tighter bg-linear-to-r from-indigo-600 via-violet-600 to-blue-600 bg-clip-text text-transparent">
              AI-LMS
            </span>
          </Link>

          {/* Right side - Desktop Auth / User / Lang */}
          <div className="hidden md:flex items-center gap-x-4">
            {/* Language Switcher */}
            <select
              defaultValue={locale}
              onChange={switchLanguage}
              disabled={isPending}
              className="text-sm font-medium text-zinc-600 bg-transparent border border-zinc-200 rounded-xl px-2 py-1 outline-none focus:border-indigo-500 hover:border-zinc-300 transition-colors cursor-pointer"
            >
              <option value="en">EN</option>
              <option value="km">KM</option>
            </select>

            <div className="w-px h-6 bg-zinc-200 mx-1" />

            {isLoggedIn ? (
              <>
                {/* User Info */}
                <div className="flex items-center gap-x-3">
                  <div className="h-8 w-8 rounded-2xl bg-linear-to-br from-indigo-500 to-violet-500 flex items-center justify-center text-white text-sm font-semibold shadow-inner">
                    {initial}
                  </div>
                  <div>
                    <span className="text-sm font-medium text-zinc-700">
                      {t("hi")}, {userName}
                    </span>
                  </div>
                </div>

                {/* Dashboard Link */}
                <Link
                  href={`/${locale}/dashboard/${userRole}`}
                  className="text-sm font-medium px-5 py-2 rounded-3xl border border-zinc-200 hover:border-zinc-300 hover:bg-zinc-50 transition-all"
                >
                  {t("dashboard")}
                </Link>

                <LogoutButton />
              </>
            ) : (
              <>
                {/* Sign In */}
                <Link
                  href={`/${locale}/login`}
                  className="text-sm font-medium text-zinc-600 hover:text-zinc-900 px-5 py-2 transition-colors"
                >
                  {t("signIn")}
                </Link>

                {/* Get Started */}
                <Link
                  href={`/${locale}/register`}
                  className="group inline-flex items-center justify-center h-10 px-6 text-sm font-semibold text-white bg-linear-to-r from-indigo-600 to-violet-600 rounded-3xl shadow-lg shadow-indigo-500/30 hover:shadow-indigo-500/40 transition-all hover:scale-105 active:scale-95"
                >
                  {t("getStarted")}
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Toggle Button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 text-zinc-600 hover:text-zinc-900 transition-colors focus:outline-none"
              aria-label="Toggle menu"
            >
              {isMobileMenuOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Dropdown Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden absolute top-16 left-0 w-full bg-white border-b border-zinc-100 shadow-lg pb-6 pt-4 px-6 flex flex-col gap-y-4">
          <div className="flex items-center justify-between pb-4 border-b border-zinc-100">
            <span className="text-sm font-medium text-zinc-600">Language</span>
            <select
              defaultValue={locale}
              onChange={(e) => {
                switchLanguage(e);
                closeMenu();
              }}
              disabled={isPending}
              className="text-sm font-medium text-zinc-600 bg-transparent border border-zinc-200 rounded-xl px-3 py-1.5 outline-none focus:border-indigo-500 transition-colors cursor-pointer"
            >
              <option value="en">English</option>
              <option value="km">Khmer</option>
            </select>
          </div>

          {isLoggedIn ? (
            <>
              <div className="flex items-center gap-x-3 py-2">
                <div className="h-10 w-10 rounded-2xl bg-linear-to-br from-indigo-500 to-violet-500 flex items-center justify-center text-white text-base font-semibold shadow-inner">
                  {initial}
                </div>
                <span className="text-base font-medium text-zinc-800">
                  {t("hi")}, {userName}
                </span>
              </div>

              <Link
                href={`/${locale}/dashboard/${userRole}`}
                onClick={closeMenu}
                className="w-full text-center text-sm font-medium px-5 py-3 rounded-2xl border border-zinc-200 hover:bg-zinc-50 transition-all text-zinc-700"
              >
                {t("dashboard")}
              </Link>
              <div onClick={closeMenu}>
                <LogoutButton />
              </div>
            </>
          ) : (
            <div className="flex flex-col gap-y-3 pt-2">
              <Link
                href={`/${locale}/login`}
                onClick={closeMenu}
                className="w-full text-center text-sm font-medium text-zinc-700 border border-zinc-200 rounded-2xl py-3 hover:bg-zinc-50 transition-colors"
              >
                {t("signIn")}
              </Link>

              <Link
                href={`/${locale}/register`}
                onClick={closeMenu}
                className="w-full inline-flex items-center justify-center py-3 text-sm font-semibold text-white bg-linear-to-r from-indigo-600 to-violet-600 rounded-2xl shadow-md shadow-indigo-500/20 active:scale-[0.98] transition-all"
              >
                {t("getStarted")}
              </Link>
            </div>
          )}
        </div>
      )}
    </nav>
  );
}
