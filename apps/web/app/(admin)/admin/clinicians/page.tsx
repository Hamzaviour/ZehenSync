import { VerificationQueue } from "@/components/islands/admin";
import { PageHeader } from "@/components/shell/app-shell";

export const metadata = { title: "Clinicians" };

export default function Clinicians() {
  return (
    <div className="flex flex-col gap-6 px-6 py-8">
      <PageHeader title="Clinician verification" sub="Check each licence against the register before approving." />
      <VerificationQueue />
    </div>
  );
}
