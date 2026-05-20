"use client";

import katex from "katex";
import { cn } from "@/lib/utils";

type MathFormulaProps = {
  value?: string;
  block?: boolean;
  className?: string;
};

export function MathFormula({ value, block = true, className }: MathFormulaProps) {
  if (!value) {
    return null;
  }

  const html = katex.renderToString(value, {
    throwOnError: false,
    displayMode: block,
    output: "html",
  });

  return (
    <div
      className={cn(
        "rounded-xl border border-blue-100 bg-blue-50/70 px-4 py-3 text-blue-950 dark:border-white/10 dark:bg-white/5 dark:text-blue-100",
        className,
      )}
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}
