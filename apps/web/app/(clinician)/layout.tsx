import { AppShell } from "@/components/shell/app-shell";

export default function ClinicianLayout({ children }: { children: React.ReactNode }) {
  return <AppShell role="clinician">{children}</AppShell>;
}
