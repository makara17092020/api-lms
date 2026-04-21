import { NextIntlClientProvider } from "next-intl";
import { getMessages } from "next-intl/server";
import { notFound } from "next/navigation";
import Providers from "./providers";

const locales = ["en", "km"];

export default async function LocaleLayout(props: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const params = await props.params;
  const locale = params.locale;

  if (!locales.includes(locale)) {
    notFound();
  }

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
