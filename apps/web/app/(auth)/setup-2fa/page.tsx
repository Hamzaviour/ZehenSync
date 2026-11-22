import { AuthPage } from "@/components/auth-page";
import { ButtonLink } from "@/components/ui/button";
import { Field, Input } from "@/components/ui/form";

export const metadata = { title: "Set up two-step verification" };

export default function Setup2fa() {
  return (
    <AuthPage title="Set up two-step verification" sub="You were approved. Before you see any patient data, add a second step to your login.">
      <ol className="flex flex-col gap-6 text-base">
        <li className="flex flex-col gap-3">
          <span className="font-medium">1. Scan this with an authenticator app</span>
          <div className="flex items-center gap-5">
            <div className="grid size-40 place-items-center rounded-md border border-dashed border-line-strong bg-sunken text-center text-sm text-muted">QR code<br />appears here</div>
            <div className="flex flex-col gap-1 text-sm text-ink-2">
              <span>Or type this key:</span>
              <span className="font-mono text-base text-ink">JBSW Y3DP EHPK 3PXP</span>
            </div>
          </div>
        </li>
        <li className="flex flex-col gap-3">
          <Field label="2. Type the 6-digit code it shows" htmlFor="code">
            <Input id="code" inputMode="numeric" maxLength={6} defaultValue="428913" className="w-48 font-mono text-xl tracking-widest" />
          </Field>
        </li>
      </ol>
      <ButtonLink href="/clinician/queue" size="lg">Turn on and continue</ButtonLink>
    </AuthPage>
  );
}
