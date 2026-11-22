import { PageHeader, PatientColumn } from "@/components/shell/app-shell";
import { SharingPanel } from "@/components/islands/patient";

export const metadata = { title: "Sharing" };

export default function Sharing() {
  return (
    <PatientColumn>
      <PageHeader title="Sharing" sub="A psychologist sees only what you choose, and you can stop at any time." />
      <SharingPanel />
    </PatientColumn>
  );
}
