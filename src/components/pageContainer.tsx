import { ReactNode } from "react";
import Breadcrumb, { BreadcrumbItem } from "./breadcrumb";

interface PageContainerProps {
  /** آیتم‌های breadcrumb (اختیاری - اگه ندی از روی مسیر ساخته می‌شه) */
  breadcrumbItems?: BreadcrumbItem[];
  className?: string;
  children?: ReactNode;
}

export default function PageContainer({
  breadcrumbItems,
  className = "",
  children,
}: PageContainerProps) {
  return (
    <div className={`flex flex-col ${className}`}>
      {/* هدر: فقط breadcrumb، بدون دکمه‌های CRUD */}
      <div className="border-b border-(--muted) p-3">
        <Breadcrumb items={breadcrumbItems} />
      </div>
      <div className="p-2">{children}</div>
    </div>
  );
}
