import { AuthPage } from "@/components/auth-page";
import { ButtonLink } from "@/components/ui/button";
import { Field, Input } from "@/components/ui/form";

export const metadata = { title: "Psychologist application" };

export default function ClinicianSignup() {
  return (
    <AuthPage title="Apply as a psychologist" sub="An admin checks your licence before you can see any linked person's data. This usually takes one to two working days.">
      <form className="flex flex-col gap-5" action="#">
        <Field label="Full name" htmlFor="name"><Input id="name" defaultValue="Dr. Ahmed Khan" /></Field>
        <Field label="Email" htmlFor="email"><Input id="email" type="email" autoComplete="email" defaultValue="a.khan@clinic.example" /></Field>
        <Field label="Password" htmlFor="password" hint="At least 12 characters."><Input id="password" type="password" autoComplete="new-password" defaultValue="demo-password-1" /></Field>
        <div className="grid grid-cols-2 gap-4">
          <Field label="Licence number" htmlFor="licence"><Input id="licence" defaultValue="PAC-LHR-10442" className="font-mono" /></Field>
          <Field label="Birth year" htmlFor="birth"><Input id="birth" inputMode="numeric" maxLength={4} defaultValue="1985" className="font-mono" /></Field>
        </div>
        <Field label="Institution or clinic" htmlFor="institution"><Input id="institution" defaultValue="Fountain House Clinic, Lahore" /></Field>
        <Field label="Proof of licence" htmlFor="proof" hint="PDF, JPG or PNG, up to 5 MB.">
          <input id="proof" type="file" accept=".pdf,.jpg,.jpeg,.png" className="block w-full rounded-md border border-dashed border-line-strong bg-sunken px-3 py-3 text-sm file:mr-4 file:rounded-md file:border-0 file:bg-accent file:px-3 file:py-1.5 file:text-on-accent" />
        </Field>
        <ButtonLink href="/pending" size="lg">Send application</ButtonLink>
      </form>
    </AuthPage>
  );
}
