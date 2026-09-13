"use client";

import {
  useEffect,
  useMemo,
  useRef,
  useState,
  type KeyboardEvent,
  type ReactNode,
} from "react";
import { Search, X } from "lucide-react";
import { useDictionary } from "@/lib/i18n-client";

/**
 * ---------------------------------------------------------------------------
 * SearchBar
 * ---------------------------------------------------------------------------
 * یک کامپوننت سرچ عمومی و قابل استفاده مجدد:
 *
 *  - دیتای سورس (data) و ستون‌های قابل‌جستجو/نمایش (columns) از بیرون داده می‌شن،
 *    یعنی این کامپوننت هیچ فرضی درباره‌ی شکل داده نداره و همه‌جا قابل استفاده‌ست.
 *  - سرچ به‌صورت لایو (روی هر keystroke) و کلاینت-ساید انجام می‌شه.
 *  - بخش‌های منطبق با عبارت جستجو در نتایج هایلایت می‌شن.
 *  - در صفحات بزرگ: یک اینپوت این‌لاین + یک پنل نتایج (dropdown) که خودش
 *    تشخیص می‌ده فضای پایین کافیه یا نه و بر همون اساس بالا/پایین باز می‌شه.
 *  - در صفحات کوچیک: فقط یک دکمه‌ی آیکون سرچ نمایش داده می‌شه که با کلیک،
 *    یک مودال تمام‌صفحه (اینپوت + جدول نتایج) باز می‌کنه.
 * ---------------------------------------------------------------------------
 */

export interface SearchColumn<T> {
  /** کلید یکتا برای این ستون */
  key: string;
  /** عنوان ستون که در هدر جدول نتایج نمایش داده می‌شه */
  header: string;
  /** مقدار متنی این ستون برای آیتم؛ هم برای جستجو و هم برای نمایش/هایلایت استفاده می‌شه */
  accessor: (item: T) => string;
  /** کلاس اختیاری برای سلول این ستون (مثلاً برای عرض یا تراز) */
  className?: string;
}

export interface SearchBarProps<T> {
  /** آرایه‌ی دیتایی که باید در اون جستجو انجام بشه */
  data: T[];
  /** ستون‌هایی که هم مبنای جستجو هستن و هم در جدول نتایج نمایش داده می‌شن */
  columns: SearchColumn<T>[];
  /** استخراج یک کلید یکتا از هر آیتم (برای key ری‌اکت و انتخاب) */
  getKey: (item: T) => string | number;
  /** وقتی کاربر روی یک ردیف نتیجه کلیک می‌کنه */
  onSelect?: (item: T) => void;
  /** placeholder اینپوت جستجو */
  placeholder?: string;
  /** متنی که وقتی نتیجه‌ای پیدا نشه نمایش داده می‌شه */
  noResultsText?: string;
  /** حداکثر تعداد نتایجی که نمایش داده می‌شه */
  maxResults?: number;
  /** aria-label دکمه‌ی حالت موبایل */
  mobileButtonLabel?: string;
  className?: string;
}

type MatchPart = { text: string; matched: boolean };

// یکسان‌سازی چند کاراکتر عربی/فارسی رایج، تا جستجو فارغ از این تفاوت‌ها کار کنه
function normalize(value: string): string {
  return value
    .replace(/[يى]/g, "ی")
    .replace(/ك/g, "ک")
    .replace(/[\u200c\u200f\u200e]/g, "")
    .trim()
    .toLowerCase();
}

// عبارت متن رو بر اساس query به بخش‌های matched/unmatched می‌شکنه (case-insensitive)
function splitMatches(text: string, query: string): MatchPart[] {
  if (!query) return [{ text, matched: false }];

  const normalizedText = normalize(text);
  const normalizedQuery = normalize(query);
  if (!normalizedQuery) return [{ text, matched: false }];

  const parts: MatchPart[] = [];
  let cursor = 0;

  while (cursor < text.length) {
    const idx = normalizedText.indexOf(normalizedQuery, cursor);
    if (idx === -1) {
      parts.push({ text: text.slice(cursor), matched: false });
      break;
    }
    if (idx > cursor) {
      parts.push({ text: text.slice(cursor, idx), matched: false });
    }
    const end = idx + normalizedQuery.length;
    parts.push({ text: text.slice(idx, end), matched: true });
    cursor = end;
  }

  return parts;
}

function Highlighted({
  text,
  query,
}: {
  text: string;
  query: string;
}): ReactNode {
  const parts = splitMatches(text, query);
  return (
    <>
      {parts.map((part, i) =>
        part.matched ? (
          <mark
            key={i}
            className="rounded-sm bg-(--primary)/20 text-(--primary) [text-decoration:none]"
          >
            {part.text}
          </mark>
        ) : (
          <span key={i}>{part.text}</span>
        ),
      )}
    </>
  );
}

