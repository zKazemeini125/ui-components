"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";
import {
  LayoutGrid,
  Package,
  Users,
  Boxes,
  ClipboardList,
  Bell,
  Settings,
  ChevronLeft,
  LogOut,
} from "lucide-react";
import Link from "next/link";
import { useLocale, useDictionary } from "@/lib/i18n-client";
import { useSidebar } from "@/lib/sidebar-context";

type SubItem = {
  title: string;
  href: string;
};

type NavItem = {
  title: string;
  icon: React.ElementType;
  href: string;
  children?: SubItem[];
};

export default function MainSidebar() {
  const pathname = usePathname();
  const locale = useLocale();
  const { sidebar } = useDictionary();

  // isOpen اینجا وضعیت "باز/بسته بودن سایدبار در موبایل" هست (از context مشترک با هدر)
  const { isOpen, close } = useSidebar();

  // این state جدا و فقط برای باز/بسته بودن زیرمنوهاست (اسمش رو عوض کردم تا با isOpen بالا تداخل نداشته باشه)
  const [openHref, setOpenHref] = useState<string | null>(
    `/${locale}/dashboard`,
  );

  const toggleSubmenu = (href: string) => {
    setOpenHref((prev) => (prev === href ? null : href));
  };

  const navItems: NavItem[] = [
    {
      title: sidebar.dashboard,
      icon: LayoutGrid,
      href: `/${locale}/dashboard`,
    },
    {
      title: sidebar.projects,
      icon: Package,
      href: `/${locale}/projects`,
      children: [
        { title: sidebar.activeProjects, href: `/${locale}/projects` },
        {
          title: sidebar.archivedProjects,
          href: `/${locale}/projects/archived`,
        },
        { title: sidebar.newProject, href: `/${locale}/projects/new` },
      ],
    },
    {
      title: sidebar.suppliers,
      icon: Users,
      href: `/${locale}/suppliers`,
      children: [
        { title: sidebar.listSuppliers, href: `/${locale}/suppliers` },
        { title: sidebar.newSupplier, href: `/${locale}/suppliers/new` },
      ],
    },
    {
      title: sidebar.materials,
      icon: Boxes,
      href: `/${locale}/materials`,
      children: [
        { title: sidebar.listMaterials, href: `/${locale}/materials` },
        {
          title: sidebar.categoriesMaterials,
          href: `/${locale}/materials/categories`,
        },
        { title: sidebar.inventory, href: `/${locale}/materials/inventory` },
      ],
    },
    {
      title: sidebar.requests,
      icon: ClipboardList,
      href: `/${locale}/requests`,
    },
    {
      title: sidebar.notifications,
      icon: Bell,
      href: `/${locale}/notifications`,
    },
    {
      title: sidebar.settings,
      icon: Settings,
      href: `/${locale}/settings`,
    },
  ];

  return (
    <>
      {/* بک‌دراپ موبایل: با کلیک روی پس‌زمینه سایدبار بسته می‌شه */}
      {isOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/40 md:hidden"
          onClick={close}
          aria-hidden="true"
        />
      )}

      <aside
        className={`fixed inset-y-0 right-0 z-40 flex h-full w-70 shrink-0 flex-col border-l border-(--muted) bg-(--background) text-(--foreground) transition-transform duration-300 ease-out md:static md:translate-x-0 ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <nav className="min-h-0 flex-1 overflow-y-auto px-2 py-2 scrollbar-thumb-(--primary-foreground) scrollbar-track-(--muted) scrollbar-thin scrollbar-gutter-stable">
          <ul className="flex flex-col gap-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const hasChildren = !!item.children?.length;
              const isChildActive = item.children?.some(
                (sub) => pathname === sub.href,
              );
              const isActive = pathname === item.href;
              const isSubmenuOpen =
                openHref === item.href || (openHref === null && isChildActive);

              return (
                <li key={item.href}>
                  {!hasChildren ? (
                    <Link href={item.href} onClick={close}>
                      <button
                        type="button"
                        className={`group flex w-full items-center justify-between rounded-lg px-3 py-2.5 text-[15px] transition-colors  ${
                          isActive
                            ? "bg-(--accent-opacity) font-medium text-(--primary)"
                            : "text-(--primary) hover:bg-(--muted)"
                        }`}
                      >
                        <span className="flex items-center gap-3">
                          <Icon
                            size={19}
                            strokeWidth={1.8}
                            className="text-(--primary)"
                          />
                          <span>{item.title}</span>
                        </span>
                      </button>
                    </Link>
                  ) : (
                    <button
                      type="button"
                      onClick={() => toggleSubmenu(item.href)}
                      className={`group flex w-full items-center justify-between rounded-lg px-3 py-2.5 text-[15px] transition-colors  ${
                        isChildActive
                          ? "bg-(--muted) rounded-sm font-medium text-(--primary)"
                          : "text-(--primary) hover:bg-(--muted)"
                      }`}
                    >
                      <span className="flex items-center gap-3">
                        <Icon
                          size={19}
                          strokeWidth={1.8}
                          className="text-(--primary)"
                        />
                        <span>{item.title}</span>
                      </span>
                      <ChevronLeft
                        size={16}
                        strokeWidth={2}
                        className={`transition-transform duration-300 ${
                          isSubmenuOpen ? "-rotate-90" : ""
                        }`}
                        style={{
                          color: "var(--primary)",
                        }}
                      />
                    </button>
                  )}

                  {hasChildren && (
                    <ul
                      className={`grid overflow-hidden transition-all duration-300 ease-out ${
                        isSubmenuOpen
                          ? "grid-rows-[1fr] opacity-100"
                          : "grid-rows-[0fr] opacity-0"
                      }`}
                    >
                      <div className="overflow-hidden">
                        <div className="mr-[26px] mt-1 flex flex-col gap-0.5 border-r border-(--muted-foreground) pr-4">
                          {item.children!.map((sub) => {
                            const subActive = pathname === sub.href;
                            return (
                              <Link
                                href={sub.href}
                                key={sub.href}
                                onClick={close}
                                className={`rounded-md px-3 py-2 text-right text-[13.5px] transition-colors ${
                                  subActive
                                    ? "bg-(--accent-opacity) font-medium text-(--primary)"
                                    : "text-(--muted-foreground) hover:bg-(--muted)"
                                }`}
                              >
                                <button type="button">{sub.title}</button>
                              </Link>
                            );
                          })}
                        </div>
                      </div>
                    </ul>
                  )}
                </li>
              );
            })}
          </ul>
        </nav>

        <div className="shrink-0 p-4">
          <button
            type="button"
            className="flex w-full items-center justify-center gap-2 rounded-full bg-(--secondary) py-2 text-[14px] text-(--secondary-foreground) transition-colors hover:bg-(--accent) hover:text-(--accent-foreground)"
          >
            <span>{sidebar.logout}</span>
            <LogOut size={16} strokeWidth={1.8} />
          </button>
        </div>
      </aside>
    </>
  );
}
