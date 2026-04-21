"use client";

import { useTranslations } from "next-intl";
import { Mail, MessageSquare, MapPin } from "lucide-react";

export default function ContactPage() {
  const t = useTranslations("Contact");

  return (
    <main className="min-h-screen bg-white py-20 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          {/* Contact Info */}
          <div>
            <h1 className="text-4xl font-bold text-zinc-900 mb-6">{t("getInTouch") || "Get in Touch"}</h1>
            <p className="text-zinc-600 mb-10 text-lg">
              {t("contactText") || "Have questions about our AI-powered courses? Our team is here to help you navigate your learning journey."}
            </p>

            <div className="space-y-8">
              <div className="flex items-start gap-x-4">
                <div className="p-3 bg-indigo-50 rounded-lg text-indigo-600">
                  <Mail className="h-6 w-6" />
                </div>
                <div>
                  <p className="font-medium text-zinc-900">Email</p>
                  <p className="text-zinc-500">sokhonsenghong8@gmail.com</p>
                </div>
              </div>
              <div className="flex items-start gap-x-4">
                <div className="p-3 bg-indigo-50 rounded-lg text-indigo-600">
                  <MapPin className="h-6 w-6" />
                </div>
                <div>
                  <p className="font-medium text-zinc-900">Office</p>
                  <p className="text-zinc-500">Phnom Penh, Cambodia</p>
                </div>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="bg-zinc-50 p-8 rounded-3xl border border-zinc-100">
            <form className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-zinc-700 mb-2">{t("name") || "Name"}</label>
                <input type="text" className="w-full px-4 py-3 rounded-xl border border-zinc-200 focus:ring-2 focus:ring-indigo-500 outline-hidden bg-white" />
              </div>
              <div>
                <label className="block text-sm font-medium text-zinc-700 mb-2">Email</label>
                <input type="email" className="w-full px-4 py-3 rounded-xl border border-zinc-200 focus:ring-2 focus:ring-indigo-500 outline-hidden bg-white" />
              </div>
              <div>
                <label className="block text-sm font-medium text-zinc-700 mb-2">{t("message") || "Message"}</label>
                <textarea rows={4} className="w-full px-4 py-3 rounded-xl border border-zinc-200 focus:ring-2 focus:ring-indigo-500 outline-hidden bg-white" />
              </div>
              <button className="w-full bg-indigo-600 text-white py-4 rounded-xl font-semibold hover:bg-indigo-700 transition-colors shadow-lg shadow-indigo-100">
                {t("sendButton") || "Send Message"}
              </button>
            </form>
          </div>
        </div>
      </div>
    </main>
  );
}