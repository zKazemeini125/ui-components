"use client";

import { ReactNode } from "react";
import { Plus, Pencil, Trash2, Save, X } from "lucide-react";
import Breadcrumb, { BreadcrumbItem } from "./breadcrumb";

interface FormProps {
  /** آیتم‌های breadcrumb (اختیاری - اگه ندی از روی مسیر ساخته می‌شه) */
  breadcrumbItems?: BreadcrumbItem[];
  className?: string;
  children?: ReactNode;

  /** آیا این فرم دکمه‌های CRUD داره یا فقط یه صفحه‌ی نمایشیه */
  isForm?: boolean;

  /** فقط دکمه‌هایی نمایش داده می‌شن که handler براشون پاس داده بشه */
  onCreate?: () => void;
  onEdit?: () => void;
  onDelete?: () => void;
  onSave?: () => void;
  onCancel?: () => void;
}

export default function Form({
  breadcrumbItems,
  className = "",
  children,
  isForm = true,
  onCreate,
  onEdit,
  onDelete,
  onSave,
  onCancel,
}: FormProps) {
  return (
    <div className={`flex flex-col ${className}`}>
      {/* هدر: breadcrumb + دکمه‌های CRUD */}
      <div className="flex items-center justify-between border-b border-(--muted) p-3">
        <Breadcrumb items={breadcrumbItems} />

        {isForm && (
          <div className="flex items-center gap-2">
            {onCreate && (
              <button
                type="button"
                onClick={onCreate}
                className="flex items-center gap-1.5 rounded-lg bg-(--primary) px-3 py-1.5 text-sm text-(--primary-foreground) transition-colors hover:opacity-90"
              >
                <Plus size={16} strokeWidth={1.8} />
                جدید
              </button>
            )}

            {onEdit && (
              <button
                type="button"
                onClick={onEdit}
                className="flex items-center gap-1.5 rounded-lg bg-(--muted) px-3 py-1.5 text-sm text-(--primary) transition-colors hover:bg-(--accent-opacity)"
              >
                <Pencil size={15} strokeWidth={1.8} />
                ویرایش
              </button>
            )}

            {onSave && (
              <button
                type="button"
                onClick={onSave}
                className="flex items-center gap-1.5 rounded-lg bg-(--secondary) px-3 py-1.5 text-sm text-(--secondary-foreground) transition-colors hover:bg-(--accent)"
              >
                <Save size={15} strokeWidth={1.8} />
                ذخیره
              </button>
            )}

            {onDelete && (
              <button
                type="button"
                onClick={onDelete}
                className="flex items-center gap-1.5 rounded-lg border border-red-200 px-3 py-1.5 text-sm text-red-600 transition-colors hover:bg-red-50"
              >
                <Trash2 size={15} strokeWidth={1.8} />
                حذف
              </button>
            )}

            {onCancel && (
              <button
                type="button"
                onClick={onCancel}
                className="flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm text-(--muted-foreground) transition-colors hover:bg-(--muted)"
              >
                <X size={15} strokeWidth={1.8} />
                انصراف
              </button>
            )}

            {/* TODO: دکمه فول‌اسکرین بعداً همین‌جا اضافه می‌شه */}
          </div>
        )}
      </div>

      {/* محتوای فرم */}
      <div className="p-4">{children}</div>
    </div>
  );
}
