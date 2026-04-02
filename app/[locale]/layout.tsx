// app/[locale]/layout.tsx — restore this
import { NextIntlClientProvider } from "next-intl";
import { getMessages } from "next-intl/server";
import { notFound } from "next/navigation";
import Providers from "./providers";

const locales = ["en", "km"];

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  console.log("🔍 LOCALE:", locale);

  if (!locales.includes(locale)) {
    notFound();
  }

  let messages;
  try {
    messages = await getMessages();
    console.log("✅ messages loaded, keys:", Object.keys(messages).length);
  } catch (e) {
    console.error("❌ getMessages FAILED:", e);
    messages = {};
  }

  return (
    <html lang={locale} suppressHydrationWarning>
      <body>
        <NextIntlClientProvider locale={locale} messages={messages}>
          <Providers>{children}</Providers>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
