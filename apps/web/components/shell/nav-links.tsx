"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/cn";
import { nav, type Role } from "./nav";

export function NavLinks({ role }: { role: Role }) {
  const path = usePathname();
  return (
    <nav aria-label="Main" className="flex flex-col gap-0.5">
      {nav[role].map(({ href, label, icon: Icon, match, exact }) => {
        const active = (match ?? [href]).some((m) => path === m || (!exact && path.startsWith(m + "/")));
        return (
          <Link key={href} href={href} aria-current={active ? "page" : undefined}
            className={cn("flex h-10 items-center gap-3 rounded-md px-3 text-[15px]",
              active ? "bg-accent-selected font-medium text-accent" : "text-ink-2 hover:bg-sunken hover:text-ink")}>
            <Icon />{label}
          </Link>
        );
      })}
    </nav>
  );
}