function useFilteredResults<T>(
  data: T[],
  columns: SearchColumn<T>[],
  query: string,
  maxResults: number,
) {
  return useMemo(() => {
    const q = normalize(query);
    if (!q) return [];

    const matches = data.filter((item) =>
      columns.some((col) => normalize(col.accessor(item)).includes(q)),
    );

    return matches.slice(0, maxResults);
  }, [data, columns, query, maxResults]);
}

// جدول نتایج مشترک بین حالت دراپ‌داون و حالت مودال
function ResultsTable<T>({
  results,
  columns,
  query,
  getKey,
  onSelectItem,
  activeIndex,
  noResultsText,
}: {
  results: T[];
  columns: SearchColumn<T>[];
  query: string;
  getKey: (item: T) => string | number;
  onSelectItem: (item: T) => void;
  activeIndex: number;
  noResultsText: string;
}) {
  if (query && results.length === 0) {
    return (
      <div className="px-4 py-6 text-center text-[13.5px] text-(--muted-foreground)">
        {noResultsText}
      </div>
    );
  }

  if (results.length === 0) return null;

  return (
    <table className="w-full border-collapse text-[13.5px]">
      <thead>
        <tr className="border-b border-(--muted)">
          {columns.map((col) => (
            <th
              key={col.key}
              className={`px-3 py-2 text-right font-medium text-(--muted-foreground) ${col.className ?? ""}`}
            >
              {col.header}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {results.map((item, rowIndex) => (
          <tr
            key={getKey(item)}
            role="option"
            aria-selected={rowIndex === activeIndex}
            onClick={() => onSelectItem(item)}
            className={`cursor-pointer border-b border-(--muted) last:border-b-0 transition-colors ${
              rowIndex === activeIndex
                ? "bg-(--muted)"
                : "hover:bg-(--muted)/60"
            }`}
          >
            {columns.map((col) => (
              <td
                key={col.key}
                className={`px-3 py-2 text-(--foreground) ${col.className ?? ""}`}
              >
                <Highlighted text={col.accessor(item)} query={query} />
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
}

export default function SearchBar<T>({
  data,
  columns,
  getKey,
  onSelect,
  placeholder,
  noResultsText,
  mobileButtonLabel,
  maxResults = 8,
  className = "",
}: SearchBarProps<T>) {
  const [query, setQuery] = useState("");
  const [isDesktopOpen, setIsDesktopOpen] = useState(false);
  const [isMobileModalOpen, setIsMobileModalOpen] = useState(false);
  const [dropDirection, setDropDirection] = useState<"down" | "up">("down");
  const [activeIndex, setActiveIndex] = useState(-1);

  const { searchBar } = useDictionary();
  placeholder = searchBar.placeholder;
  noResultsText = searchBar.noResultsText;
  mobileButtonLabel = searchBar.mobileButtonLabel;

  const containerRef = useRef<HTMLDivElement>(null);
  const desktopInputRef = useRef<HTMLInputElement>(null);
  const modalInputRef = useRef<HTMLInputElement>(null);

  const results = useFilteredResults(data, columns, query, maxResults);

  // بستن دراپ‌داون دسکتاپ با کلیک بیرون از کامپوننت
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
        setIsDesktopOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // تشخیص فضای بالا/پایین برای تصمیم جهت باز شدن پنل نتایج
  useEffect(() => {
    if (!isDesktopOpen || !containerRef.current) return;

    const decideDirection = () => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const estimatedPanelHeight = 320;
      const spaceBelow = window.innerHeight - rect.bottom;
      const spaceAbove = rect.top;

      if (spaceBelow < estimatedPanelHeight && spaceAbove > spaceBelow) {
        setDropDirection("up");
      } else {
        setDropDirection("down");
      }
    };

    decideDirection();
    window.addEventListener("resize", decideDirection);
    window.addEventListener("scroll", decideDirection, true);
    return () => {
      window.removeEventListener("resize", decideDirection);
      window.removeEventListener("scroll", decideDirection, true);
    };
  }, [isDesktopOpen, results.length]);

  useEffect(() => {
    setActiveIndex(-1);
  }, [query]);

  useEffect(() => {
    if (isMobileModalOpen) {
      modalInputRef.current?.focus();
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isMobileModalOpen]);

  const handleSelect = (item: T) => {
    onSelect?.(item);
    setQuery("");
    setIsDesktopOpen(false);
    setIsMobileModalOpen(false);
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Escape") {
      setIsDesktopOpen(false);
      setIsMobileModalOpen(false);
      return;
    }
    if (results.length === 0) return;

    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActiveIndex((prev) => (prev + 1) % results.length);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveIndex((prev) => (prev - 1 + results.length) % results.length);
    } else if (e.key === "Enter" && activeIndex >= 0) {
      e.preventDefault();
      handleSelect(results[activeIndex]);
    }
  };

  return (
    <>
      {/* ---------- حالت دسکتاپ/تبلت: اینپوت این‌لاین + دراپ‌داون ---------- */}
      <div
        ref={containerRef}
        className={`relative hidden sm:block ${className}`}
      >
        <div className="flex items-center overflow-hidden rounded-lg bg-(--muted)">
          <Search
            size={16}
            strokeWidth={1.8}
            className="mx-2.5 shrink-0 text-(--muted-foreground)"
          />
          <input
            ref={desktopInputRef}
            type="text"
            role="combobox"
            aria-expanded={isDesktopOpen}
            aria-haspopup="listbox"
            placeholder={placeholder}
            value={query}
            onFocus={() => setIsDesktopOpen(true)}
            onChange={(e) => {
              setQuery(e.target.value);
              setIsDesktopOpen(true);
            }}
            onKeyDown={handleKeyDown}
            className="min-w-0 flex-1 border-none bg-transparent py-2 pl-3 pr-0 text-[13.5px] text-(--foreground) outline-none placeholder:text-(--muted-foreground)"
          />
          {query && (
            <button
              type="button"
              onClick={() => {
                setQuery("");
                desktopInputRef.current?.focus();
              }}
              className="mx-1.5 shrink-0 rounded p-1 text-(--muted-foreground) hover:bg-(--background)"
              aria-label="پاک کردن"
            >
              <X size={14} strokeWidth={2} />
            </button>
          )}
        </div>

        {isDesktopOpen && query && (
          <div
            role="listbox"
            className={`absolute z-50 max-h-80 w-[min(28rem,90vw)] overflow-auto rounded-lg border border-(--muted) bg-(--background) shadow-(--shadow-header) ${
              dropDirection === "down" ? "top-full mt-2" : "bottom-full mb-2"
            } ${className.includes("left") ? "left-0" : "right-0"}`}
          >
            <ResultsTable
              results={results}
              columns={columns}
              query={query}
              getKey={getKey}
              onSelectItem={handleSelect}
              activeIndex={activeIndex}
              noResultsText={noResultsText}
            />
          </div>
        )}
      </div>

      {/* ---------- حالت موبایل: دکمه‌ی آیکون ---------- */}
      <button
        type="button"
        onClick={() => setIsMobileModalOpen(true)}
        className="rounded-lg p-1.5 text-(--primary) hover:bg-(--muted) sm:hidden"
        aria-label={mobileButtonLabel}
      >
        <Search size={20} strokeWidth={1.8} />
      </button>

      {/* ---------- مودال موبایل: اینپوت + جدول نتایج ---------- */}
      {isMobileModalOpen && (
        <div className="fixed inset-0 z-100 flex flex-col bg-black/40 sm:hidden">
          <div className="flex max-h-[85vh] flex-col rounded-b-xl bg-(--background) shadow-(--shadow-header)">
            <div className="flex items-center gap-2 border-b border-(--muted) p-3">
              <Search
                size={18}
                strokeWidth={1.8}
                className="shrink-0 text-(--muted-foreground)"
              />
              <input
                ref={modalInputRef}
                type="text"
                placeholder={placeholder}
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={handleKeyDown}
                className="min-w-0 flex-1 border-none bg-transparent text-[14.5px] text-(--foreground) outline-none placeholder:text-(--muted-foreground)"
              />
              <button
                type="button"
                onClick={() => {
                  setIsMobileModalOpen(false);
                  setQuery("");
                }}
                className="shrink-0 rounded-lg p-1.5 text-(--muted-foreground) hover:bg-(--muted)"
                aria-label="بستن"
              >
                <X size={18} strokeWidth={2} />
              </button>
            </div>

            <div className="flex-1 overflow-auto">
              {query ? (
                <ResultsTable
                  results={results}
                  columns={columns}
                  query={query}
                  getKey={getKey}
                  onSelectItem={handleSelect}
                  activeIndex={activeIndex}
                  noResultsText={noResultsText}
                />
              ) : (
                <div className="px-4 py-8 text-center text-[13.5px] text-(--muted-foreground)">
                  برای جستجو شروع به تایپ کنید
                </div>
              )}
            </div>
          </div>
          {/* بک‌دراپ: کلیک روی فضای خالی مودال رو می‌بنده */}
          <div
            className="flex-1"
            onClick={() => setIsMobileModalOpen(false)}
            aria-hidden="true"
          />
        </div>
      )}
    </>
  );
}
