"use client";

import { useLocale } from "@/lib/i18n-client";
import { toPersianDigits, toEnglishDigits } from "@/lib/numerals";
import { ChangeEvent, InputHTMLAttributes } from "react";

type NumericInputProps = Omit<InputHTMLAttributes<HTMLInputElement>, "value" | "onChange"> & {
  value: string;
  onChange: (value: string) => void;
};

/**
 * ورودی عددی چندزبانه:
 * - نمایش: ارقام مطابق locale فعلی (فارسی وقتی locale=fa)
 * - مقدار واقعی که به onChange می‌ره: همیشه رقم انگلیسی خالص (0-9)
 *
 * استفاده:
 *   const [price, setPrice] = useState("");
 *   <NumericInput value={price} onChange={setPrice} />
 */
export default function NumericInput({ value, onChange, ...rest }: NumericInputProps) {
  const locale = useLocale();

  const displayValue = locale === "fa" ? toPersianDigits(value) : value;

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const rawEnglish = toEnglishDigits(e.target.value).replace(/[^0-9.]/g, "");
    onChange(rawEnglish);
  };

  return (
    <input
      {...rest}
      type="text"
      inputMode="numeric"
      value={displayValue}
      onChange={handleChange}
      dir="ltr"
    />
  );
}
