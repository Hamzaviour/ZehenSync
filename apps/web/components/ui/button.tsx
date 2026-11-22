import Link from "next/link";
import { cn } from "@/lib/cn";

type Look = { variant?: "primary" | "secondary" | "quiet"; size?: "md" | "lg"; className?: string };

export function buttonClass({ variant = "primary", size = "md", className }: Look) {
  return cn(
    "inline-flex items-center justify-center gap-2 rounded-md font-medium transition-colors duration-[120ms]",
    size === "md" ? "h-10 px-4 text-[15px]" : "h-12 px-5 text-base",
    variant === "primary" && "bg-accent text-on-accent hover:bg-accent-hover",
    variant === "secondary" && "border border-line-strong bg-surface text-ink hover:bg-sunken",
    variant === "quiet" && "text-accent underline-offset-4 hover:underline",
    className,
  );
}

export function Button({ variant, size, className, ...rest }: Look & React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return <button type="button" className={buttonClass({ variant, size, className })} {...rest} />;
}

/** Navigates between prototype screens. Every static "action" is a link. */
export function ButtonLink({ variant, size, className, href, ...rest }:
  Look & { href: string } & Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>, "href">) {
  return <Link href={href} className={buttonClass({ variant, size, className })} {...rest} />;
}
