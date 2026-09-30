import { PageHeader } from "@/components/shell/app-shell";
import { DemoTag } from "@/components/ui/tags";

export const metadata = { title: "Health" };

const services = [
  ["API", "Running", "38 ms median"], ["Database", "Running", "12 ms median"], ["Job queue", "Running", "0 waiting"],
  ["Language model provider", "Running", "1.4 s median"], ["Embeddings worker", "Idle", "0 waiting"],
];

export default function Health() {
  return (
    <div className="flex max-w-[880px] flex-col gap-6 px-6 py-8">
      <PageHeader title="Health" sub="Checked every minute." actions={<DemoTag />} />
      <ul className="flex flex-col divide-y divide-line rounded-lg border border-line">
        {services.map(([n, s, d]) => (
          <li key={n} className="flex items-center justify-between px-5 py-4">
            <span className="text-lg">{n}</span>
            <span className="flex items-center gap-6 text-[14px]"><span className="font-mono text-muted">{d}</span><span className="flex items-center gap-2 text-steady"><span aria-hidden>○</span>{s}</span></span>
          </li>
        ))}
      </ul>
    </div>
  );
}
