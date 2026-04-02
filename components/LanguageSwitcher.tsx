"use client";

import { usePathname, useRouter } from "next/navigation";
import { ChangeEvent, useTransition } from "react";

export default function LanguageSwitcher() {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();
  const pathname = usePathname(); // e.g., /en/dashboard

  const onSelectChange = (event: ChangeEvent<HTMLSelectElement>) => {
    const nextLocale = event.target.value;

    // Replace the current locale in the URL with the new one
    // e.g., /en/dashboard -> /km/dashboard
    const newPath = pathname.replace(/^\/[^\/]+/, `/${nextLocale}`);

    startTransition(() => {
      router.replace(newPath);
    });
  };

  // Determine current locale from the URL to set the default dropdown value
  const currentLocale = pathname.split("/")[1];

  return (
    <select
      defaultValue={currentLocale}
      onChange={onSelectChange}
      disabled={isPending}
      className="p-2 border rounded"
    >
      <option value="en">English</option>
      <option value="km">ភាសាខ្មែរ (Khmer)</option>
    </select>
  );
}
