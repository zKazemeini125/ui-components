"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { ChevronDown, Globe } from "lucide-react";
import { locales, type Locale } from "@/apps/web/i18n-config";

// اگه اسم/برچسب زبون خاصی نداشتی، از همین نگاشت استفاده می‌شه.
// هر locale ای که توی i18n-config نبود، به‌صورت خودکار با حروف بزرگ نشون داده می‌شه.
const localeLabels: Partial<Record<Locale, string>> = {
  fa: "فارسی",
  en: "English",
};

function getLabel(locale: Locale) {
  return localeLabels[locale] ?? locale.toUpperCase();
}

// مسیر فعلی رو می‌گیره و بخش locale اولش رو با locale جدید عوض می‌کنه
function replaceLocaleInPath(pathname: string, nextLocale: Locale) {
  const segments = pathname.split("/");
  // segments[0] همیشه رشته‌ی خالیه (چون pathname با / شروع می‌شه)، segments[1] locale هست
  if (segments.length > 1) {
    segments[1] = nextLocale;
  }
  return segments.join("/") || `/${nextLocale}`;
}

export default function LanguageSwitcher() {
  const pathname = usePathname();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const currentLocale = (pathname.split("/")[1] as Locale) ?? locales[0];

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  function handleSelect(locale: Locale) {
    setOpen(false);
    if (locale === currentLocale) return;
    router.push(replaceLocaleInPath(pathname, locale));
  }

  return (
    <div className="relative" ref={containerRef}>
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        className="flex items-center gap-1.5 rounded-lg bg-transparent px-2 py-1.5 text-sm text-(--primary) transition-colors hover:bg-(--muted)"
        title="تغییر زبان"
        aria-haspopup="listbox"
        aria-expanded={open}
      >
        <Globe size={18} strokeWidth={1.8} />
        <span>{getLabel(currentLocale)}</span>
        <ChevronDown
          size={14}
          strokeWidth={2}
          className={`transition-transform duration-200 ${open ? "rotate-180" : ""}`}
        />
      </button>

      {open && (
        <ul
          role="listbox"
          className="absolute end-0 z-50 mt-1.5 w-36 overflow-hidden rounded-lg bg-(--background) py-1 shadow-(--shadow-header)"
        >
          {locales.map((locale) => {
            const isActive = locale === currentLocale;
            return (
              <li key={locale}>
                <button
                  type="button"
                  role="option"
                  aria-selected={isActive}
                  onClick={() => handleSelect(locale)}
                  className={`flex w-full items-center px-3 py-2 text-start text-sm transition-colors ${
                    isActive
                      ? "bg-(--accent-opacity) font-medium text-(--primary)"
                      : "text-(--primary) hover:bg-(--muted)"
                  }`}
                >
                  {getLabel(locale)}
                </button>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
