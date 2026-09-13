"use client";

import { usePathname } from "next/navigation";
import { Vazirmatn } from "next/font/google";

const vazirmatn = Vazirmatn({
  subsets: ["arabic"],
  weight: ["400", "500", "600"],
  display: "swap",
});

type Locale = "fa" | "en";

interface DateDisplayProps {
  /** اگه ندی، تاریخ الان استفاده می‌شه */
  date?: Date;
  /** اگه ندی، از سگمنت اول مسیر (/en/... یا /fa/...) تشخیص داده می‌شه */
  locale?: Locale;
  className?: string;
}

const PERSIAN_WEEKDAYS = [
  "یکشنبه",
  "دوشنبه",
  "سه‌شنبه",
  "چهارشنبه",
  "پنجشنبه",
  "جمعه",
  "شنبه",
];

const ENGLISH_WEEKDAYS = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];

function div(a: number, b: number) {
  return Math.floor(a / b);
}

// تبدیل میلادی به جلالی (الگوریتم استاندارد Borkowski)
function gregorianToJalali(
  gy: number,
  gm: number,
  gd: number,
): [number, number, number] {
  const g_d_m = [0, 31, 59, 90, 120, 151, 181, 212, 243, 273, 304, 334];
  const gy2 = gm > 2 ? gy + 1 : gy;
  let days =
    355666 +
    365 * gy +
    div(gy2 + 3, 4) -
    div(gy2 + 99, 100) +
    div(gy2 + 399, 400) +
    gd +
    g_d_m[gm - 1];

  let jy = -1595 + 33 * div(days, 12053);
  days %= 12053;
  jy += 4 * div(days, 1461);
  days %= 1461;

  if (days > 365) {
    jy += div(days - 1, 365);
    days = (days - 1) % 365;
  }

  let jm: number;
  let jd: number;
  if (days < 186) {
    jm = 1 + div(days, 31);
    jd = 1 + (days % 31);
  } else {
    jm = 7 + div(days - 186, 30);
    jd = 1 + ((days - 186) % 30);
  }

  return [jy, jm, jd];
}

function pad(n: number) {
  return n.toString().padStart(2, "0");
}

export default function DateDisplay({
  date,
  locale,
  className = "",
}: DateDisplayProps) {
  const pathname = usePathname();
  const resolvedLocale: Locale =
    locale ?? (pathname?.split("/")[1] === "en" ? "en" : "fa");

  const d = date ?? new Date();
  const weekdayIndex = d.getDay(); // 0 = یکشنبه/Sunday

  if (resolvedLocale === "en") {
    const y = d.getFullYear();
    const m = pad(d.getMonth() + 1);
    const day = pad(d.getDate());
    const weekday = ENGLISH_WEEKDAYS[weekdayIndex];

    return (
      <span dir="ltr" className={`font-sans tabular-nums ${className}`}>
        {`${y}-${m}-${day} ${weekday}`}
      </span>
    );
  }

  const [jy, jm, jd] = gregorianToJalali(
    d.getFullYear(),
    d.getMonth() + 1,
    d.getDate(),
  );
  const weekday = PERSIAN_WEEKDAYS[weekdayIndex];

  return (
    <span
      dir="rtl"
      className={`${vazirmatn.className} tabular-nums ${className}`}
    >
      {`${weekday} ${jy}/${pad(jm)}/${pad(jd)}`}
    </span>
  );
}
