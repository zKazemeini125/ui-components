const persianDigits = ["۰", "۱", "۲", "۳", "۴", "۵", "۶", "۷", "۸", "۹"];

/**
 * تبدیل ارقام انگلیسی (0-9) داخل یک رشته یا عدد به ارقام فارسی
 */
export function toPersianDigits(input: string | number): string {
  return String(input).replace(/[0-9]/g, (digit) => persianDigits[Number(digit)]);
}

/**
 * تبدیل ارقام فارسی (۰-۹) داخل یک رشته به ارقام انگلیسی معادل
 * برای زمانی که کاربر داخل input رقم فارسی تایپ می‌کنه ولی باید مقدار واقعی انگلیسی باشه
 */
export function toEnglishDigits(input: string): string {
  return input.replace(/[۰-۹]/g, (digit) => String(persianDigits.indexOf(digit)));
}

/**
 * تابع اصلی نمایش: بر اساس locale فعلی، عدد رو به ارقام مناسب تبدیل می‌کنه
 */
export function localizeDigits(input: string | number, locale: string): string {
  if (locale === "fa") return toPersianDigits(input);
  return String(input);
}