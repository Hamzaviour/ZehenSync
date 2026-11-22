/* eslint-disable @next/next/no-img-element */
import Link from "next/link";

export function Lockup({ variant = "light", className = "h-6 w-auto" }: { variant?: "light" | "dark"; className?: string }) {
  return (
    <img src={variant === "light" ? "/brand/zehensync-lockup.svg" : "/brand/zehensync-lockup-reversed.svg"}
      alt="ZehenSync" className={className} />
  );
}

/** Single-colour mark for focus screens, so the page carries no saffron point of its own. */
export function MarkMono({ className = "size-6" }: { className?: string }) {
  return (
    <svg viewBox="10 10 44 44" className={className} aria-label="ZehenSync" role="img" fill="currentColor">
      <path d="M43 15 L54 10 L54 51 Q54 54 51 54 L10 54 L15 43 L43 43 Z" />
      <path d="M26 19.5 L32.5 26 L26 32.5 L19.5 26 Z" />
    </svg>
  );
}

export function PrototypeLink() {
  return <Link href="/" className="text-[13px] text-muted underline-offset-4 hover:text-ink hover:underline">All screens</Link>;
}
