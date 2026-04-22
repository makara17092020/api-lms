"use client";

import { useTranslations } from "next-intl";
import {
  Mail,
  MessageSquare,
  MapPin,
  Phone,
  Facebook,
  Linkedin,
  Send,
} from "lucide-react";

export default function ContactPage() {
  const t = useTranslations("Contact");

  return (
    <main className="min-h-screen bg-[#FAFAF9] py-20 px-6 relative overflow-hidden">
      <div
        className="absolute inset-0 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] background-size-[28px_28px] opacity-40 pointer-events-none"
        aria-hidden="true"
      />

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Header Section */}
        <div className="max-w-2xl mx-auto text-center mb-20">
          <div className="inline-flex items-center gap-x-2 bg-white border border-indigo-100 shadow-sm px-6 py-2.5 rounded-3xl text-sm font-medium text-indigo-700 mb-8">
            <div className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
            </div>
            {t("hereToHelp")}
          </div>

          <h1 className="text-5xl lg:text-6xl font-bold tracking-tighter text-zinc-900 mb-6">
            {t("getInTouch")}
          </h1>

          <p className="text-xl text-zinc-600 mb-8 max-w-md mx-auto">
            {t("contactText")}
          </p>

          <div className="inline-flex items-center gap-x-3 bg-emerald-50 text-emerald-700 px-6 py-2.5 rounded-3xl text-sm font-medium shadow-sm">
            <MessageSquare className="h-4 w-4" />
            {t("repliesWithin")}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-start">
          {/* Info Column */}
          <div className="lg:col-span-5 space-y-6">
            <div className="group bg-white border border-indigo-100 rounded-3xl p-7 shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-1">
              <div className="flex items-start gap-5">
                <div className="p-4 bg-indigo-50 text-indigo-600 rounded-2xl shrink-0 group-hover:bg-indigo-100 transition-colors">
                  <Mail className="h-6 w-6" />
                </div>
                <div className="flex-1 min-w-0 pt-1">
                  <p className="text-sm uppercase tracking-widest font-medium text-zinc-500 mb-1">
                    {t("email")}
                  </p>
                  <a
                    href="mailto:sokhonsenghong8@gmail.com"
                    className="block text-lg font-medium text-zinc-900 hover:text-indigo-600 transition-colors break-all"
                  >
                    sokhonsenghong8@gmail.com
                  </a>
                </div>
              </div>
            </div>

            <div className="group bg-white border border-indigo-100 rounded-3xl p-7 shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-1">
              <div className="flex items-start gap-5">
                <div className="p-4 bg-indigo-50 text-indigo-600 rounded-2xl shrink-0 group-hover:bg-indigo-100 transition-colors">
                  <Mail className="h-6 w-6" />
                </div>
                <div className="flex-1 min-w-0 pt-1">
                  <p className="text-sm uppercase tracking-widest font-medium text-zinc-500 mb-1">
                    {t("email")}
                  </p>
                  <a
                    href="mailto:chanthamakara.info@gmail.com"
                    className="block text-lg font-medium text-zinc-900 hover:text-indigo-600 transition-colors break-all"
                  >
                    chanthamakara.info@gmail.com
                  </a>
                </div>
              </div>
            </div>

            <div className="group bg-white border border-indigo-100 rounded-3xl p-7 shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-1">
              <div className="flex items-start gap-5">
                <div className="p-4 bg-indigo-50 text-indigo-600 rounded-2xl shrink-0 group-hover:bg-indigo-100 transition-colors">
                  <Phone className="h-6 w-6" />
                </div>
                <div className="flex-1 min-w-0 pt-1">
                  <p className="text-sm uppercase tracking-widest font-medium text-zinc-500 mb-1">
                    {t("phone")}
                  </p>
                  <a
                    href="tel:+855965383113"
                    className="block text-lg font-medium text-zinc-900 hover:text-indigo-600 transition-colors"
                  >
                    +855 965 383 113
                  </a>
                </div>
              </div>
            </div>

            <div className="group bg-white border border-indigo-100 rounded-3xl p-7 shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-1">
              <div className="flex items-start gap-5">
                <div className="p-4 bg-indigo-50 text-indigo-600 rounded-2xl shrink-0 group-hover:bg-indigo-100 transition-colors">
                  <MapPin className="h-6 w-6" />
                </div>
                <div className="flex-1 min-w-0 pt-1">
                  <p className="text-sm uppercase tracking-widest font-medium text-zinc-500 mb-1">
                    {t("office")}
                  </p>
                  <p className="text-lg font-medium text-zinc-900">
                    {t("location")}
                  </p>
                </div>
              </div>
            </div>

            {/* Social Links */}
            <div className="bg-white border border-indigo-100 rounded-3xl p-8 shadow-sm">
              <p className="uppercase text-xs tracking-[0.5px] font-medium text-zinc-400 mb-6">
                {t("connect")}
              </p>
              <div className="flex items-center gap-4">
                {/* Telegram */}
                <a
                  href="https://t.me/M_akaara"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 flex items-center justify-center gap-3 py-5 border border-indigo-100 rounded-2xl hover:bg-indigo-50 transition-all group"
                >
                  <Send className="h-5 w-5 text-indigo-600 group-hover:scale-110 transition-transform" />
                  <span className="font-medium text-zinc-700 text-sm">
                    Telegram
                  </span>
                </a>

                {/* Facebook */}
                <a
                  href="https://www.facebook.com/share/18d3kbx6RW/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 flex items-center justify-center gap-3 py-5 border border-indigo-100 rounded-2xl hover:bg-indigo-50 transition-all group"
                >
                  <Facebook className="h-5 w-5 text-indigo-600 group-hover:scale-110 transition-transform" />
                  <span className="font-medium text-zinc-700 text-sm">
                    Facebook
                  </span>
                </a>

                {/* LinkedIn */}
                <a
                  href="https://www.linkedin.com/in/makara-chantha-30278738b/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 flex items-center justify-center gap-3 py-5 border border-indigo-100 rounded-2xl hover:bg-indigo-50 transition-all group"
                >
                  <Linkedin className="h-5 w-5 text-indigo-600 group-hover:scale-110 transition-transform" />
                  <span className="font-medium text-zinc-700 text-sm">
                    LinkedIn
                  </span>
                </a>
              </div>
            </div>
          </div>

          {/* Form Column */}
          <div className="lg:col-span-7">
            <div className="bg-white border border-indigo-100 rounded-3xl p-8 lg:p-10 shadow-sm">
              <form className="space-y-9">
                <div className="relative">
                  <input
                    type="text"
                    id="name"
                    placeholder=" "
                    className="peer w-full px-5 pt-7 pb-3 bg-white border border-zinc-200 rounded-2xl focus:border-indigo-400 focus:ring-4 focus:ring-indigo-50 outline-none text-base text-zinc-900 transition-all"
                  />
                  <label
                    htmlFor="name"
                    className="absolute left-5 top-6 text-zinc-500 text-base transition-all duration-200 peer-focus:top-3 peer-focus:text-xs peer-focus:font-medium peer-focus:text-indigo-600 peer-not-placeholder-shown:top-3 peer-not-placeholder-shown:text-xs pointer-events-none"
                  >
                    {t("name")}
                  </label>
                </div>

                <div className="relative">
                  <input
                    type="email"
                    id="email"
                    placeholder=" "
                    className="peer w-full px-5 pt-7 pb-3 bg-white border border-zinc-200 rounded-2xl focus:border-indigo-400 focus:ring-4 focus:ring-indigo-50 outline-none text-base text-zinc-900 transition-all"
                  />
                  <label
                    htmlFor="email"
                    className="absolute left-5 top-6 text-zinc-500 text-base transition-all duration-200 peer-focus:top-3 peer-focus:text-xs peer-focus:font-medium peer-focus:text-indigo-600 peer-not-placeholder-shown:top-3 peer-not-placeholder-shown:text-xs pointer-events-none"
                  >
                    {t("email")}
                  </label>
                </div>

                <div>
                  <label className="block text-sm font-medium text-zinc-700 mb-2">
                    {t("subject")}
                  </label>
                  <select className="w-full px-5 py-4 bg-white border border-zinc-200 rounded-2xl focus:border-indigo-400 focus:ring-4 focus:ring-indigo-50 outline-none text-base text-zinc-900 appearance-none">
                    <option value="">{t("subjectPlaceholder")}</option>
                    <option value="general">{t("generalInquiry")}</option>
                    <option value="technical">{t("technicalSupport")}</option>
                    <option value="partnership">{t("partnership")}</option>
                    <option value="feedback">{t("feedback")}</option>
                  </select>
                </div>

                <div className="relative">
                  <textarea
                    id="message"
                    rows={5}
                    placeholder=" "
                    className="peer w-full px-5 pt-7 pb-3 bg-white border border-zinc-200 rounded-2xl focus:border-indigo-400 focus:ring-4 focus:ring-indigo-50 outline-none text-base text-zinc-900 resize-none transition-all"
                  />
                  <label
                    htmlFor="message"
                    className="absolute left-5 top-6 text-zinc-500 text-base transition-all duration-200 peer-focus:top-3 peer-focus:text-xs peer-focus:font-medium peer-focus:text-indigo-600 peer-not-placeholder-shown:top-3 peer-not-placeholder-shown:text-xs pointer-events-none"
                  >
                    {t("message")}
                  </label>
                </div>

                <button
                  type="submit"
                  className="group relative w-full overflow-hidden bg-indigo-600 text-white py-5 rounded-2xl font-semibold text-lg shadow-lg hover:shadow-xl active:scale-[0.985] transition-all"
                >
                  <span className="relative z-10 flex items-center justify-center gap-x-2">
                    {t("sendButton")}
                  </span>
                  <span className="absolute inset-0 bg-linear-to-r from-transparent via-white/25 to-transparent -skew-x-12 translate-x-[-200%] group-hover:translate-x-[200%] transition-transform duration-700"></span>
                </button>

                <p className="text-center text-xs text-zinc-400">
                  {t("disclaimer")}
                </p>
              </form>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
