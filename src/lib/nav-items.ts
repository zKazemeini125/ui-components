import {
  LayoutGrid,
  Package,
  Users,
  Boxes,
  ClipboardList,
  Bell,
  Settings,
} from "lucide-react";

export type SubItem = {
  label: string;
  title: string;
  href: string;
};

export type NavItem = {
  label: string;
  title: string;
  icon: React.ElementType;
  href: string;
  children?: SubItem[];
};

export const navItems: NavItem[] = [
  {
    label: "داشبورد",
    title: "dashboard",
    icon: LayoutGrid,
    href: "/dashboard",
  },
  {
    label: "پروژه‌ها",
    title: "projects",
    icon: Package,
    href: "/projects",
    children: [
      {
        label: "پروژه‌های فعال",
        title: "active projects",
        href: "/projects",
      },
      {
        label: "پروژه‌های آرشیو شده",
        title: "archived projects",
        href: "/projects/archived",
      },
      {
        label: "افزودن پروژه جدید",
        title: "new project",
        href: "/projects/new",
      },
    ],
  },
  {
    label: "تامین‌کنندگان",
    title: "suppliers",
    icon: Users,
    href: "/suppliers",
    children: [
      {
        label: "لیست تامین‌کنندگان",
        title: "list suppliers",
        href: "/suppliers",
      },
      {
        label: "افزودن تامین‌کننده",
        title: "new supplier",
        href: "/suppliers/new",
      },
    ],
  },
  {
    label: "مواد",
    title: "materials",
    icon: Boxes,
    href: "/materials",
    children: [
      { label: "لیست مواد", title: "list materials", href: "/materials" },
      {
        label: "دسته‌بندی مواد",
        title: "group materials",
        href: "/materials/categories",
      },
      {
        label: "موجودی انبار",
        title: "inventory",
        href: "/materials/inventory",
      },
    ],
  },
  {
    label: "درخواست‌های من",
    title: "requests",
    icon: ClipboardList,
    href: "/requests",
  },
  {
    label: "اطلاعیه‌ها",
    title: "notifications",
    icon: Bell,
    href: "/notifications",
  },
  {
    label: "تنظیمات",
    title: "settings",
    icon: Settings,
    href: "/settings",
  },
];

// لیبل بخش‌هایی از مسیر که در navItems نیستند (مثل صفحات ویرایش یا شناسه‌های داینامیک)
// برای مسیرهای داینامیک (مثل /projects/[id])، بهتره از prop سفارشی Breadcrumb استفاده کنی
export const extraSegmentLabels: Record<string, string> = {
  edit: "ویرایش",
  new: "افزودن",
};
