import { AuthPage } from "@/components/auth-page";
import { ButtonLink } from "@/components/ui/button";
import { Field, Input, Select } from "@/components/ui/form";

export const metadata = { title: "Create your student account" };

export default function ScholarSignup() {
  return (
    <AuthPage title="Create your student account" sub="The tutor adjusts its depth to your level. You can change it any time.">
      <form className="flex flex-col gap-5" action="#">
        <Field label="Name" htmlFor="name"><Input id="name" autoComplete="given-name" defaultValue="Bilal" /></Field>
        <Field label="Email" htmlFor="email"><Input id="email" type="email" autoComplete="email" defaultValue="bilal@example.edu.pk" /></Field>
        <Field label="Password" htmlFor="password" hint="At least 12 characters."><Input id="password" type="password" autoComplete="new-password" defaultValue="demo-password-1" /></Field>
        <div className="grid grid-cols-2 gap-4">
          <Field label="Level" htmlFor="level">
            <Select id="level" defaultValue="intermediate">
              <option value="intro">Intro</option><option value="intermediate">Intermediate</option>
              <option value="advanced">Advanced</option><option value="research">Research</option>
            </Select>
          </Field>
          <Field label="Birth year" htmlFor="birth"><Input id="birth" inputMode="numeric" maxLength={4} defaultValue="2001" className="font-mono" /></Field>
        </div>
        <Field label="Institution" htmlFor="institution"><Input id="institution" defaultValue="University of Central Punjab" /></Field>
        <ButtonLink href="/onboarding/consents" size="lg">Create account</ButtonLink>
      </form>
    </AuthPage>
  );
}
