import { AuthPage } from "@/components/auth-page";
import { ButtonLink } from "@/components/ui/button";
import { Field, Input } from "@/components/ui/form";

export const metadata = { title: "Two-step verification" };

export default function Verify() {
  return (
    <AuthPage title="Enter your 6-digit code" sub="Open your authenticator app and type the code for ZehenSync.">
      <form className="flex flex-col gap-5" action="#">
        <Field label="Code" htmlFor="code" hint="The code changes every 30 seconds.">
          <Input id="code" inputMode="numeric" autoComplete="one-time-code" maxLength={6} defaultValue="428913" className="font-mono text-xl tracking-widest" />
        </Field>
        <ButtonLink href="/clinician/queue" size="lg">Verify and continue</ButtonLink>
      </form>
      <p className="text-sm text-ink-2">Lost your device? Ask an admin to reset two-step verification for your account.</p>
    </AuthPage>
  );
}
