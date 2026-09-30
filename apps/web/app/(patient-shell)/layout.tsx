import { AppShell } from "@/components/shell/app-shell";

export default function PatientShellLayout({ children }: { children: React.ReactNode }) {
  return <AppShell role="patient">{children}</AppShell>;
}
