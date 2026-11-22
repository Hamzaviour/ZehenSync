import Link from "next/link";
import { PageHeader, PatientColumn } from "@/components/shell/app-shell";
import { DemoTag } from "@/components/ui/tags";

export const metadata = { title: "My history" };

const points = [
  { date: "3 Nov", score: 5 }, { date: "11 Nov", score: 4 }, { date: "20 Nov", score: 12 },
];
const stripes: [number, number][] = [[0, 4], [5, 9], [10, 14], [15, 19], [20, 27]];
const W = 620, H = 220, PAD = 36, max = 27;
const x = (i: number) => PAD + (i * (W - PAD * 2)) / (points.length - 1);
const y = (s: number) => H - PAD - (s / max) * (H - PAD * 2);

export default function History() {
  return (
    <PatientColumn>
      <PageHeader title="My history" sub="Each point is one completed check-in. Higher means more low mood." actions={<DemoTag />} />
      <figure className="rounded-lg border border-line p-4">
        <svg viewBox={`0 0 ${W} ${H}`} className="w-full" role="img" aria-label="Low mood check-in scores: 5 on 3 Nov, 4 on 11 Nov, 12 on 20 Nov">
          {stripes.map(([lo, hi], i) => (
            <rect key={i} x={PAD} width={W - PAD * 2} y={y(hi + 1)} height={y(lo) - y(hi + 1)}
              className={i % 2 ? "fill-sunken" : "fill-transparent"} />
          ))}
          <polyline fill="none" strokeWidth="2" className="stroke-accent"
            points={points.map((p, i) => `${x(i)},${y(p.score)}`).join(" ")} />
          {points.map((p, i) => (
            <g key={p.date}>
              <circle cx={x(i)} cy={y(p.score)} r="5" className="fill-accent" />
              <text x={x(i)} y={y(p.score) - 12} textAnchor="middle" className="fill-ink font-mono text-[12px]">{p.score}</text>
              <text x={x(i)} y={H - 10} textAnchor="middle" className="fill-muted font-mono text-[12px]">{p.date}</text>
            </g>
          ))}
        </svg>
      </figure>
      <section className="flex flex-col gap-3">
        <h2 className="text-sm font-medium text-muted">Sessions</h2>
        <ul className="flex flex-col divide-y divide-line rounded-lg border border-line">
          {[...points].reverse().map((p) => (
            <li key={p.date}>
              <Link href="/check-in/demo/result" className="flex items-center justify-between px-5 py-4 hover:bg-sunken">
                <span className="flex flex-col"><span className="text-lg">Low mood check-in</span><span className="text-sm text-muted">{p.date} 2026</span></span>
                <span className="font-mono text-base tnum">Score {p.score} of 27</span>
              </Link>
            </li>
          ))}
        </ul>
      </section>
    </PatientColumn>
  );
}
