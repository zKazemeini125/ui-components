"use client";

import React from "react";
import { useLocale } from "@/lib/i18n-client";
import { localizeDigits } from "@/lib/numerals";

// تگ‌هایی که نباید محتواشون دستکاری بشه (چون مقدار واقعی/کد هستن، نه متن نمایشی)
const SKIP_TAGS = new Set(["input", "textarea", "script", "style", "code", "pre"]);

function transformNode(node: React.ReactNode, locale: string): React.ReactNode {
  if (typeof node === "string" || typeof node === "number") {
    return localizeDigits(node, locale);
  }

  if (Array.isArray(node)) {
    return node.map((child, i) => (
      <React.Fragment key={i}>{transformNode(child, locale)}</React.Fragment>
    ));
  }

  if (React.isValidElement(node)) {
    if (typeof node.type === "string" && SKIP_TAGS.has(node.type)) {
      return node;
    }

    const props = node.props as { children?: React.ReactNode };
    if (props.children === undefined) return node;

    return React.cloneElement(
      node as React.ReactElement<{ children?: React.ReactNode }>,
      undefined,
      transformNode(props.children, locale)
    );
  }

  return node;
}

export default function LocalizedNumbers({ children }: { children: React.ReactNode }) {
  const locale = useLocale();
  return <>{transformNode(children, locale)}</>;
}
