"use client";

import { DynamicIcon } from "lucide-react/dynamic";
import type { LucideProps } from "lucide-react";

interface IconProps extends LucideProps {
  name: string;
}

export function Icon({ name, ...props }: IconProps) {
  return <DynamicIcon name={name as any} {...props} />;
}