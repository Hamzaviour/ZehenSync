import { PageHeader } from "@/components/shell/app-shell";
import { DemoButton } from "@/components/ui/toast";
import { Field, Select } from "@/components/ui/form";

export const metadata = { title: "Profile" };

export default function ScholarProfile() {
  return (
    <div className="flex max-w-[720px] flex-col gap-8 px-6 py-10">
      <PageHeader title="Profile" sub="What the tutor has learned about you. You can change or clear all of it." />
      <section className="flex flex-col gap-4 rounded-lg border border-line p-6">
        <Field label="Level" htmlFor="level"><Select id="level" defaultValue="intermediate" className="w-56"><option value="intro">Intro</option><option value="intermediate">Intermediate</option><option value="advanced">Advanced</option><option value="research">Research</option></Select></Field>
      </section>
      <section className="flex flex-col gap-3 rounded-lg border border-line p-6">
        <h2 className="font-serif text-2xl">Topics you have asked about</h2>
        <ul className="list-disc space-y-1 pl-5 text-ink-2"><li>Depressive disorders</li><li>Risk assessment interviewing</li><li>Screening versus diagnosis</li></ul>
      </section>
      <div><DemoButton variant="secondary" toast="Profile cleared (demo)">Clear my profile</DemoButton></div>
    </div>
  );
}
