import { NextIntlClientProvider } from "next-intl";
import { getMessages } from "next-intl/server";
import { notFound } from "next/navigation";
import Providers from "./providers";

const locales = ["en", "km"];

export default async function LocaleLayout(props: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  // 1. Await params properly for Next.js 16
  const params = await props.params;
  const locale = params.locale;

  // 2. Validate locale
  if (!locales.includes(locale)) {
    notFound();
  }

  // 3. Load messages
  let messages;
  try {
    messages = await getMessages();
  } catch (e) {
    console.error("❌ getMessages FAILED:", e);
    messages = {};
  }

  return (
    <html lang={locale} suppressHydrationWarning>
      <body className="antialiased" suppressHydrationWarning>
        <NextIntlClientProvider locale={locale} messages={messages}>
          <Providers>{props.children}</Providers>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
