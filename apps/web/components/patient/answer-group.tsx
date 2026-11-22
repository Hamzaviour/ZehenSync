"use client";
import { useEffect, useState } from "react";
import { AnswerOption } from "./parts";

/** Single choice with keyboard keys 1 to n, as the check-in runner specifies (Design-System §4.2). */
export function AnswerGroup({ options, initial }: { options: string[]; initial?: number }) {
  const [sel, setSel] = useState<number | undefined>(initial);
  useEffect(() => {
    const on = (e: KeyboardEvent) => {
      const t = e.target as HTMLElement;
      if (t.tagName === "TEXTAREA" || t.tagName === "INPUT") return;
      const n = Number(e.key);
      if (n >= 1 && n <= options.length) setSel(n - 1);
    };
    window.addEventListener("keydown", on);
    return () => window.removeEventListener("keydown", on);
  }, [options.length]);
  return (
    <div role="radiogroup" className="flex flex-col gap-3">
      {options.map((o, i) => <AnswerOption key={o} label={o} hint={i + 1} selected={sel === i} onSelect={() => setSel(i)} />)}
    </div>
  );
}
