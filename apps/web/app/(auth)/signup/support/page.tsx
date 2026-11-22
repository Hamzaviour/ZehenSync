import Link from "next/link";
import { AuthPage } from "@/components/auth-page";
import { ButtonLink } from "@/components/ui/button";
import { Field, Input } from "@/components/ui/form";

export const metadata = { title: "Create your account" };

export default function SupportSignup() {
  return (
    <AuthPage title="Create your account" sub="Four details. We ask for your birth year only to check that you are 18 or older.">
      <form className="flex flex-col gap-5" action="#">
        <Field label="Name" htmlFor="name" hint="What should we call you?"><Input id="name" autoComplete="given-name" defaultValue="Sana" /></Field>
        <Field label="Email" htmlFor="email"><Input id="email" type="email" autoComplete="email" defaultValue="sana@example.com" /></Field>
        <Field label="Password" htmlFor="password" hint="At least 12 characters."><Input id="password" type="password" autoComplete="new-password" defaultValue="demo-password-1" /></Field>
        <Field label="Birth year" htmlFor="birth"><Input id="birth" inputMode="numeric" maxLength={4} defaultValue="1999" className="w-32 font-mono" /></Field>
        <ButtonLink href="/onboarding/consents" size="lg">Create account</ButtonLink>
      </form>
      <p className="text-sm text-ink-2">
        Under 18? <Link href="/under-18" className="text-accent underline underline-offset-4">See what happens next</Link>.
      </p>
    </AuthPage>
  );
}
