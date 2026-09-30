import { AuthPage } from "@/components/auth-page";
import { ButtonLink } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/form";

export const metadata = { title: "Before you start" };

export default function Consents() {
  return (
    <AuthPage title="Before you start" sub="Three things to read and accept. You can review each one later in Settings.">
      <div className="flex flex-col gap-6 rounded-lg border border-line p-6">
        <Checkbox id="terms" defaultChecked label="Terms of use"
          description="How you may use ZehenSync and how we handle your account. Version 1.0." />
        <Checkbox id="disclaimer" defaultChecked label="ZehenSync screens; it does not diagnose"
          description="Results describe how you have been feeling. They are not a diagnosis, and they do not replace a psychologist." />
        <Checkbox id="ai" defaultChecked label="AI processing of your messages"
          description="An AI model reads what you type to talk with you and to reword questions. Names, phone numbers and ID numbers are removed first." />
      </div>
      <ButtonLink href="/intake/why" size="lg">Accept and continue</ButtonLink>
      <p className="text-sm text-ink-2">Students and researchers accept the terms and AI processing, then go straight to their home page.</p>
    </AuthPage>
  );
}
