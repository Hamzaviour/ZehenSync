import { AuthPage } from "@/components/auth-page";
import { ButtonLink } from "@/components/ui/button";
import { Alert } from "@/components/ui/alert";

export const metadata = { title: "Application received" };

export default function Pending() {
  return (
    <AuthPage title="Your application is with an admin" sub="We check your licence number and proof against the register. You will get an email when it is done.">
      <Alert>Until then you cannot see any patient data. Nothing else on your account is locked.</Alert>
      <dl className="grid grid-cols-[140px_1fr] gap-y-3 text-base">
        <dt className="text-muted">Sent</dt><dd className="font-mono">29 Nov 2026, 10:12</dd>
        <dt className="text-muted">Licence</dt><dd className="font-mono">PAC-LHR-10442</dd>
        <dt className="text-muted">Proof</dt><dd>licence-scan.pdf</dd>
        <dt className="text-muted">Status</dt><dd>Waiting for review</dd>
      </dl>
      <div className="flex gap-3">
        <ButtonLink href="/setup-2fa" size="lg">Preview: after approval</ButtonLink>
        <ButtonLink href="/login" variant="secondary" size="lg">Log out</ButtonLink>
      </div>
    </AuthPage>
  );
}
