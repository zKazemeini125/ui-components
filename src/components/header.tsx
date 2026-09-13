"use client";

import { Bell, Menu, UserRound } from "lucide-react";
import { useRouter } from "next/navigation";
import { useDictionary } from "@/lib/i18n-client";
import { useSidebar } from "@/lib/sidebar-context";
import { navItems } from "@/lib/nav-items";
import DateDisplay from "./dateDisplay";
import LanguageSwitcher from "./languageSwitcher";
import SearchBar, { type SearchColumn } from "./searchBar";

type SearchablePage = {
  label: string;
  href: string;
  section?: string;
};

// navItems (اصلی + زیرمنوها) رو به یک آرایه‌ی تخت برای جستجو تبدیل می‌کنیم
function flattenNavItems(): SearchablePage[] {
  const flat: SearchablePage[] = [];
  for (const item of navItems) {
    flat.push({ label: item.label, href: item.href });
    item.children?.forEach((sub) =>
      flat.push({ label: sub.label, href: sub.href, section: item.label }),
    );
  }
  return flat;
}

const searchColumns: SearchColumn<SearchablePage>[] = [
  { key: "label", header: "صفحه", accessor: (p) => p.label },
  { key: "section", header: "بخش", accessor: (p) => p.section ?? "" },
];

export default function Header() {
  const { header } = useDictionary();
  const { toggle } = useSidebar();
  const router = useRouter();

  const pages = flattenNavItems();

  return (
    <header
      className="bg-(--background) shadow-(--shadow-header) px-3 py-2.5 sm:px-4 sm:py-3 z-100"
      id="app-header"
    >
      <div className="mx-auto flex max-w-[1400px] items-center justify-between gap-2">
        <div className="flex min-w-0 items-center gap-2 sm:gap-[.5rem]">
          {/* دکمه همبرگر: فقط زیر md دیده می‌شه و سایدبار موبایل رو باز/بسته می‌کنه */}
          <button
            type="button"
            onClick={toggle}
            className="shrink-0 rounded-lg p-1.5 text-(--primary) hover:bg-(--muted) md:hidden"
            aria-label={header.menuLabel ?? "منو"}
          >
            <Menu size={22} strokeWidth={1.8} />
          </button>

          <div className="shrink-0 truncate text-xl font-bold text-(--primary) cursor-pointer px-1 sm:text-2xl md:text-3xl">
            {header.title}
          </div>

          {/* سرچ بار: خودش ریسپانسیو هست (اینپوت این‌لاین در دسکتاپ / دکمه+مودال در موبایل) */}
          <SearchBar
            data={pages}
            columns={searchColumns}
            getKey={(p) => p.href}
            onSelect={(p) => router.push(p.href)}
            placeholder={header.searchPlaceholder}
            mobileButtonLabel={header.searchButton}
            className="w-[220px] md:w-[300px]"
          />
        </div>

        <div className="flex shrink-0 items-center gap-1.5 sm:gap-[.5rem]">
          {/* تاریخ فقط از md به بالا؛ جای کمی می‌گیره اما اولویت پایینه */}
          <div className="hidden md:block">
            <DateDisplay />
          </div>

          <LanguageSwitcher />

          <button
            className="bg-transparent border-none text-lg cursor-pointer p-1 text-(--primary)"
            title={header.notificationsLabel}
          >
            <Bell />
          </button>

          <div className="hidden items-center sm:flex">
            <span
              id="user-role"
              className="bg-(--primary) text-(--primary-foreground) p-2 rounded-2xl text-sm inline-block my-0 mx-1 role-badge"
            >
              پیمانکار
            </span>
            {/* اسم کاربر فقط از md به بالا نشون داده می‌شه تا فضا برای موبایل باز بمونه */}
            <span id="user-name" className="hidden text-(--primary) md:inline">
              زهرا کاظمینی
            </span>
          </div>

          <button className="bg-transparent border-none text-lg cursor-pointer p-1 text-(--primary)">
            <UserRound />
          </button>
        </div>
      </div>
    </header>
  );
}
