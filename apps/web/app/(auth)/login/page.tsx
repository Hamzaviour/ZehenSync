import Link from "next/link";
import { AuthPage } from "@/components/auth-page";
import { ButtonLink } from "@/components/ui/button";
import { Field, Input } from "@/components/ui/form";

export const metadata = { title: "Log in" };

export default function Login() {
  return (
    <AuthPage title="Log in" sub="Welcome back.">
      <form className="flex flex-col gap-5" action="#">
        <Field label="Email" htmlFor="email"><Input id="email" type="email" autoComplete="email" defaultValue="sana@example.com" /></Field>
        <Field label="Password" htmlFor="password"><Input id="password" type="password" autoComplete="current-password" defaultValue="demo-password" /></Field>
        <ButtonLink href="/home" size="lg">Log in</ButtonLink>
      </form>
      <div className="flex flex-col gap-2 text-sm text-ink-2">
        <p>New here? <Link href="/signup" className="text-accent underline underline-offset-4">Create an account</Link></p>
        <p>Psychologists and admins continue to <Link href="/login/verify" className="text-accent underline underline-offset-4">two-step verification</Link> after this step.</p>
      </div>
    </AuthPage>
  );
}
