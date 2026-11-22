import { AppShell } from "@/components/shell/app-shell";

export default function ScholarLayout({ children }: { children: React.ReactNode }) {
  return <AppShell role="scholar">{children}</AppShell>;
}
