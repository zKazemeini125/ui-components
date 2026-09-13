"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronLeft, Home } from "lucide-react";
import { navItems, extraSegmentLabels } from "./lib/nav-items";

export type BreadcrumbItem = {
  label: string;
  href?: string;
};

export interface BreadcrumbProps {
  /**
   * برای صفحات با محتوای داینامیک (مثلاً جزئیات یک پروژه)، این prop رو بده
   * تا به‌جای تولید خودکار از روی آدرس، همین لیست نمایش داده بشه. مثال:
   *
   *   <Breadcrumb items={[
   *     { label: "پروژه‌ها", href: "/projects" },
   *     { label: project.name },
   *   ]} />
   */
  items?: BreadcrumbItem[];
  className?: string;
}

// نگاشتی از href به لیبل فارسی، ساخته‌شده از navItems (هم آیتم‌های اصلی و هم زیرمنوها)
function buildLabelMap() {
  const map = new Map<string, string>();
  for (const item of navItems) {
    map.set(item.href, item.label);
    item.children?.forEach((sub) => map.set(sub.href, sub.label));
  }
  return map;
}

const labelMap = buildLabelMap();

function getSegmentLabel(segment: string, href: string) {
  return labelMap.get(href) ?? extraSegmentLabels[segment] ?? segment;
}

function buildItemsFromPath(pathname: string): BreadcrumbItem[] {
  const segments = pathname.split("/").filter(Boolean);

  return segments.map((segment, index) => {
    const href = "/" + segments.slice(0, index + 1).join("/");
    return { label: getSegmentLabel(segment, href), href };
  });
}

export default function Breadcrumb({ items, className = "" }: BreadcrumbProps) {
  const pathname = usePathname();
  const crumbs = items ?? buildItemsFromPath(pathname);

  if (crumbs.length === 0) return null;

  return (
    <nav aria-label="مسیر صفحه" className={`flex items-center text-[13.5px] ${className}`}>
      <ol className="flex items-center gap-1.5">
        <li className="flex items-center gap-1.5">
          <Link
            href="/dashboard"
            className="flex items-center text-(--muted-foreground) transition-colors hover:text-(--primary)"
            aria-label="داشبورد"
          >
            <Home size={15} strokeWidth={1.8} color="var(--primary)" />
          </Link>
          <ChevronLeft size={14} strokeWidth={2} className="text-(--muted-foreground)" />
        </li>

        {crumbs.map((crumb, index) => {
          const isLast = index === crumbs.length - 1;
          return (
            <li key={`${crumb.label}-${index}`} className="flex items-center gap-1.5">
              {crumb.href && !isLast ? (
                <Link
                  href={crumb.href}
                  className="text-(--muted-foreground) transition-colors hover:text-(--primary)"
                >
                  {crumb.label}
                </Link>
              ) : (
                <span
                  className={
                    isLast
                      ? "font-medium text-(--primary)"
                      : "text-(--muted-foreground)"
                  }
                  aria-current={isLast ? "page" : undefined}
                >
                  {crumb.label}
                </span>
              )}
              {!isLast && (
                <ChevronLeft size={14} strokeWidth={2} className="text-(--muted-foreground)" />
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
