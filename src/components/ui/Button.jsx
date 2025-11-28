"use client";

import React from "react";
import { cn } from "@/lib/utils";

const variants = {
  default:
    "inline-flex items-center gap-2 rounded-md border border-neutral-300 bg-neutral-100 px-4 py-2 text-sm font-semibold text-neutral-600 transition duration-200 transform hover:-translate-y-1 hover:shadow-md disabled:opacity-60 disabled:cursor-not-allowed disabled:translate-y-0 disabled:shadow-none",
  fancy: cn(
    "relative inline-flex items-center gap-2 rounded-md border border-white/10 bg-[#0d0f16] px-4 py-2 text-sm font-semibold text-slate-200",
    "shadow-[0_10px_18px_rgba(0,0,0,0.25),inset_0_1px_0_rgba(255,255,255,0.08)]",
    "transition duration-200 transform hover:-translate-y-0.5 hover:shadow-[0_14px_30px_rgba(0,0,0,0.45),inset_0_1px_0_rgba(255,255,255,0.08)] hover:border-[rgba(56,189,248,0.35)]",
    "before:absolute before:inset-[-2px] before:rounded-[inherit] before:bg-[radial-gradient(75%_100%_at_50%_0%,rgba(56,189,248,0.55)_0%,rgba(56,189,248,0)_75%)] before:opacity-0 before:transition-opacity before:duration-400 hover:before:opacity-100",
    "after:absolute after:left-3 after:right-3 after:bottom-[-1px] after:h-[2px] after:bg-[linear-gradient(90deg,rgba(16,185,129,0),rgba(16,185,129,0.85),rgba(16,185,129,0))] after:opacity-0 hover:after:opacity-100",
    "disabled:opacity-60 disabled:cursor-not-allowed disabled:transform-none disabled:shadow-none"
  ),
};

export function Button({ variant = "default", className, as: Tag = "button", ...props }) {
  return <Tag className={cn(variants[variant] ?? variants.default, className)} {...props} />;
}
