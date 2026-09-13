"use client";

import { usePathname } from "next/navigation";
import fa from "@/messages/fa.json";
import en from "@/messages/en.json";
import { locales, defaultLocale, type Locale } from "@/apps/web/i18n-config";

const dictionaries = { fa, en };

export function useLocale(): Locale {
  const pathname = usePathname();
  const segment = pathname.split("/")[1];
  return (locales as readonly string[]).includes(segment)
    ? (segment as Locale)
    : defaultLocale;
}

export function useDictionary() {
  const locale = useLocale();
  return dictionaries[locale];
}
