# P1-B Web Foundation and CI Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** A Next.js app on the brand-v2 design system where a patient, a scholar and a clinician can each sign up through the role fork, accept their required consents and land in their own area; an admin can turn on two-step verification and approve a clinician; and every push runs API, web and end-to-end checks in CI.

**Architecture:** `apps/web` is a Next.js 16 App Router app. It talks only to the P1-A API through a same-origin rewrite (`/api/*` → FastAPI), so the refresh cookie (`Path=/api/v1/auth`, `SameSite=Strict`) works without CORS. The access token lives in memory (Zustand) and is refreshed from the cookie on load and shortly before expiry. Types come from the API's OpenAPI document via `openapi-typescript`; calls go through `openapi-fetch`. One pure function, `nextRoute(me, path)`, decides every redirect, so the routing rules are unit-testable. Design tokens live in `packages/tokens` and feed Tailwind 4's `@theme`.

**Tech Stack:** Next.js 16.3, React 19.3, TypeScript 5.9, Tailwind CSS 4.3, openapi-typescript 7.13 + openapi-fetch 0.17, Zustand 5, Zod 4 + react-hook-form 7 + @hookform/resolvers 5, qrcode 1.5, Vitest 5 + Testing Library 16 + jsdom, Playwright 1.63, pnpm 12 workspaces, GitHub Actions.

**Spec:** `docs/03-Design/App-Flow.md` §1, §2.1, §3 (help link), §4, §6; `docs/03-Design/Design-System.md`; `docs/04-Brand/Brand-Kit.md`; `docs/02-Engineering/TRD.md` §2–§4, §10; `docs/05-Planning/Tracker.md` T-1.10–T-1.14; P1-A plan (API contract it consumes).

## Global Constraints

- Desktop web; minimum supported width 1024 px (ADR-008). Pages must not break below it, but no mobile layouts are designed.
- Colours only through tokens from `packages/tokens/tokens.css` (brand v2). No raw hex in components (Rules › Design 1).
- Fonts: Newsreader (headings, questions), Schibsted Grotesk (UI), Geist Mono (data), loaded with `next/font/google`.
- Sentence case everywhere; buttons name the action ("Create account", "Accept and continue"); never "Submit" (Design-System §6).
- The word "patient" never appears in patient-facing copy (App-Flow §1).
- Psychologist signup is a small text link on the fork, not a card (App-Flow §1).
- Under-18 by birth year goes to `/under-18`; no account is created.
- Access token in memory only; never `localStorage`. The refresh cookie is handled only by the browser.
- Patient pages show "Get help now" in the top bar, linking to `/help`.
- Anti-slop checklist in Brand-Kit.md applies: no gradients, no emoji, one saffron point per screen.
- Every commit authored by Hamza Younas; message starts with the tracker ID. No AI attribution.

## Review Focus

1. **Refresh during parallel requests** — two API calls fire as the token expires; both must share one refresh, not rotate twice (the second rotation would trip reuse detection and log the user out). Pinned in Task 3 (`refreshSession shares one in-flight request`).
2. **Deep link while signed out** — opening `/settings/consents` signed out must go to `/login`, and a signed-in patient opening `/admin/clinicians` must land on `/home`, not a blank page. Pinned in Task 4 (`routes` table test).
3. **Consent revoke of a required consent** — revoking `ai_processing` in settings must send the person back through `/onboarding/consents` on the next navigation, not leave them in a half-state. Pinned in Task 4 (`missing consents win over everything but /help`) and exercised in Task 6.
4. **Proof file validation before upload** — a 7 MB scan or a `.docx` must be rejected in the form with a clear message before any network call. Pinned in Task 5 (`clinicianSchema rejects large and wrong-type files`).
5. **Birth year typed as text or a future year** — `"abc"` or `2030` must show a field error, never reach the API. Pinned in Task 5 (`signupSchema rejects bad birth years`).

---

## File Structure

```
packages/tokens/package.json, tokens.css, index.ts          design tokens (source of truth; docs copy mirrors it)
apps/web/
  package.json, next.config.ts, tsconfig.json, postcss.config.mjs, eslint.config.mjs
  vitest.config.ts, vitest.setup.ts, playwright.config.ts
  public/brand/*.svg                                          logo files (copied from docs/04-Brand/logo)
  app/layout.tsx, app/globals.css, app/page.tsx
  app/(auth)/layout.tsx
  app/(auth)/signup/page.tsx, signup/support/page.tsx, signup/scholar/page.tsx, signup/clinician/page.tsx
  app/(auth)/under-18/page.tsx, login/page.tsx, login/verify/page.tsx, onboarding/consents/page.tsx
  app/(app)/layout.tsx                                        guarded shell for every signed-in page
  app/(app)/home/page.tsx, scholar/page.tsx, clinician/pending/page.tsx, clinician/queue/page.tsx
  app/(app)/admin/clinicians/page.tsx, settings/consents/page.tsx, settings/security/page.tsx
  app/help/page.tsx                                           static crisis resources (full crisis layer is P3)
  components/ui/{button,input,field,checkbox,alert}.tsx
  components/icons.tsx, components/brand.tsx
  components/shell/{app-shell.tsx,nav.ts}
  components/auth/{signup-form.tsx,route-guard.tsx}
  lib/cn.ts, lib/consents.ts, lib/forms.ts
  lib/api/{schema.d.ts,client.ts,errors.ts}
  lib/auth/{store.ts,provider.tsx,routes.ts,jwt.ts}
  tests/unit/*.test.ts(x), tests/e2e/*.spec.ts, tests/e2e/{global-setup.ts,totp.ts,fixtures/licence.pdf}
.github/workflows/ci.yml
```

---

### Task 1: Tokens package, Next.js app, Tailwind theme, fonts, test runner (T-1.10)

**Files:**
- Create: `packages/tokens/package.json`, `packages/tokens/tokens.css` (copy of `docs/04-Brand/tokens.css`), `packages/tokens/index.ts`
- Create: `apps/web/package.json`, `apps/web/next.config.ts`, `apps/web/tsconfig.json`, `apps/web/postcss.config.mjs`, `apps/web/eslint.config.mjs`, `apps/web/vitest.config.ts`, `apps/web/vitest.setup.ts`, `apps/web/app/layout.tsx`, `apps/web/app/globals.css`, `apps/web/app/page.tsx`, `apps/web/lib/cn.ts`, `apps/web/public/brand/*.svg`
- Modify: `docs/04-Brand/tokens.css` (first line: `/* Mirror of packages/tokens/tokens.css — edit the package, then copy here. */`), `.gitignore` (`apps/web/.next/`, `node_modules/`, `apps/web/test-results/`, `apps/web/playwright-report/`)
- Test: `apps/web/tests/unit/tokens.test.ts`

**Interfaces:**
- Produces: Tailwind colour utilities `bg-bg`, `bg-surface`, `bg-sunken`, `border-line`, `border-line-strong`, `text-ink`, `text-ink-2`, `text-muted`, `bg-accent`, `text-accent`, `bg-accent-subtle`, `bg-accent-selected`, `text-on-accent`, `bg-nuqta`, `text-steady|watch|urgent|crisis`, `bg-steady-fill|…`; font utilities `font-serif`, `font-sans`, `font-mono`; `cn(...classes)`; `tokens` TS object (`tokens.neel700`, `tokens.saffron400`, …).

- [ ] **Step 1: Tokens package**

`packages/tokens/package.json`
```json
{
  "name": "@zehensync/tokens",
  "version": "2.0.0",
  "private": true,
  "type": "module",
  "exports": { ".": "./index.ts", "./tokens.css": "./tokens.css" }
}
```
`packages/tokens/tokens.css`: copy `docs/04-Brand/tokens.css` byte for byte.
`packages/tokens/index.ts`
```ts
export const tokens = {
  paper: "#FFFFFF", mist: "#F4F5F8", line: "#E3E5EC", slate: "#C5C9D6",
  graphite500: "#62677D", graphite700: "#454A60", ink: "#0E1233",
  neel50: "#F1F2FB", neel100: "#E3E6F7", neel300: "#9AA6F2", neel600: "#3441A8", neel700: "#26318A",
  saffron400: "#E3A33B", saffron700: "#8A5A0E", night: "#0B0E24", nightRaised: "#151A3A",
} as const;
export type TokenName = keyof typeof tokens;
```

- [ ] **Step 2: Web app package and config**

`apps/web/package.json`
```json
{
  "name": "@zehensync/web",
  "version": "0.2.0",
  "private": true,
  "scripts": {
    "dev": "next dev --port 3000",
    "build": "next build",
    "start": "next start --port 3000",
    "lint": "eslint .",
    "typecheck": "tsc --noEmit",
    "test": "vitest run",
    "e2e": "playwright test",
    "gen:api": "openapi-typescript http://localhost:8000/api/v1/openapi.json -o lib/api/schema.d.ts"
  },
  "dependencies": {
    "@hookform/resolvers": "^5.9.1",
    "@zehensync/tokens": "workspace:*",
    "clsx": "^2.1.1",
    "next": "16.3.6",
    "openapi-fetch": "^0.17.0",
    "qrcode": "^1.5.4",
    "react": "19.3.0",
    "react-dom": "19.3.0",
    "react-hook-form": "^7.89.0",
    "tailwind-merge": "^3.7.0",
    "zod": "^4.6.5",
    "zustand": "^5.0.15"
  },
  "devDependencies": {
    "@playwright/test": "^1.63.0",
    "@tailwindcss/postcss": "^4.3.3",
    "@testing-library/jest-dom": "^6.6.0",
    "@testing-library/react": "^16.3.3",
    "@testing-library/user-event": "^14.6.0",
    "@types/node": "^24.0.0",
    "@types/qrcode": "^1.5.5",
    "@types/react": "^19.0.0",
    "@types/react-dom": "^19.0.0",
    "@vitejs/plugin-react": "^6.1.1",
    "eslint": "^10.11.0",
    "eslint-config-next": "16.3.7",
    "jsdom": "^30.1.1",
    "openapi-typescript": "^7.13.0",
    "tailwindcss": "^4.3.3",
    "typescript": "5.9.3",
    "vitest": "^5.0.2"
  }
}
```
`apps/web/next.config.ts`
```ts
import type { NextConfig } from "next";

const API = process.env.API_ORIGIN ?? "http://localhost:8000";

const config: NextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  async rewrites() {
    return [{ source: "/api/:path*", destination: `${API}/api/:path*` }];
  },
  async headers() {
    return [{
      source: "/:path*",
      headers: [
        { key: "X-Frame-Options", value: "DENY" },
        { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
        { key: "X-Content-Type-Options", value: "nosniff" },
        { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
      ],
    }];
  },
};
export default config;
```
`apps/web/tsconfig.json`
```json
{
  "compilerOptions": {
    "target": "ES2022",
    "lib": ["dom", "dom.iterable", "es2023"],
    "strict": true,
    "noUncheckedIndexedAccess": true,
    "module": "esnext",
    "moduleResolution": "bundler",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "jsx": "preserve",
    "noEmit": true,
    "incremental": true,
    "skipLibCheck": true,
    "types": ["vitest/globals", "@testing-library/jest-dom"],
    "plugins": [{ "name": "next" }],
    "paths": { "@/*": ["./*"] }
  },
  "include": ["next-env.d.ts", "**/*.ts", "**/*.tsx", ".next/types/**/*.ts"],
  "exclude": ["node_modules"]
}
```
`apps/web/postcss.config.mjs`
```js
export default { plugins: { "@tailwindcss/postcss": {} } };
```
`apps/web/eslint.config.mjs`
```js
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

export default [
  ...nextVitals,
  ...nextTs,
  { ignores: [".next/**", "lib/api/schema.d.ts", "playwright-report/**", "test-results/**"] },
  { rules: { "no-restricted-syntax": ["error", { selector: "Literal[value=/^#[0-9a-fA-F]{3,8}$/]",
      message: "Use design tokens, not raw hex." }] } },
];
```
`apps/web/vitest.config.ts`
```ts
import react from "@vitejs/plugin-react";
import path from "node:path";
import { defineConfig } from "vitest/config";

export default defineConfig({
  plugins: [react()],
  resolve: { alias: { "@": path.resolve(__dirname) } },
  test: { environment: "jsdom", globals: true, setupFiles: ["./vitest.setup.ts"], include: ["tests/unit/**/*.test.{ts,tsx}"] },
});
```
`apps/web/vitest.setup.ts`
```ts
import "@testing-library/jest-dom/vitest";
```
Copy `docs/04-Brand/logo/zehensync-lockup.svg`, `zehensync-lockup-reversed.svg`, `zehensync-mark.svg`, `zehensync-app-icon.svg` into `apps/web/public/brand/`, and `zehensync-app-icon.svg` to `apps/web/app/icon.svg`.

- [ ] **Step 3: Write the failing test**

`apps/web/tests/unit/tokens.test.ts`
```ts
import { readFileSync } from "node:fs";
import path from "node:path";
import { tokens } from "@zehensync/tokens";

const css = readFileSync(path.resolve(__dirname, "../../../../packages/tokens/tokens.css"), "utf8");
const docs = readFileSync(path.resolve(__dirname, "../../../../docs/04-Brand/tokens.css"), "utf8");

describe("design tokens", () => {
  it("defines every semantic variable the app uses", () => {
    for (const v of ["--bg", "--surface", "--sunken", "--border", "--border-strong", "--text", "--text-secondary",
                     "--text-muted", "--accent", "--accent-hover", "--accent-subtle", "--accent-selected",
                     "--on-accent", "--nuqta", "--focus-ring"]) {
      expect(css).toContain(`${v}:`);
    }
  });
  it("matches the brand kit palette", () => {
    expect(css).toContain(`--zs-neel-700: ${tokens.neel700}`);
    expect(css).toContain(`--zs-saffron-400: ${tokens.saffron400}`);
  });
  it("keeps the docs copy in sync", () => {
    const strip = (s: string) => s.split("\n").filter((l) => !l.startsWith("/* Mirror")).join("\n").trim();
    expect(strip(docs)).toBe(strip(css));
  });
});
```

- [ ] **Step 4: Install and see it fail**

Run: `pnpm install && pnpm -C apps/web test`
Expected: FAIL until `packages/tokens/tokens.css` exists and matches (then passes once Step 1 files are in place; if you created them already, the docs-sync test fails until the mirror comment is added to the docs copy).

- [ ] **Step 5: App shell files**

`apps/web/app/globals.css`
```css
@import "tailwindcss";
@import "@zehensync/tokens/tokens.css";

@theme inline {
  --color-bg: var(--bg);
  --color-surface: var(--surface);
  --color-sunken: var(--sunken);
  --color-line: var(--border);
  --color-line-strong: var(--border-strong);
  --color-ink: var(--text);
  --color-ink-2: var(--text-secondary);
  --color-muted: var(--text-muted);
  --color-accent: var(--accent);
  --color-accent-hover: var(--accent-hover);
  --color-accent-subtle: var(--accent-subtle);
  --color-accent-selected: var(--accent-selected);
  --color-on-accent: var(--on-accent);
  --color-nuqta: var(--nuqta);
  --color-steady: var(--zs-steady-text);
  --color-steady-fill: var(--zs-steady-fill);
  --color-watch: var(--zs-watch-text);
  --color-watch-fill: var(--zs-watch-fill);
  --color-urgent: var(--zs-urgent-text);
  --color-urgent-fill: var(--zs-urgent-fill);
  --color-crisis: var(--zs-crisis-text);
  --color-crisis-fill: var(--zs-crisis-fill);
  --font-serif: var(--font-newsreader), Georgia, serif;
  --font-sans: var(--font-schibsted), system-ui, sans-serif;
  --font-mono: var(--font-geist-mono), ui-monospace, monospace;
  --radius-sm: 4px;
  --radius-md: 6px;
  --radius-lg: 10px;
}

html { background: var(--bg); color: var(--text); }
body { font-family: var(--font-sans); -webkit-font-smoothing: antialiased; min-width: 1024px; }
:focus-visible { outline: none; box-shadow: var(--focus-ring); }
@media (prefers-reduced-motion: reduce) { * { transition-duration: 1ms !important; animation-duration: 1ms !important; } }
```
`apps/web/lib/cn.ts`
```ts
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}
```
`apps/web/app/layout.tsx`
```tsx
import type { Metadata } from "next";
import { Geist_Mono, Newsreader, Schibsted_Grotesk } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/lib/auth/provider";

const serif = Newsreader({ subsets: ["latin"], variable: "--font-newsreader", style: ["normal", "italic"] });
const sans = Schibsted_Grotesk({ subsets: ["latin"], variable: "--font-schibsted" });
const mono = Geist_Mono({ subsets: ["latin"], variable: "--font-geist-mono" });

export const metadata: Metadata = { title: "ZehenSync", description: "Screening you can trace." };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${serif.variable} ${sans.variable} ${mono.variable}`}>
      <body className="bg-bg text-ink"><AuthProvider>{children}</AuthProvider></body>
    </html>
  );
}
```
`apps/web/app/page.tsx`
```tsx
"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth/store";
import { homeFor } from "@/lib/auth/routes";

export default function Index() {
  const router = useRouter();
  const { ready, me } = useAuth();
  useEffect(() => {
    if (ready) router.replace(me ? homeFor(me) : "/login");
  }, [ready, me, router]);
  return null;
}
```
(`AuthProvider`, `useAuth` and `homeFor` arrive in Tasks 3–4; until then the build fails, which is expected — Task 1 only has to pass `pnpm -C apps/web test`.)

- [ ] **Step 6: Run the test**

Run: `pnpm -C apps/web test`
Expected: `3 passed`.

- [ ] **Step 7: Commit**

```bash
git add packages/tokens apps/web docs/04-Brand/tokens.css .gitignore pnpm-lock.yaml
git commit -m "T-1.10 tokens package, Next.js 16 app, Tailwind 4 theme from brand tokens, vitest"
```

---

### Task 2: UI primitives and brand icons (T-1.11)

**Files:**
- Create: `apps/web/components/ui/button.tsx`, `input.tsx`, `field.tsx`, `checkbox.tsx`, `alert.tsx`, `apps/web/components/icons.tsx`, `apps/web/components/brand.tsx`
- Test: `apps/web/tests/unit/ui.test.tsx`

**Interfaces:**
- Produces: `<Button variant="primary"|"secondary"|"quiet" size="md"|"lg" loading?>`; `<Input invalid?>` (forwardRef); `<Field label hint? error? htmlFor>{control}</Field>`; `<Checkbox label description? {...inputProps}>` (forwardRef); `<Alert tone="info"|"error"|"success">`; `Icon` components `IconHome, IconCheckIn, IconCounselor, IconFlag, IconShield, IconCitation, IconPhone, IconHistory`; `<Lockup variant="light"|"dark" className>`.

- [ ] **Step 1: Write the failing test**

`apps/web/tests/unit/ui.test.tsx`
```tsx
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Button } from "@/components/ui/button";
import { Field } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";

describe("ui primitives", () => {
  it("button shows loading and blocks clicks", async () => {
    const onClick = vi.fn();
    render(<Button loading onClick={onClick}>Create account</Button>);
    const b = screen.getByRole("button", { name: /create account/i });
    expect(b).toBeDisabled();
    expect(b).toHaveAttribute("aria-busy", "true");
    await userEvent.click(b);
    expect(onClick).not.toHaveBeenCalled();
  });

  it("field links label and error to the control", () => {
    render(<Field label="Email" htmlFor="email" error="Enter a valid email."><Input id="email" invalid /></Field>);
    const input = screen.getByLabelText("Email");
    expect(input).toHaveAttribute("aria-invalid", "true");
    expect(input).toHaveAttribute("aria-describedby", "email-error");
    expect(screen.getByText("Enter a valid email.")).toHaveAttribute("id", "email-error");
  });

  it("checkbox is labelled and toggles", async () => {
    render(<Checkbox label="I agree" />);
    const cb = screen.getByRole("checkbox", { name: "I agree" });
    await userEvent.click(cb);
    expect(cb).toBeChecked();
  });
});
```

- [ ] **Step 2: Run to see it fail**

Run: `pnpm -C apps/web test tests/unit/ui.test.tsx`
Expected: FAIL, cannot resolve `@/components/ui/button`.

- [ ] **Step 3: Implement**

`apps/web/components/ui/button.tsx`
```tsx
import { forwardRef } from "react";
import { cn } from "@/lib/cn";

type Props = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "secondary" | "quiet";
  size?: "md" | "lg";
  loading?: boolean;
};

export const Button = forwardRef<HTMLButtonElement, Props>(function Button(
  { variant = "primary", size = "md", loading = false, disabled, className, children, ...rest }, ref) {
  return (
    <button
      ref={ref}
      disabled={disabled || loading}
      aria-busy={loading || undefined}
      className={cn(
        "inline-flex items-center justify-center gap-2 rounded-md font-medium transition-colors disabled:opacity-60",
        size === "md" ? "h-10 px-4 text-[15px]" : "h-12 px-5 text-base",
        variant === "primary" && "bg-accent text-on-accent hover:bg-accent-hover",
        variant === "secondary" && "border border-line-strong bg-surface text-ink hover:bg-sunken",
        variant === "quiet" && "text-accent underline-offset-4 hover:underline",
        className,
      )}
      {...rest}
    >
      {loading && <span className="size-3 rotate-45 bg-nuqta motion-safe:animate-pulse" aria-hidden />}
      {children}
    </button>
  );
});
```
`apps/web/components/ui/input.tsx`
```tsx
import { forwardRef } from "react";
import { cn } from "@/lib/cn";

type Props = React.InputHTMLAttributes<HTMLInputElement> & { invalid?: boolean };

export const Input = forwardRef<HTMLInputElement, Props>(function Input({ invalid, className, id, ...rest }, ref) {
  return (
    <input
      ref={ref}
      id={id}
      aria-invalid={invalid || undefined}
      aria-describedby={invalid && id ? `${id}-error` : undefined}
      className={cn(
        "h-11 w-full rounded-md border bg-surface px-3 text-base text-ink placeholder:text-muted",
        invalid ? "border-crisis" : "border-line-strong focus:border-accent",
        className,
      )}
      {...rest}
    />
  );
});
```
`apps/web/components/ui/field.tsx`
```tsx
export function Field({ label, htmlFor, hint, error, children }: {
  label: string; htmlFor: string; hint?: string; error?: string; children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={htmlFor} className="text-sm font-medium text-ink">{label}</label>
      {children}
      {hint && !error && <p className="text-sm text-muted">{hint}</p>}
      {error && <p id={`${htmlFor}-error`} className="text-sm text-crisis">{error}</p>}
    </div>
  );
}
```
`apps/web/components/ui/checkbox.tsx`
```tsx
import { forwardRef, useId } from "react";

type Props = Omit<React.InputHTMLAttributes<HTMLInputElement>, "type"> & { label: string; description?: string };

export const Checkbox = forwardRef<HTMLInputElement, Props>(function Checkbox({ label, description, id, ...rest }, ref) {
  const auto = useId();
  const cid = id ?? auto;
  return (
    <div className="flex items-start gap-3">
      <input ref={ref} id={cid} type="checkbox" className="mt-1 size-4 accent-[var(--accent)]" {...rest} />
      <label htmlFor={cid} className="flex flex-col gap-0.5">
        <span className="font-medium text-ink">{label}</span>
        {description && <span className="text-sm text-ink-2">{description}</span>}
      </label>
    </div>
  );
});
```
`apps/web/components/ui/alert.tsx`
```tsx
import { cn } from "@/lib/cn";

export function Alert({ tone = "info", children }: { tone?: "info" | "error" | "success"; children: React.ReactNode }) {
  return (
    <div role={tone === "error" ? "alert" : "status"}
      className={cn("rounded-md border px-4 py-3 text-sm",
        tone === "info" && "border-line bg-accent-subtle text-ink",
        tone === "error" && "border-crisis/30 bg-crisis-fill text-crisis",
        tone === "success" && "border-steady/30 bg-steady-fill text-steady")}>
      {children}
    </div>
  );
}
```
`apps/web/components/icons.tsx`
```tsx
type P = React.SVGProps<SVGSVGElement>;
const base = { viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: 1.75,
  strokeLinecap: "square" as const, strokeLinejoin: "miter" as const, width: 20, height: 20, "aria-hidden": true };
const Nq = ({ x, y, r }: { x: number; y: number; r: number }) =>
  <path d={`M${x} ${y - r} L${x + r} ${y} L${x} ${y + r} L${x - r} ${y} Z`} fill="currentColor" stroke="none" />;

export const IconHome = (p: P) => <svg {...base} {...p}><path d="M4 19.5 H20" /><path d="M5 15.5 L9.5 11.5 L13.5 13.5 L17.5 8.5" /><Nq x={18.6} y={7.2} r={2.2} /></svg>;
export const IconCheckIn = (p: P) => <svg {...base} {...p}><path d="M5.5 4.5 H18.5 V21 H5.5 Z" /><path d="M9.5 4.5 V2.8 H14.5 V4.5" /><path d="M11.5 10 H16" /><path d="M11.5 15.5 H16" /><Nq x={8.6} y={10} r={1.6} /><Nq x={8.6} y={15.5} r={1.6} /></svg>;
export const IconCounselor = (p: P) => <svg {...base} {...p}><path d="M4 5 H20 V16 H11.5 L7.5 19.5 V16 H4 Z" /><path d="M8 10.5 H16" /></svg>;
export const IconFlag = (p: P) => <svg {...base} {...p}><path d="M6 21 V3.5" /><path d="M6 4.5 H17.5 L14.8 8.5 L17.5 12.5 H6" /></svg>;
export const IconShield = (p: P) => <svg {...base} {...p}><path d="M12 3 L19 5.8 V11.5 C19 15.8 16 18.8 12 20.8 C8 18.8 5 15.8 5 11.5 V5.8 Z" /><path d="M8.8 11.8 L11 14 L15.4 9.6" /></svg>;
export const IconCitation = (p: P) => <svg {...base} {...p}><path d="M3.5 5.5 H9.5 C10.9 5.5 12 6.6 12 8 V20 C12 18.9 11.1 18 10 18 H3.5 Z" /><path d="M20.5 5.5 H14.5 C13.1 5.5 12 6.6 12 8" /><path d="M20.5 9.5 V18 H14 C12.9 18 12 18.9 12 20" /><Nq x={19.2} y={4.2} r={2} /></svg>;
export const IconPhone = (p: P) => <svg {...base} {...p}><path d="M6.5 3.5 H9.5 L11 8 L8.8 9.5 C9.8 11.7 12.3 14.2 14.5 15.2 L16 13 L20.5 14.5 V17.5 C20.5 19.2 19.2 20.5 17.5 20.5 C10.3 20.5 3.5 13.7 3.5 6.5 C3.5 4.8 4.8 3.5 6.5 3.5 Z" /></svg>;
export const IconHistory = (p: P) => <svg {...base} {...p}><path d="M3.5 19 H20.5" /><path d="M6.5 17 V19 M10 17.8 V19 M17.5 17.8 V19" /><path d="M14 10.5 V19" /><Nq x={14} y={6.8} r={3.2} /></svg>;
```
`apps/web/components/brand.tsx`
```tsx
/* eslint-disable @next/next/no-img-element */
export function Lockup({ variant = "light", className = "h-6 w-auto" }: { variant?: "light" | "dark"; className?: string }) {
  return <img src={variant === "light" ? "/brand/zehensync-lockup.svg" : "/brand/zehensync-lockup-reversed.svg"}
    alt="ZehenSync" className={className} />;
}
```

- [ ] **Step 4: Run tests**

Run: `pnpm -C apps/web test`
Expected: `6 passed`.

- [ ] **Step 5: Commit**

```bash
git add apps/web
git commit -m "T-1.11 UI primitives (button, input, field, checkbox, alert), brand icons and lockup"
```

---

### Task 3: Typed API client, auth store, session refresh (T-1.13)

**Files:**
- Create: `apps/web/lib/api/schema.d.ts` (generated), `apps/web/lib/api/client.ts`, `apps/web/lib/api/errors.ts`, `apps/web/lib/auth/store.ts`, `apps/web/lib/auth/jwt.ts`, `apps/web/lib/auth/provider.tsx`
- Test: `apps/web/tests/unit/session.test.ts`

**Interfaces:**
- Consumes: P1-A OpenAPI at `/api/v1/openapi.json`.
- Produces: `api` (openapi-fetch client typed with `paths`); `type Me = components["schemas"]["MeOut"]`; `useAuth` Zustand store `{ ready: boolean; accessToken: string | null; me: Me | null; setSession(token: string, me: Me): void; setMe(me: Me): void; clear(): void; markReady(): void }`; `refreshSession(): Promise<boolean>` (single in-flight); `logout(): Promise<void>`; `expiresWithin(token: string, seconds: number, nowMs?: number): boolean`; `errorMessage(err: unknown): string`; `<AuthProvider>` restoring the session on mount.

- [ ] **Step 1: Generate types**

Run (API running from P1-A: `cd apps/api && uv run uvicorn app.main:app`): `pnpm -C apps/web gen:api`
Expected: `apps/web/lib/api/schema.d.ts` written, containing `"/api/v1/auth/signup"` and `MeOut`.

- [ ] **Step 2: Write the failing test**

`apps/web/tests/unit/session.test.ts`
```ts
import { expiresWithin } from "@/lib/auth/jwt";
import { refreshSession } from "@/lib/api/client";
import { useAuth } from "@/lib/auth/store";
import { errorMessage } from "@/lib/api/errors";

function token(expSecondsFromNow: number): string {
  const b64 = (o: object) => btoa(JSON.stringify(o)).replace(/=+$/, "").replace(/\+/g, "-").replace(/\//g, "_");
  return `${b64({ alg: "HS256" })}.${b64({ exp: Math.floor(Date.now() / 1000) + expSecondsFromNow })}.sig`;
}

const me = { id: "1", email: "a@b.pk", display_name: "A", role: "patient", status: "active", mfa_enabled: false,
  pseudonym: "ZS-AAAA-AA", consents: [], onboarding: { consents_missing: [], intake_required: true,
  mfa_setup_required: false }, clinician: null };

describe("session", () => {
  beforeEach(() => useAuth.getState().clear());

  it("detects tokens about to expire", () => {
    expect(expiresWithin(token(10), 30)).toBe(true);
    expect(expiresWithin(token(600), 30)).toBe(false);
    expect(expiresWithin("garbage", 30)).toBe(true);
  });

  it("refreshSession shares one in-flight request", async () => {
    const fetchMock = vi.fn(async () =>
      new Response(JSON.stringify({ access_token: token(900), token_type: "bearer", user: me }), { status: 200 }));
    vi.stubGlobal("fetch", fetchMock);
    const [a, b] = await Promise.all([refreshSession(), refreshSession()]);
    expect(a && b).toBe(true);
    expect(fetchMock).toHaveBeenCalledTimes(1);
    expect(useAuth.getState().me?.email).toBe("a@b.pk");
    vi.unstubAllGlobals();
  });

  it("failed refresh clears the session", async () => {
    useAuth.getState().setSession(token(900), me as never);
    vi.stubGlobal("fetch", vi.fn(async () => new Response("{}", { status: 401 })));
    expect(await refreshSession()).toBe(false);
    expect(useAuth.getState().accessToken).toBeNull();
    vi.unstubAllGlobals();
  });

  it("maps API errors to their message", () => {
    expect(errorMessage({ error: { code: "EMAIL_TAKEN", message: "That email is already registered.", detail: {} } }))
      .toBe("That email is already registered.");
    expect(errorMessage(new TypeError("Failed to fetch"))).toBe("We couldn't reach ZehenSync. Check your connection and try again.");
  });
});
```

- [ ] **Step 3: Run to see it fail**

Run: `pnpm -C apps/web test tests/unit/session.test.ts`
Expected: FAIL, cannot resolve `@/lib/auth/jwt`.

- [ ] **Step 4: Implement**

`apps/web/lib/auth/jwt.ts`
```ts
export function expiresWithin(token: string, seconds: number, nowMs: number = Date.now()): boolean {
  try {
    const part = token.split(".")[1];
    if (!part) return true;
    const json = JSON.parse(atob(part.replace(/-/g, "+").replace(/_/g, "/"))) as { exp?: number };
    return !json.exp || json.exp * 1000 - nowMs < seconds * 1000;
  } catch {
    return true;
  }
}
```
`apps/web/lib/auth/store.ts`
```ts
import { create } from "zustand";
import type { components } from "@/lib/api/schema";

export type Me = components["schemas"]["MeOut"];

type AuthState = {
  ready: boolean;
  accessToken: string | null;
  me: Me | null;
  setSession: (token: string, me: Me) => void;
  setMe: (me: Me) => void;
  clear: () => void;
  markReady: () => void;
};

export const useAuth = create<AuthState>((set) => ({
  ready: false,
  accessToken: null,
  me: null,
  setSession: (accessToken, me) => set({ accessToken, me }),
  setMe: (me) => set({ me }),
  clear: () => set({ accessToken: null, me: null }),
  markReady: () => set({ ready: true }),
}));
```
`apps/web/lib/api/errors.ts`
```ts
type ApiErrorBody = { error: { code: string; message: string; detail: Record<string, unknown> } };

export function isApiError(e: unknown): e is ApiErrorBody {
  return typeof e === "object" && e !== null && "error" in e &&
    typeof (e as ApiErrorBody).error?.message === "string";
}

export function errorCode(e: unknown): string | null {
  return isApiError(e) ? e.error.code : null;
}

export function errorMessage(e: unknown): string {
  if (isApiError(e)) return e.error.message;
  if (e instanceof TypeError) return "We couldn't reach ZehenSync. Check your connection and try again.";
  return "Something didn't work. Please try again.";
}
```
`apps/web/lib/api/client.ts`
```ts
import createClient, { type Middleware } from "openapi-fetch";
import type { paths } from "@/lib/api/schema";
import { expiresWithin } from "@/lib/auth/jwt";
import { useAuth } from "@/lib/auth/store";

let inflight: Promise<boolean> | null = null;

export function refreshSession(): Promise<boolean> {
  inflight ??= (async () => {
    try {
      const r = await fetch("/api/v1/auth/refresh", { method: "POST", credentials: "include" });
      if (!r.ok) {
        useAuth.getState().clear();
        return false;
      }
      const body = await r.json();
      useAuth.getState().setSession(body.access_token, body.user);
      return true;
    } catch {
      useAuth.getState().clear();
      return false;
    } finally {
      inflight = null;
    }
  })();
  return inflight;
}

export async function logout(): Promise<void> {
  await fetch("/api/v1/auth/logout", { method: "POST", credentials: "include" }).catch(() => undefined);
  useAuth.getState().clear();
}

const auth: Middleware = {
  async onRequest({ request }) {
    if (request.url.includes("/api/v1/auth/")) return request;
    let token = useAuth.getState().accessToken;
    if (token && expiresWithin(token, 30)) {
      await refreshSession();
      token = useAuth.getState().accessToken;
    }
    if (token) request.headers.set("Authorization", `Bearer ${token}`);
    return request;
  },
  async onResponse({ response }) {
    if (response.status === 401) useAuth.getState().clear();
    return response;
  },
};

// Absolute origin so Request() also works under jsdom in unit tests.
export const api = createClient<paths>({ baseUrl: globalThis.location?.origin ?? "", credentials: "include" });
api.use(auth);
```
`apps/web/lib/auth/provider.tsx`
```tsx
"use client";
import { useEffect } from "react";
import { refreshSession } from "@/lib/api/client";
import { useAuth } from "@/lib/auth/store";

export function AuthProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    refreshSession().finally(() => useAuth.getState().markReady());
  }, []);
  return <>{children}</>;
}
```

- [ ] **Step 5: Run tests**

Run: `pnpm -C apps/web test`
Expected: all pass (4 new).

- [ ] **Step 6: Commit**

```bash
git add apps/web
git commit -m "T-1.13 typed API client from OpenAPI, in-memory auth store, single-flight session refresh"
```

---

### Task 4: Routing rules, guarded app shell per role (T-1.12)

**Files:**
- Create: `apps/web/lib/auth/routes.ts`, `apps/web/components/auth/route-guard.tsx`, `apps/web/components/shell/nav.ts`, `apps/web/components/shell/app-shell.tsx`, `apps/web/app/(app)/layout.tsx`, `apps/web/app/(app)/home/page.tsx`, `apps/web/app/(app)/scholar/page.tsx`, `apps/web/app/(app)/clinician/pending/page.tsx`, `apps/web/app/(app)/clinician/queue/page.tsx`, `apps/web/app/help/page.tsx`
- Test: `apps/web/tests/unit/routes.test.ts`, `apps/web/tests/unit/shell.test.tsx`

**Interfaces:**
- Consumes: `Me`, `useAuth`, `logout`.
- Produces: `homeFor(me: Me): string`; `areaOf(path: string): "public" | "onboarding" | "shared" | "patient" | "scholar" | "clinician" | "admin"`; `nextRoute(me: Me | null, path: string): string | null`; `<RouteGuard>` (client redirect using `nextRoute`, renders nothing until settled); `<AppShell>`; `NAV: Record<Role, NavItem[]>`.

- [ ] **Step 1: Write the failing tests**

`apps/web/tests/unit/routes.test.ts`
```ts
import { homeFor, nextRoute } from "@/lib/auth/routes";
import type { Me } from "@/lib/auth/store";

function me(over: Partial<Me> & { role: Me["role"] }): Me {
  return { id: "1", email: "a@b.pk", display_name: "A", status: "active", mfa_enabled: false, pseudonym: null,
    consents: [], clinician: null,
    onboarding: { consents_missing: [], intake_required: false, mfa_setup_required: false }, ...over } as Me;
}

describe("homeFor", () => {
  it.each([
    [me({ role: "patient" }), "/home"],
    [me({ role: "scholar" }), "/scholar"],
    [me({ role: "clinician", status: "pending_verification" }), "/clinician/pending"],
    [me({ role: "clinician" }), "/clinician/queue"],
    [me({ role: "admin" }), "/admin/clinicians"],
  ])("%#", (m, path) => expect(homeFor(m)).toBe(path));
});

describe("nextRoute", () => {
  const patient = me({ role: "patient" });
  it.each<[Me | null, string, string | null]>([
    [null, "/settings/consents", "/login"],
    [null, "/signup", null],
    [null, "/help", null],
    [null, "/under-18", null],
    [patient, "/login", "/home"],
    [patient, "/admin/clinicians", "/home"],
    [patient, "/scholar", "/home"],
    [patient, "/home", null],
    [patient, "/help", null],
    [patient, "/settings/consents", null],
    [patient, "/", "/home"],
    [me({ role: "patient", onboarding: { consents_missing: ["ai_processing"], intake_required: true,
      mfa_setup_required: false } }), "/home", "/onboarding/consents"],
    [me({ role: "patient", onboarding: { consents_missing: ["ai_processing"], intake_required: true,
      mfa_setup_required: false } }), "/help", null],
    [patient, "/onboarding/consents", "/home"],
    [me({ role: "admin", onboarding: { consents_missing: [], intake_required: false, mfa_setup_required: true } }),
      "/admin/clinicians", "/settings/security"],
    [me({ role: "clinician", status: "pending_verification", onboarding: { consents_missing: [],
      intake_required: false, mfa_setup_required: true } }), "/clinician/pending", null],
    [me({ role: "clinician", status: "pending_verification" }), "/clinician/queue", "/clinician/pending"],
    [me({ role: "clinician" }), "/clinician/pending", "/clinician/queue"],
  ])("missing consents win over everything but /help — case %#", (m, path, expected) =>
    expect(nextRoute(m, path)).toBe(expected));
});
```
`apps/web/tests/unit/shell.test.tsx`
```tsx
import { render, screen } from "@testing-library/react";
import { AppShell } from "@/components/shell/app-shell";
import { useAuth, type Me } from "@/lib/auth/store";

vi.mock("next/navigation", () => ({ usePathname: () => "/home", useRouter: () => ({ replace: vi.fn() }) }));

const base = { id: "1", email: "a@b.pk", display_name: "Sana", status: "active", mfa_enabled: false, pseudonym: null,
  consents: [], clinician: null, onboarding: { consents_missing: [], intake_required: false, mfa_setup_required: false } };

describe("AppShell", () => {
  it("patients see Get help now; the word patient never appears", () => {
    useAuth.setState({ me: { ...base, role: "patient" } as Me, ready: true });
    render(<AppShell><p>content</p></AppShell>);
    expect(screen.getByRole("link", { name: /get help now/i })).toHaveAttribute("href", "/help");
    expect(document.body.textContent?.toLowerCase()).not.toContain("patient");
  });
  it("admins get the clinician queue and no help link", () => {
    useAuth.setState({ me: { ...base, role: "admin" } as Me, ready: true });
    render(<AppShell><p>content</p></AppShell>);
    expect(screen.getByRole("link", { name: /clinicians/i })).toHaveAttribute("href", "/admin/clinicians");
    expect(screen.queryByRole("link", { name: /get help now/i })).toBeNull();
  });
});
```

- [ ] **Step 2: Run to see them fail**

Run: `pnpm -C apps/web test tests/unit/routes.test.ts tests/unit/shell.test.tsx`
Expected: FAIL, cannot resolve `@/lib/auth/routes`.

- [ ] **Step 3: Implement routing rules**

`apps/web/lib/auth/routes.ts`
```ts
import type { Me } from "@/lib/auth/store";

const PUBLIC = new Set(["/login", "/login/verify", "/signup", "/signup/support", "/signup/scholar",
  "/signup/clinician", "/under-18"]);
const ALWAYS = new Set(["/help"]);

export function homeFor(me: Me): string {
  switch (me.role) {
    case "patient": return "/home";
    case "scholar": return "/scholar";
    case "clinician": return me.status === "pending_verification" ? "/clinician/pending" : "/clinician/queue";
    case "admin": return "/admin/clinicians";
  }
}

export function areaOf(path: string): "public" | "onboarding" | "shared" | "patient" | "scholar" | "clinician" | "admin" {
  if (PUBLIC.has(path)) return "public";
  if (path.startsWith("/onboarding")) return "onboarding";
  if (path.startsWith("/settings") || path === "/") return "shared";
  if (path.startsWith("/home")) return "patient";
  if (path.startsWith("/scholar")) return "scholar";
  if (path.startsWith("/clinician")) return "clinician";
  if (path.startsWith("/admin")) return "admin";
  return "shared";
}

export function nextRoute(me: Me | null, path: string): string | null {
  if (ALWAYS.has(path)) return null;
  const area = areaOf(path);
  if (!me) return area === "public" ? null : "/login";
  if (area === "public") return homeFor(me);
  const missing = me.onboarding.consents_missing.length > 0;
  if (missing) return area === "onboarding" ? null : "/onboarding/consents";
  if (area === "onboarding") return homeFor(me);
  const pending = me.role === "clinician" && me.status === "pending_verification";
  if (me.onboarding.mfa_setup_required && !pending && path !== "/settings/security") return "/settings/security";
  if (path === "/") return homeFor(me);
  if (area !== "shared" && area !== me.role) return homeFor(me);
  if (me.role === "clinician" && path.startsWith("/clinician") && path !== homeFor(me)) return homeFor(me);
  return null;
}
```

- [ ] **Step 4: Guard, nav, shell, placeholder pages**

`apps/web/components/auth/route-guard.tsx`
```tsx
"use client";
import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { nextRoute } from "@/lib/auth/routes";
import { useAuth } from "@/lib/auth/store";

export function RouteGuard({ children }: { children: React.ReactNode }) {
  const { ready, me } = useAuth();
  const path = usePathname();
  const router = useRouter();
  const target = ready ? nextRoute(me, path) : null;
  useEffect(() => {
    if (target) router.replace(target);
  }, [target, router]);
  if (!ready || target) return <div className="min-h-screen bg-bg" aria-busy="true" />;
  return <>{children}</>;
}
```
`apps/web/components/shell/nav.ts`
```ts
import type { Me } from "@/lib/auth/store";

export type NavItem = { href: string; label: string; icon: "home" | "shield" | "flag" | "citation" | "history" };

export const NAV: Record<Me["role"], NavItem[]> = {
  patient: [{ href: "/home", label: "Home", icon: "home" }, { href: "/settings/consents", label: "Privacy", icon: "shield" }],
  scholar: [{ href: "/scholar", label: "Ask", icon: "citation" }, { href: "/settings/consents", label: "Privacy", icon: "shield" }],
  clinician: [{ href: "/clinician/queue", label: "Queue", icon: "flag" },
    { href: "/settings/security", label: "Security", icon: "shield" }, { href: "/settings/consents", label: "Privacy", icon: "history" }],
  admin: [{ href: "/admin/clinicians", label: "Clinicians", icon: "flag" },
    { href: "/settings/security", label: "Security", icon: "shield" }],
};

export const AREA_LABEL: Record<Me["role"], string> = {
  patient: "Your space", scholar: "Scholar", clinician: "Psychologist", admin: "Admin",
};
```
`apps/web/components/shell/app-shell.tsx`
```tsx
"use client";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Lockup } from "@/components/brand";
import { IconCitation, IconFlag, IconHistory, IconHome, IconPhone, IconShield } from "@/components/icons";
import { AREA_LABEL, NAV, type NavItem } from "@/components/shell/nav";
import { logout } from "@/lib/api/client";
import { useAuth } from "@/lib/auth/store";
import { cn } from "@/lib/cn";

const ICONS: Record<NavItem["icon"], (p: React.SVGProps<SVGSVGElement>) => React.JSX.Element> = {
  home: IconHome, shield: IconShield, flag: IconFlag, citation: IconCitation, history: IconHistory,
};

export function AppShell({ children }: { children: React.ReactNode }) {
  const me = useAuth((s) => s.me);
  const path = usePathname();
  const router = useRouter();
  if (!me) return null;
  return (
    <div className="grid min-h-screen grid-cols-[240px_1fr]">
      <aside className="flex flex-col gap-1 border-r border-line bg-sunken px-4 py-6">
        <Lockup className="mb-8 ml-2 h-6 w-auto" />
        <nav className="flex flex-col gap-1" aria-label="Main">
          {NAV[me.role].map((item) => {
            const Icon = ICONS[item.icon];
            const on = path === item.href;
            return (
              <Link key={item.href} href={item.href} aria-current={on ? "page" : undefined}
                className={cn("flex items-center gap-3 rounded-md px-3 py-2 font-medium text-ink-2",
                  on && "bg-surface text-accent shadow-[inset_3px_0_0_var(--accent)]")}>
                <Icon style={on ? { color: "var(--accent)" } : undefined} />{item.label}
              </Link>
            );
          })}
        </nav>
        <div className="mt-auto flex items-center justify-between px-3 text-sm text-ink-2">
          <span className="truncate">{me.display_name}</span>
          <button className="text-accent hover:underline" onClick={async () => { await logout(); router.replace("/login"); }}>
            Sign out
          </button>
        </div>
      </aside>
      <div className="flex min-w-0 flex-col">
        <header className="flex h-14 items-center justify-between border-b border-line px-8">
          <span className="font-mono text-xs uppercase tracking-[0.12em] text-muted">{AREA_LABEL[me.role]}</span>
          {me.role === "patient" && (
            <Link href="/help" className="inline-flex items-center gap-2 rounded-full border border-accent-selected px-4 py-1.5 text-sm font-medium text-accent">
              <IconPhone width={16} height={16} />Get help now
            </Link>
          )}
        </header>
        <main className="flex-1 px-8 py-10">{children}</main>
        {me.role === "patient" && (
          <footer className="border-t border-line px-8 py-3 text-center text-xs text-muted">
            ZehenSync is a screening tool. It cannot diagnose. In an emergency call 1122.
          </footer>
        )}
      </div>
    </div>
  );
}
```
`apps/web/app/(app)/layout.tsx`
```tsx
import { RouteGuard } from "@/components/auth/route-guard";
import { AppShell } from "@/components/shell/app-shell";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return <RouteGuard><AppShell>{children}</AppShell></RouteGuard>;
}
```
`apps/web/app/(app)/home/page.tsx`
```tsx
"use client";
import Link from "next/link";
import { useAuth } from "@/lib/auth/store";

export default function Home() {
  const me = useAuth((s) => s.me);
  return (
    <div className="mx-auto flex max-w-[680px] flex-col gap-6">
      <h1 className="font-serif text-4xl font-light tracking-tight">Hi, {me?.display_name}.</h1>
      <section className="rounded-lg border border-line bg-surface p-6">
        <h2 className="font-serif text-2xl">Your first check-in is on its way</h2>
        <p className="mt-2 text-ink-2">Guided check-ins arrive in the next update. You can review what you&apos;ve agreed to share at any time.</p>
        <Link href="/settings/consents" className="mt-4 inline-block font-medium text-accent underline underline-offset-4">Review privacy choices</Link>
      </section>
    </div>
  );
}
```
`apps/web/app/(app)/scholar/page.tsx`
```tsx
export default function Scholar() {
  return (
    <div className="mx-auto max-w-[720px]">
      <h1 className="font-serif text-4xl font-light tracking-tight">Ask with sources</h1>
      <p className="mt-3 text-ink-2">The cited tutor opens in phase 5. Every answer will point to the passage it came from, or say it can&apos;t find one.</p>
    </div>
  );
}
```
`apps/web/app/(app)/clinician/pending/page.tsx`
```tsx
"use client";
import { useAuth } from "@/lib/auth/store";

export default function Pending() {
  const me = useAuth((s) => s.me);
  const rejected = me?.clinician?.verification === "rejected";
  return (
    <div className="mx-auto max-w-[680px] rounded-lg border border-line bg-surface p-8">
      <p className="font-mono text-xs uppercase tracking-[0.12em] text-muted">Account review</p>
      <h1 className="mt-3 font-serif text-3xl">{rejected ? "We couldn't verify your licence" : "We're checking your details"}</h1>
      <p className="mt-3 text-ink-2">
        {rejected
          ? "An admin reviewed your application and could not verify it. Contact your department if you think this is a mistake."
          : "An admin reviews every psychologist before they can see anyone's data. You'll be able to sign in to your queue once you're approved."}
      </p>
    </div>
  );
}
```
`apps/web/app/(app)/clinician/queue/page.tsx`
```tsx
"use client";
import { useAuth } from "@/lib/auth/store";

export default function Queue() {
  const code = useAuth((s) => s.me?.clinician?.invite_code);
  return (
    <div className="mx-auto max-w-[760px]">
      <h1 className="font-serif text-4xl font-light tracking-tight">Triage queue</h1>
      <p className="mt-3 text-ink-2">No linked people yet. Share your invite code so someone can link their check-ins to you.</p>
      {code && <p className="mt-6 inline-block rounded-md border border-line bg-surface px-4 py-3 font-mono text-lg">{code}</p>}
    </div>
  );
}
```
`apps/web/app/help/page.tsx`
```tsx
import Link from "next/link";

const RESOURCES = [
  { name: "Umang Pakistan", number: "0311 7786264", tel: "03117786264", note: "24 hours" },
  { name: "Rozan Helpline", number: "0304 111 1741", tel: "03041111741", note: "Counselling" },
  { name: "Rescue 1122", number: "1122", tel: "1122", note: "Emergency" },
  { name: "Edhi", number: "115", tel: "115", note: "Ambulance" },
];

export default function Help() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-bg px-6">
      <div className="w-full max-w-[640px] rounded-xl border border-line bg-surface p-10">
        <h1 className="font-serif text-4xl tracking-tight">You don&apos;t have to handle this alone.</h1>
        <p className="mt-3 text-lg text-ink-2">Please reach out to someone right now. These services are free and confidential.</p>
        <div className="mt-8 grid grid-cols-2 gap-3">
          {RESOURCES.map((r) => (
            <a key={r.name} href={`tel:${r.tel}`} className="rounded-lg border border-line p-4 hover:border-accent">
              <span className="block font-medium">{r.name}</span>
              <span className="block font-mono text-lg text-accent">{r.number}</span>
              <span className="block text-sm text-muted">{r.note}</span>
            </a>
          ))}
        </div>
        <Link href="/" className="mt-8 inline-block font-medium text-accent underline underline-offset-4">I&apos;m safe right now</Link>
      </div>
    </main>
  );
}
```

- [ ] **Step 5: Run tests**

Run: `pnpm -C apps/web test`
Expected: all pass.

- [ ] **Step 6: Commit**

```bash
git add apps/web
git commit -m "T-1.12 routing rules, guarded app shell per role, placeholder areas, static help page"
```

---

### Task 5: Signup fork, signup forms, under-18, login and MFA verify, clinician application (T-1.05 UI, T-1.06 UI, T-1.15)

**Files:**
- Create: `apps/web/lib/forms.ts`, `apps/web/components/auth/signup-form.tsx`, `apps/web/app/(auth)/layout.tsx`, `apps/web/app/(auth)/signup/page.tsx`, `apps/web/app/(auth)/signup/support/page.tsx`, `apps/web/app/(auth)/signup/scholar/page.tsx`, `apps/web/app/(auth)/signup/clinician/page.tsx`, `apps/web/app/(auth)/under-18/page.tsx`, `apps/web/app/(auth)/login/page.tsx`, `apps/web/app/(auth)/login/verify/page.tsx`
- Test: `apps/web/tests/unit/forms.test.ts`

**Interfaces:**
- Consumes: `api`, `useAuth`, `homeFor`, `nextRoute`, UI primitives.
- Produces: `signupSchema`, `clinicianSchema`, `loginSchema`, `codeSchema` (Zod 4); `isUnder18(birthYear: number, now?: Date): boolean`; `<SignupForm path="support"|"scholar">`; sessionStorage key `zs_mfa_token` (holds the short-lived MFA challenge token between `/login` and `/login/verify` only).

- [ ] **Step 1: Write the failing test**

`apps/web/tests/unit/forms.test.ts`
```ts
import { clinicianSchema, isUnder18, loginSchema, signupSchema } from "@/lib/forms";

const ok = { email: "sana@example.com", password: "a long enough password", display_name: "Sana", birth_year: 2000 };

function file(name: string, type: string, size: number): File {
  return new File([new Uint8Array(size)], name, { type });
}

describe("forms", () => {
  it("signupSchema accepts a valid body", () => expect(signupSchema.safeParse(ok).success).toBe(true));
  it("signupSchema rejects bad birth years", () => {
    expect(signupSchema.safeParse({ ...ok, birth_year: Number("abc") }).success).toBe(false);
    expect(signupSchema.safeParse({ ...ok, birth_year: new Date().getFullYear() + 1 }).success).toBe(false);
  });
  it("signupSchema requires 12+ character passwords", () =>
    expect(signupSchema.safeParse({ ...ok, password: "short" }).success).toBe(false));
  it("isUnder18 uses the calendar year only", () => {
    const now = new Date("2026-09-29");
    expect(isUnder18(2009, now)).toBe(true);
    expect(isUnder18(2008, now)).toBe(false);
  });
  it("clinicianSchema rejects large and wrong-type files", () => {
    const base = { ...ok, full_name: "Ayesha Khan", institution: "UCP" };
    expect(clinicianSchema.safeParse({ ...base, proof: file("l.pdf", "application/pdf", 1000) }).success).toBe(true);
    expect(clinicianSchema.safeParse({ ...base, proof: file("l.pdf", "application/pdf", 7 * 1024 * 1024) }).success).toBe(false);
    expect(clinicianSchema.safeParse({ ...base, proof: file("l.docx", "application/vnd.openxmlformats", 1000) }).success).toBe(false);
  });
  it("loginSchema trims email", () =>
    expect(loginSchema.parse({ email: " Sana@Example.com ", password: "x" }).email).toBe("sana@example.com"));
});
```

- [ ] **Step 2: Run to see it fail**

Run: `pnpm -C apps/web test tests/unit/forms.test.ts`
Expected: FAIL, cannot resolve `@/lib/forms`.

- [ ] **Step 3: Implement schemas**

`apps/web/lib/forms.ts`
```ts
import { z } from "zod";

const thisYear = () => new Date().getFullYear();
const email = z.string().trim().toLowerCase().pipe(z.email("Enter a valid email address."));

export const signupSchema = z.object({
  email,
  password: z.string().min(12, "Use at least 12 characters.").max(128, "Use 128 characters or fewer."),
  display_name: z.string().trim().min(1, "Tell us what to call you.").max(80),
  birth_year: z.number({ error: "Enter the year you were born." }).int().min(1900, "Check the year.")
    .refine((y) => y <= thisYear(), "Check the year."),
  institution: z.string().trim().max(160).optional(),
});
export type SignupValues = z.infer<typeof signupSchema>;

export const PROOF_TYPES = ["application/pdf", "image/png", "image/jpeg"];
export const PROOF_MAX = 5 * 1024 * 1024;

export const clinicianSchema = signupSchema.extend({
  full_name: z.string().trim().min(2, "Enter your full name.").max(120),
  institution: z.string().trim().min(2, "Enter your clinic, hospital or department.").max(160),
  license_no: z.string().trim().max(60).optional(),
  specialty: z.string().trim().max(120).optional(),
  proof: z.instanceof(File, { message: "Attach your licence or staff ID." })
    .refine((f) => PROOF_TYPES.includes(f.type), "Upload a PDF, PNG or JPEG.")
    .refine((f) => f.size <= PROOF_MAX, "The file must be 5 MB or smaller."),
});
export type ClinicianValues = z.infer<typeof clinicianSchema>;

export const loginSchema = z.object({ email, password: z.string().min(1, "Enter your password.") });
export type LoginValues = z.infer<typeof loginSchema>;

export const codeSchema = z.object({ code: z.string().trim().min(6, "Enter the 6-digit code.").max(20) });
export type CodeValues = z.infer<typeof codeSchema>;

export function isUnder18(birthYear: number, now: Date = new Date()): boolean {
  return now.getFullYear() - birthYear < 18;
}
```

- [ ] **Step 4: Run tests**

Run: `pnpm -C apps/web test tests/unit/forms.test.ts`
Expected: `6 passed`.

- [ ] **Step 5: Screens**

`apps/web/app/(auth)/layout.tsx`
```tsx
import { Lockup } from "@/components/brand";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="grid min-h-screen grid-cols-[1fr_1.1fr]">
      <aside className="relative flex flex-col justify-between overflow-hidden bg-[var(--zs-night)] p-12 text-[var(--zs-paper)]">
        <Lockup variant="dark" className="h-7 w-auto" />
        <div>
          <p className="font-serif text-5xl font-light leading-[1.05] tracking-tight">
            Screening you can <em className="text-[var(--zs-neel-300)]">trace</em><span className="ml-2 inline-block size-3 rotate-45 bg-nuqta align-middle" />
          </p>
          <p className="mt-6 max-w-md text-[var(--zs-neel-100)]">One question at a time. Every score computed by code. Every flag traceable to the answer behind it.</p>
        </div>
        <p className="font-mono text-xs uppercase tracking-[0.12em] text-[var(--zs-neel-300)]">Not a diagnosis · In an emergency call 1122</p>
      </aside>
      <main className="flex items-center justify-center px-12 py-16"><div className="w-full max-w-[460px]">{children}</div></main>
    </div>
  );
}
```
`apps/web/app/(auth)/signup/page.tsx`
```tsx
import Link from "next/link";

const PATHS = [
  { href: "/signup/support", title: "I'm looking for support", body: "Short guided check-ins, a counselor to talk to, and results you control." },
  { href: "/signup/scholar", title: "I'm a psychology student or researcher", body: "A tutor that cites the DSM-5-TR and papers, and interview practice." },
];

export default function Fork() {
  return (
    <div className="flex flex-col gap-8">
      <h1 className="font-serif text-4xl font-light tracking-tight">What brings you here?</h1>
      <div className="flex flex-col gap-3">
        {PATHS.map((p) => (
          <Link key={p.href} href={p.href} className="group rounded-lg border border-line bg-surface p-5 transition-colors hover:border-accent">
            <span className="block font-serif text-2xl">{p.title}</span>
            <span className="mt-1 block text-ink-2">{p.body}</span>
          </Link>
        ))}
      </div>
      <p className="text-sm text-ink-2">
        Are you a psychologist? <Link href="/signup/clinician" className="font-medium text-accent underline underline-offset-4">Apply for a verified account</Link>
      </p>
      <p className="text-sm text-ink-2">Already have an account? <Link href="/login" className="font-medium text-accent underline underline-offset-4">Sign in</Link></p>
    </div>
  );
}
```
`apps/web/components/auth/signup-form.tsx`
```tsx
"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { Alert } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Field } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { api } from "@/lib/api/client";
import { errorMessage } from "@/lib/api/errors";
import { nextRoute } from "@/lib/auth/routes";
import { useAuth } from "@/lib/auth/store";
import { isUnder18, signupSchema, type SignupValues } from "@/lib/forms";

export function SignupForm({ path }: { path: "support" | "scholar" }) {
  const router = useRouter();
  const [serverError, setServerError] = useState<string | null>(null);
  const { register, handleSubmit, formState: { errors, isSubmitting } } =
    useForm<SignupValues>({ resolver: zodResolver(signupSchema) });

  const onSubmit = async (v: SignupValues) => {
    setServerError(null);
    if (isUnder18(v.birth_year)) return router.push("/under-18");
    const { data, error } = await api.POST("/api/v1/auth/signup", { body: { ...v, path } });
    if (error || !data) return setServerError(errorMessage(error));
    useAuth.getState().setSession(data.access_token, data.user);
    router.replace(nextRoute(data.user, "/home") ?? "/home");
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="flex flex-col gap-5">
      {serverError && <Alert tone="error">{serverError}</Alert>}
      <Field label="What should we call you?" htmlFor="display_name" error={errors.display_name?.message}>
        <Input id="display_name" autoComplete="nickname" invalid={!!errors.display_name} {...register("display_name")} />
      </Field>
      <Field label="Email" htmlFor="email" error={errors.email?.message}>
        <Input id="email" type="email" autoComplete="email" invalid={!!errors.email} {...register("email")} />
      </Field>
      <Field label="Password" htmlFor="password" hint="At least 12 characters." error={errors.password?.message}>
        <Input id="password" type="password" autoComplete="new-password" invalid={!!errors.password} {...register("password")} />
      </Field>
      <Field label="Year you were born" htmlFor="birth_year" error={errors.birth_year?.message}>
        <Input id="birth_year" inputMode="numeric" invalid={!!errors.birth_year} {...register("birth_year", { valueAsNumber: true })} />
      </Field>
      {path === "scholar" && (
        <Field label="University or institution (optional)" htmlFor="institution" error={errors.institution?.message}>
          <Input id="institution" {...register("institution")} />
        </Field>
      )}
      <Button type="submit" size="lg" loading={isSubmitting}>Create account</Button>
    </form>
  );
}
```
`apps/web/app/(auth)/signup/support/page.tsx`
```tsx
import { SignupForm } from "@/components/auth/signup-form";

export default function SupportSignup() {
  return (
    <div className="flex flex-col gap-8">
      <div><h1 className="font-serif text-4xl font-light tracking-tight">Let&apos;s set you up</h1>
        <p className="mt-2 text-ink-2">You&apos;ll answer a few questions at your own pace. Nothing is shared without your say.</p></div>
      <SignupForm path="support" />
    </div>
  );
}
```
`apps/web/app/(auth)/signup/scholar/page.tsx`
```tsx
import { SignupForm } from "@/components/auth/signup-form";

export default function ScholarSignup() {
  return (
    <div className="flex flex-col gap-8">
      <div><h1 className="font-serif text-4xl font-light tracking-tight">Study with sources</h1>
        <p className="mt-2 text-ink-2">Your scholar account never touches anyone&apos;s health data.</p></div>
      <SignupForm path="scholar" />
    </div>
  );
}
```
`apps/web/app/(auth)/signup/clinician/page.tsx`
```tsx
"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { Alert } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Field } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { errorMessage } from "@/lib/api/errors";
import { useAuth } from "@/lib/auth/store";
import { clinicianSchema, isUnder18, type ClinicianValues } from "@/lib/forms";

export default function ClinicianSignup() {
  const router = useRouter();
  const [serverError, setServerError] = useState<string | null>(null);
  const { register, control, handleSubmit, formState: { errors, isSubmitting } } =
    useForm<ClinicianValues>({ resolver: zodResolver(clinicianSchema) });

  const onSubmit = async (v: ClinicianValues) => {
    setServerError(null);
    if (isUnder18(v.birth_year)) return router.push("/under-18");
    const fd = new FormData();
    for (const [k, val] of Object.entries(v)) if (val !== undefined && k !== "proof") fd.append(k, String(val));
    fd.append("proof", v.proof);
    const r = await fetch("/api/v1/auth/signup/clinician", { method: "POST", body: fd, credentials: "include" });
    const body = await r.json().catch(() => ({}));
    if (!r.ok) return setServerError(errorMessage(body));
    useAuth.getState().setSession(body.access_token, body.user);
    router.replace("/onboarding/consents");
  };

  return (
    <div className="flex flex-col gap-8">
      <div><h1 className="font-serif text-4xl font-light tracking-tight">Apply as a psychologist</h1>
        <p className="mt-2 text-ink-2">An admin checks your licence before you can see anyone&apos;s data.</p></div>
      <form onSubmit={handleSubmit(onSubmit)} noValidate className="flex flex-col gap-5">
        {serverError && <Alert tone="error">{serverError}</Alert>}
        <Field label="Full name, as on your licence" htmlFor="full_name" error={errors.full_name?.message}>
          <Input id="full_name" invalid={!!errors.full_name} {...register("full_name")} /></Field>
        <Field label="Display name" htmlFor="display_name" error={errors.display_name?.message}>
          <Input id="display_name" invalid={!!errors.display_name} {...register("display_name")} /></Field>
        <Field label="Clinic, hospital or department" htmlFor="institution" error={errors.institution?.message}>
          <Input id="institution" invalid={!!errors.institution} {...register("institution")} /></Field>
        <div className="grid grid-cols-2 gap-4">
          <Field label="Licence number (optional)" htmlFor="license_no"><Input id="license_no" {...register("license_no")} /></Field>
          <Field label="Specialty (optional)" htmlFor="specialty"><Input id="specialty" {...register("specialty")} /></Field>
        </div>
        <Field label="Work email" htmlFor="email" error={errors.email?.message}>
          <Input id="email" type="email" invalid={!!errors.email} {...register("email")} /></Field>
        <Field label="Password" htmlFor="password" hint="At least 12 characters." error={errors.password?.message}>
          <Input id="password" type="password" autoComplete="new-password" invalid={!!errors.password} {...register("password")} /></Field>
        <Field label="Year you were born" htmlFor="birth_year" error={errors.birth_year?.message}>
          <Input id="birth_year" inputMode="numeric" invalid={!!errors.birth_year} {...register("birth_year", { valueAsNumber: true })} /></Field>
        <Field label="Licence or staff ID (PDF, PNG or JPEG, up to 5 MB)" htmlFor="proof" error={errors.proof?.message as string | undefined}>
          <Controller name="proof" control={control} render={({ field }) => (
            <input id="proof" type="file" accept=".pdf,.png,.jpg,.jpeg" className="text-sm"
              onChange={(e) => field.onChange(e.target.files?.[0])} />)} />
        </Field>
        <Button type="submit" size="lg" loading={isSubmitting}>Send application</Button>
      </form>
    </div>
  );
}
```
`apps/web/app/(auth)/under-18/page.tsx`
```tsx
import Link from "next/link";

export default function UnderEighteen() {
  return (
    <div className="flex flex-col gap-6">
      <h1 className="font-serif text-4xl font-light tracking-tight">ZehenSync is for adults for now</h1>
      <p className="text-ink-2">We can&apos;t create an account for anyone under 18 yet. Talking to someone can still help.</p>
      <ul className="flex flex-col gap-2">
        <li><span className="font-medium">Umang Pakistan</span> · <span className="font-mono text-accent">0311 7786264</span> · 24 hours</li>
        <li><span className="font-medium">Rozan Helpline</span> · <span className="font-mono text-accent">0304 111 1741</span></li>
        <li><span className="font-medium">Rescue 1122</span> · <span className="font-mono text-accent">1122</span> · emergency</li>
      </ul>
      <p className="text-ink-2">A parent, teacher or school counsellor is also a good first call.</p>
      <Link href="/signup" className="font-medium text-accent underline underline-offset-4">Back</Link>
    </div>
  );
}
```
`apps/web/app/(auth)/login/page.tsx`
```tsx
"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { Alert } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Field } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { api } from "@/lib/api/client";
import { errorMessage } from "@/lib/api/errors";
import { nextRoute } from "@/lib/auth/routes";
import { useAuth } from "@/lib/auth/store";
import { loginSchema, type LoginValues } from "@/lib/forms";

export default function Login() {
  const router = useRouter();
  const [serverError, setServerError] = useState<string | null>(null);
  const { register, handleSubmit, formState: { errors, isSubmitting } } =
    useForm<LoginValues>({ resolver: zodResolver(loginSchema) });

  const onSubmit = async (v: LoginValues) => {
    setServerError(null);
    const { data, error } = await api.POST("/api/v1/auth/login", { body: v });
    if (error || !data) return setServerError(errorMessage(error));
    if ("mfa_required" in data) {
      sessionStorage.setItem("zs_mfa_token", data.mfa_token);
      return router.push("/login/verify");
    }
    useAuth.getState().setSession(data.access_token, data.user);
    router.replace(nextRoute(data.user, "/") ?? "/");
  };

  return (
    <div className="flex flex-col gap-8">
      <h1 className="font-serif text-4xl font-light tracking-tight">Welcome back</h1>
      <form onSubmit={handleSubmit(onSubmit)} noValidate className="flex flex-col gap-5">
        {serverError && <Alert tone="error">{serverError}</Alert>}
        <Field label="Email" htmlFor="email" error={errors.email?.message}>
          <Input id="email" type="email" autoComplete="email" invalid={!!errors.email} {...register("email")} /></Field>
        <Field label="Password" htmlFor="password" error={errors.password?.message}>
          <Input id="password" type="password" autoComplete="current-password" invalid={!!errors.password} {...register("password")} /></Field>
        <Button type="submit" size="lg" loading={isSubmitting}>Sign in</Button>
      </form>
      <p className="text-sm text-ink-2">New here? <Link href="/signup" className="font-medium text-accent underline underline-offset-4">Create an account</Link></p>
    </div>
  );
}
```
`apps/web/app/(auth)/login/verify/page.tsx`
```tsx
"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { Alert } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Field } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { api } from "@/lib/api/client";
import { errorMessage } from "@/lib/api/errors";
import { nextRoute } from "@/lib/auth/routes";
import { useAuth } from "@/lib/auth/store";
import { codeSchema, type CodeValues } from "@/lib/forms";

export default function Verify() {
  const router = useRouter();
  const [serverError, setServerError] = useState<string | null>(null);
  const { register, handleSubmit, formState: { errors, isSubmitting } } =
    useForm<CodeValues>({ resolver: zodResolver(codeSchema) });

  const onSubmit = async ({ code }: CodeValues) => {
    const mfa_token = sessionStorage.getItem("zs_mfa_token");
    if (!mfa_token) return router.replace("/login");
    const { data, error } = await api.POST("/api/v1/auth/mfa/verify", { body: { mfa_token, code } });
    if (error || !data) return setServerError(errorMessage(error));
    sessionStorage.removeItem("zs_mfa_token");
    useAuth.getState().setSession(data.access_token, data.user);
    router.replace(nextRoute(data.user, "/") ?? "/");
  };

  return (
    <div className="flex flex-col gap-8">
      <div><h1 className="font-serif text-4xl font-light tracking-tight">Two-step verification</h1>
        <p className="mt-2 text-ink-2">Enter the 6-digit code from your authenticator app, or one of your recovery codes.</p></div>
      <form onSubmit={handleSubmit(onSubmit)} noValidate className="flex flex-col gap-5">
        {serverError && <Alert tone="error">{serverError}</Alert>}
        <Field label="Code" htmlFor="code" error={errors.code?.message}>
          <Input id="code" autoComplete="one-time-code" inputMode="text" className="font-mono tracking-[0.3em]" invalid={!!errors.code} {...register("code")} /></Field>
        <Button type="submit" size="lg" loading={isSubmitting}>Verify</Button>
      </form>
    </div>
  );
}
```

- [ ] **Step 6: Typecheck, lint, test**

Run: `pnpm -C apps/web typecheck && pnpm -C apps/web lint && pnpm -C apps/web test`
Expected: no type or lint errors; all unit tests pass.

- [ ] **Step 7: Commit**

```bash
git add apps/web
git commit -m "T-1.15 T-1.05 T-1.06 signup fork, signup and clinician application forms, under-18, login, MFA verify"
```

---

### Task 6: Consent onboarding and consent centre (T-1.08 UI)

**Files:**
- Create: `apps/web/lib/consents.ts`, `apps/web/app/(auth)/onboarding/consents/page.tsx`, `apps/web/app/(app)/settings/consents/page.tsx`
- Test: `apps/web/tests/unit/consents.test.tsx`

**Interfaces:**
- Consumes: `GET /api/v1/consents/docs`, `POST /api/v1/me/consents`, `DELETE /api/v1/me/consents/{type}`, `GET /api/v1/me`.
- Produces: `CONSENT_COPY: Record<ConsentType, { title: string; body: string }>`; `REQUIRED: Record<Role, ConsentType[]>` (mirrors API); `<OnboardingConsents>` with an "Accept and continue" button enabled only when every required box is ticked.

- [ ] **Step 1: Write the failing test**

`apps/web/tests/unit/consents.test.tsx`
```tsx
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import OnboardingConsents from "@/app/(auth)/onboarding/consents/page";
import { CONSENT_COPY } from "@/lib/consents";
import { useAuth, type Me } from "@/lib/auth/store";

vi.mock("next/navigation", () => ({ useRouter: () => ({ replace: vi.fn() }) }));

describe("consent onboarding", () => {
  it("copy never promises diagnosis and covers every type", () => {
    for (const c of Object.values(CONSENT_COPY)) expect(c.body.toLowerCase()).not.toMatch(/\bdiagnos(e|is) you\b/);
    expect(Object.keys(CONSENT_COPY)).toHaveLength(7);
  });

  it("continue stays disabled until every required consent is ticked", async () => {
    useAuth.setState({ ready: true, accessToken: "t", me: { role: "patient", display_name: "Sana",
      onboarding: { consents_missing: ["terms", "screening_disclaimer", "ai_processing"], intake_required: true,
        mfa_setup_required: false } } as unknown as Me });
    render(<OnboardingConsents />);
    const cont = screen.getByRole("button", { name: /accept and continue/i });
    expect(cont).toBeDisabled();
    for (const cb of screen.getAllByRole("checkbox")) await userEvent.click(cb);
    expect(cont).toBeEnabled();
  });
});
```

- [ ] **Step 2: Run to see it fail**

Run: `pnpm -C apps/web test tests/unit/consents.test.tsx`
Expected: FAIL, cannot resolve `@/lib/consents`.

- [ ] **Step 3: Implement**

`apps/web/lib/consents.ts`
```ts
import type { Me } from "@/lib/auth/store";

export type ConsentType = "terms" | "screening_disclaimer" | "ai_processing" | "webcam_metrics" |
  "voice_processing" | "research_recording" | "clinician_sharing";

export const CONSENT_COPY: Record<ConsentType, { title: string; body: string }> = {
  terms: { title: "Terms of use",
    body: "ZehenSync is a screening tool. It cannot diagnose, treat or manage emergencies. In an emergency call 1122." },
  screening_disclaimer: { title: "Screening, not diagnosis",
    body: "Your results describe how you've been feeling. Only a qualified professional can make a diagnosis." },
  ai_processing: { title: "AI assistance",
    body: "An AI rewrites questions in plain words and powers the counselor. It never calculates your scores. Names and numbers are removed before text reaches the AI provider." },
  webcam_metrics: { title: "Camera measurements",
    body: "Blink, gaze and head movement are measured inside your browser during check-ins. Video never leaves your device." },
  voice_processing: { title: "Voice notes",
    body: "Voice notes are transcribed and measured for pauses and pace, then the audio is deleted." },
  research_recording: { title: "Research recordings",
    body: "With this on, your session video is stored encrypted for the university study and deleted after 24 months." },
  clinician_sharing: { title: "Sharing with a psychologist",
    body: "You choose what a linked psychologist can see, and you can stop sharing at any time." },
};

export const REQUIRED: Record<Me["role"], ConsentType[]> = {
  patient: ["terms", "screening_disclaimer", "ai_processing"],
  scholar: ["terms", "ai_processing"],
  clinician: ["terms"],
  admin: [],
};

export const OPTIONAL: Record<Me["role"], ConsentType[]> = {
  patient: ["webcam_metrics", "voice_processing", "research_recording"],
  scholar: [],
  clinician: [],
  admin: [],
};
```
`apps/web/app/(auth)/onboarding/consents/page.tsx`
```tsx
"use client";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Alert } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { api } from "@/lib/api/client";
import { errorMessage } from "@/lib/api/errors";
import { homeFor, nextRoute } from "@/lib/auth/routes";
import { useAuth } from "@/lib/auth/store";
import { CONSENT_COPY, type ConsentType } from "@/lib/consents";

export default function OnboardingConsents() {
  const router = useRouter();
  const { ready, me } = useAuth();
  const [ticked, setTicked] = useState<Set<ConsentType>>(new Set());
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  const missing = (me?.onboarding.consents_missing ?? []) as ConsentType[];
  useEffect(() => {
    if (ready && !me) router.replace("/login");
    else if (me && missing.length === 0) router.replace(homeFor(me));
  }, [ready, me, missing.length, router]);
  if (!me || missing.length === 0) return null;

  const accept = async () => {
    setBusy(true);
    setErr(null);
    const { data: docs } = await api.GET("/api/v1/consents/docs");
    for (const t of missing) {
      const { error } = await api.POST("/api/v1/me/consents", { body: { type: t, doc_version: docs?.[t] ?? "1.0" } });
      if (error) { setBusy(false); return setErr(errorMessage(error)); }
    }
    const { data } = await api.GET("/api/v1/me");
    if (data) useAuth.getState().setMe(data);
    router.replace(data ? (nextRoute(data, homeFor(data)) ?? homeFor(data)) : "/");
  };

  return (
    <div className="flex flex-col gap-8">
      <div><h1 className="font-serif text-4xl font-light tracking-tight">Before we start</h1>
        <p className="mt-2 text-ink-2">Please read and agree to these. You can review them any time under Privacy.</p></div>
      {err && <Alert tone="error">{err}</Alert>}
      <div className="flex flex-col gap-5">
        {missing.map((t) => (
          <Checkbox key={t} label={CONSENT_COPY[t].title} description={CONSENT_COPY[t].body}
            checked={ticked.has(t)}
            onChange={(e) => setTicked((s) => { const n = new Set(s); if (e.target.checked) n.add(t); else n.delete(t); return n; })} />
        ))}
      </div>
      <Button size="lg" disabled={ticked.size !== missing.length} loading={busy} onClick={accept}>Accept and continue</Button>
    </div>
  );
}
```
`apps/web/app/(app)/settings/consents/page.tsx`
```tsx
"use client";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Alert } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { api } from "@/lib/api/client";
import { errorMessage } from "@/lib/api/errors";
import { useAuth } from "@/lib/auth/store";
import { CONSENT_COPY, OPTIONAL, REQUIRED, type ConsentType } from "@/lib/consents";

export default function ConsentCentre() {
  const router = useRouter();
  const me = useAuth((s) => s.me);
  const [err, setErr] = useState<string | null>(null);
  const [busy, setBusy] = useState<ConsentType | null>(null);
  if (!me) return null;
  const active = new Map(me.consents.map((c) => [c.type as ConsentType, c]));
  const types = [...REQUIRED[me.role], ...OPTIONAL[me.role]];

  const toggle = async (t: ConsentType) => {
    setBusy(t);
    setErr(null);
    const res = active.has(t)
      ? await api.DELETE("/api/v1/me/consents/{consent_type}", { params: { path: { consent_type: t } } })
      : await api.POST("/api/v1/me/consents", { body: { type: t, doc_version: "1.0" } });
    if (res.error) setErr(errorMessage(res.error));
    const { data } = await api.GET("/api/v1/me");
    if (data) {
      useAuth.getState().setMe(data);
      if (data.onboarding.consents_missing.length) router.replace("/onboarding/consents");
    }
    setBusy(null);
  };

  return (
    <div className="mx-auto flex max-w-[720px] flex-col gap-6">
      <h1 className="font-serif text-4xl font-light tracking-tight">Privacy choices</h1>
      {err && <Alert tone="error">{err}</Alert>}
      <ul className="divide-y divide-line rounded-lg border border-line bg-surface">
        {types.map((t) => {
          const on = active.get(t);
          const required = REQUIRED[me.role].includes(t);
          return (
            <li key={t} className="flex items-start justify-between gap-6 p-5">
              <div>
                <p className="font-medium">{CONSENT_COPY[t].title}{required && <span className="ml-2 font-mono text-xs text-muted">required</span>}</p>
                <p className="mt-1 text-sm text-ink-2">{CONSENT_COPY[t].body}</p>
                {on && <p className="mt-2 font-mono text-xs text-muted">Agreed {new Date(on.granted_at).toLocaleDateString("en-GB")} · version {on.doc_version}</p>}
              </div>
              <Button variant="secondary" loading={busy === t} onClick={() => toggle(t)}>{on ? "Withdraw" : "Agree"}</Button>
            </li>
          );
        })}
      </ul>
      {REQUIRED[me.role].length > 0 && <p className="text-sm text-muted">Withdrawing a required choice pauses your account until you agree again.</p>}
    </div>
  );
}
```

- [ ] **Step 4: Run tests**

Run: `pnpm -C apps/web test && pnpm -C apps/web typecheck`
Expected: all pass.

- [ ] **Step 5: Commit**

```bash
git add apps/web
git commit -m "T-1.08 consent onboarding and consent centre with required/optional choices"
```

---

### Task 7: Two-step verification setup and admin verification queue (T-1.07 UI, T-1.06 UI)

**Files:**
- Create: `apps/web/app/(app)/settings/security/page.tsx`, `apps/web/app/(app)/admin/clinicians/page.tsx`
- Test: `apps/web/tests/unit/security.test.tsx`

**Interfaces:**
- Consumes: `POST /api/v1/me/mfa/setup`, `POST /api/v1/me/mfa/enable`, `GET /api/v1/admin/clinicians`, `GET /api/v1/admin/clinicians/{user_id}/proof`, `POST /api/v1/admin/clinicians/{user_id}/decision`.
- Produces: security page that shows a QR code (data URL via `qrcode`), the text secret, a code field, and after enabling shows 8 recovery codes once with "I've saved these"; admin page with Pending / Approved / Rejected tabs, proof viewer (opens a blob URL in a new tab), reason field, Approve and Reject buttons.

- [ ] **Step 1: Write the failing test**

`apps/web/tests/unit/security.test.tsx`
```tsx
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Security from "@/app/(app)/settings/security/page";
import { useAuth, type Me } from "@/lib/auth/store";

vi.mock("next/navigation", () => ({ useRouter: () => ({ replace: vi.fn() }) }));
vi.mock("qrcode", () => ({ default: { toDataURL: vi.fn(async () => "data:image/png;base64,AAAA") } }));

const me = { role: "admin", display_name: "Admin", mfa_enabled: false,
  onboarding: { consents_missing: [], intake_required: false, mfa_setup_required: true } } as unknown as Me;

describe("security settings", () => {
  it("walks through setup and shows recovery codes once", async () => {
    useAuth.setState({ ready: true, accessToken: "t", me });
    const fetchMock = vi.fn(async (req: Request) => {
      if (req.url.endsWith("/me/mfa/setup"))
        return new Response(JSON.stringify({ secret: "JBSWY3DPEHPK3PXP", otpauth_uri: "otpauth://totp/ZehenSync:a" }), { status: 200 });
      return new Response(JSON.stringify({ access_token: "t2", token_type: "bearer",
        user: { ...me, mfa_enabled: true, onboarding: { ...me.onboarding, mfa_setup_required: false } },
        recovery_codes: Array.from({ length: 8 }, (_, i) => `ABCDE-FGH${i}J`) }), { status: 200 });
    });
    vi.stubGlobal("fetch", fetchMock);
    render(<Security />);
    await userEvent.click(screen.getByRole("button", { name: /set up two-step verification/i }));
    await waitFor(() => expect(screen.getByAltText(/qr code/i)).toBeInTheDocument());
    expect(screen.getByText("JBSWY3DPEHPK3PXP")).toBeInTheDocument();
    await userEvent.type(screen.getByLabelText(/code from your app/i), "123456");
    await userEvent.click(screen.getByRole("button", { name: /turn on/i }));
    await waitFor(() => expect(screen.getAllByText(/ABCDE-FGH\dJ/)).toHaveLength(8));
    expect(useAuth.getState().accessToken).toBe("t2");
    vi.unstubAllGlobals();
  });
});
```

- [ ] **Step 2: Run to see it fail**

Run: `pnpm -C apps/web test tests/unit/security.test.tsx`
Expected: FAIL, cannot resolve the page module.

- [ ] **Step 3: Implement**

`apps/web/app/(app)/settings/security/page.tsx`
```tsx
"use client";
import QRCode from "qrcode";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Alert } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Field } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { api } from "@/lib/api/client";
import { errorMessage } from "@/lib/api/errors";
import { homeFor } from "@/lib/auth/routes";
import { useAuth } from "@/lib/auth/store";

export default function Security() {
  const router = useRouter();
  const me = useAuth((s) => s.me);
  const [setup, setSetup] = useState<{ secret: string; qr: string } | null>(null);
  const [code, setCode] = useState("");
  const [codes, setCodes] = useState<string[] | null>(null);
  const [err, setErr] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  if (!me) return null;

  const start = async () => {
    setBusy(true); setErr(null);
    const { data, error } = await api.POST("/api/v1/me/mfa/setup");
    setBusy(false);
    if (error || !data) return setErr(errorMessage(error));
    setSetup({ secret: data.secret, qr: await QRCode.toDataURL(data.otpauth_uri, { margin: 1, width: 200 }) });
  };

  const enable = async () => {
    setBusy(true); setErr(null);
    const { data, error } = await api.POST("/api/v1/me/mfa/enable", { body: { code } });
    setBusy(false);
    if (error || !data) return setErr(errorMessage(error));
    useAuth.getState().setSession(data.access_token, data.user);
    setCodes(data.recovery_codes);
  };

  return (
    <div className="mx-auto flex max-w-[640px] flex-col gap-6">
      <h1 className="font-serif text-4xl font-light tracking-tight">Two-step verification</h1>
      {err && <Alert tone="error">{err}</Alert>}
      {me.mfa_enabled && !codes && <Alert tone="success">Two-step verification is on for this account.</Alert>}
      {!me.mfa_enabled && !setup && (
        <>
          <p className="text-ink-2">Psychologists and admins must use an authenticator app, such as Google Authenticator or Microsoft Authenticator, before seeing anyone&apos;s data.</p>
          <Button onClick={start} loading={busy} className="self-start">Set up two-step verification</Button>
        </>
      )}
      {setup && !codes && (
        <div className="flex flex-col gap-5 rounded-lg border border-line bg-surface p-6">
          <p className="text-ink-2">Scan this with your authenticator app, or type the key.</p>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={setup.qr} alt="QR code for your authenticator app" width={200} height={200} />
          <p data-testid="totp-secret" className="font-mono text-sm break-all">{setup.secret}</p>
          <Field label="Code from your app" htmlFor="code">
            <Input id="code" value={code} onChange={(e) => setCode(e.target.value)} inputMode="numeric" className="font-mono tracking-[0.3em]" />
          </Field>
          <Button onClick={enable} loading={busy} disabled={code.trim().length < 6} className="self-start">Turn on</Button>
        </div>
      )}
      {codes && (
        <div className="flex flex-col gap-4 rounded-lg border border-line bg-surface p-6">
          <p className="font-medium">Save these recovery codes somewhere safe. Each works once if you lose your phone. We won&apos;t show them again.</p>
          <ul className="grid grid-cols-2 gap-2 font-mono">{codes.map((c) => <li key={c}>{c}</li>)}</ul>
          <Button className="self-start" onClick={() => router.replace(homeFor(useAuth.getState().me ?? me))}>I&apos;ve saved these</Button>
        </div>
      )}
    </div>
  );
}
```
`apps/web/app/(app)/admin/clinicians/page.tsx`
```tsx
"use client";
import { useCallback, useEffect, useState } from "react";
import { Alert } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { api } from "@/lib/api/client";
import { errorMessage } from "@/lib/api/errors";
import { useAuth } from "@/lib/auth/store";
import { cn } from "@/lib/cn";
import type { components } from "@/lib/api/schema";

type App = components["schemas"]["ClinicianApplication"];
type Status = "pending" | "approved" | "rejected";

export default function Clinicians() {
  const [status, setStatus] = useState<Status>("pending");
  const [rows, setRows] = useState<App[]>([]);
  const [reason, setReason] = useState<Record<string, string>>({});
  const [err, setErr] = useState<string | null>(null);

  const load = useCallback(async () => {
    const { data, error } = await api.GET("/api/v1/admin/clinicians", { params: { query: { status } } });
    if (error) return setErr(errorMessage(error));
    setRows(data ?? []);
  }, [status]);
  useEffect(() => { void load(); }, [load]);

  const viewProof = async (id: string) => {
    const r = await fetch(`/api/v1/admin/clinicians/${id}/proof`, {
      headers: { Authorization: `Bearer ${useAuth.getState().accessToken}` } });
    if (!r.ok) return setErr("Couldn't open the document.");
    window.open(URL.createObjectURL(await r.blob()), "_blank", "noopener");
  };

  const decide = async (id: string, approve: boolean) => {
    setErr(null);
    const { error } = await api.POST("/api/v1/admin/clinicians/{user_id}/decision", {
      params: { path: { user_id: id } }, body: { approve, reason: reason[id] ?? "" } });
    if (error) return setErr(errorMessage(error));
    await load();
  };

  return (
    <div className="flex flex-col gap-6">
      <h1 className="font-serif text-4xl font-light tracking-tight">Psychologist applications</h1>
      <div className="inline-flex self-start overflow-hidden rounded-md border border-line-strong text-sm font-medium" role="tablist">
        {(["pending", "approved", "rejected"] as Status[]).map((s) => (
          <button key={s} role="tab" aria-selected={status === s} onClick={() => setStatus(s)}
            className={cn("px-4 py-2 capitalize text-ink-2", status === s && "bg-accent-subtle text-accent")}>{s}</button>
        ))}
      </div>
      {err && <Alert tone="error">{err}</Alert>}
      {rows.length === 0 && <p className="text-ink-2">No {status} applications.</p>}
      <ul className="flex flex-col gap-3">
        {rows.map((a) => (
          <li key={a.user_id} className="grid grid-cols-[1fr_auto] gap-6 rounded-lg border border-line bg-surface p-5">
            <div>
              <p className="font-serif text-xl">{a.full_name}</p>
              <p className="text-sm text-ink-2">{a.institution}{a.specialty ? ` · ${a.specialty}` : ""}</p>
              <p className="mt-1 font-mono text-xs text-muted">{a.email} · licence {a.license_no ?? "not given"} · applied {new Date(a.created_at).toLocaleDateString("en-GB")}</p>
              <button className="mt-2 text-sm font-medium text-accent underline underline-offset-4" onClick={() => viewProof(a.user_id)}>View proof document</button>
            </div>
            {status === "pending" && (
              <div className="flex w-72 flex-col gap-2">
                <label htmlFor={`r-${a.user_id}`} className="text-sm font-medium">Reason</label>
                <textarea id={`r-${a.user_id}`} rows={2} className="rounded-md border border-line-strong p-2 text-sm"
                  value={reason[a.user_id] ?? ""} onChange={(e) => setReason((r) => ({ ...r, [a.user_id]: e.target.value }))} />
                <div className="flex gap-2">
                  <Button disabled={(reason[a.user_id] ?? "").trim().length < 3} onClick={() => decide(a.user_id, true)}>Approve</Button>
                  <Button variant="secondary" disabled={(reason[a.user_id] ?? "").trim().length < 3} onClick={() => decide(a.user_id, false)}>Reject</Button>
                </div>
              </div>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}
```

- [ ] **Step 4: Run tests, typecheck, build**

Run: `pnpm -C apps/web test && pnpm -C apps/web typecheck && pnpm -C apps/web build`
Expected: all unit tests pass; build succeeds.

- [ ] **Step 5: Commit**

```bash
git add apps/web
git commit -m "T-1.07 T-1.06 two-step verification setup with recovery codes, admin clinician verification queue"
```

---

### Task 8: End-to-end tests, CI, docs and phase exit (T-1.14)

**Files:**
- Create: `apps/web/playwright.config.ts`, `apps/web/tests/e2e/global-setup.ts`, `apps/web/tests/e2e/totp.ts`, `apps/web/tests/e2e/fixtures/licence.pdf`, `apps/web/tests/e2e/signup.spec.ts`, `apps/web/tests/e2e/verification.spec.ts`, `.github/workflows/ci.yml`
- Modify: `README.md` (run instructions), `docs/05-Planning/Tracker.md` (T-1.10–T-1.14 done), `docs/05-Planning/RTM.md` (TC-E-001, TC-E-002, TC-E-009 → spec names), `docs/02-Engineering/TRD.md` §2 (Next.js 16.3), `docs/06-Memory/Decisions.md` (ADR-017), `docs/06-Memory/Memory.md` (phase status)

**Interfaces:**
- Consumes: everything above; P1-A CLI `create-admin`.
- Produces: `pnpm -C apps/web e2e` green locally and in CI; CI jobs `api`, `web`, `e2e`.

- [ ] **Step 1: TOTP helper and fixtures**

`apps/web/tests/e2e/totp.ts`
```ts
import { createHmac } from "node:crypto";

function base32(s: string): Buffer {
  const A = "ABCDEFGHIJKLMNOPQRSTUVWXYZ234567";
  let bits = "";
  for (const c of s.replace(/=+$/, "").toUpperCase()) bits += A.indexOf(c).toString(2).padStart(5, "0");
  const bytes = bits.match(/.{8}/g) ?? [];
  return Buffer.from(bytes.map((b) => parseInt(b, 2)));
}

export function totp(secret: string, now: number = Date.now()): string {
  const counter = Buffer.alloc(8);
  counter.writeBigUInt64BE(BigInt(Math.floor(now / 1000 / 30)));
  const h = createHmac("sha1", base32(secret)).update(counter).digest();
  const o = (h[h.length - 1] ?? 0) & 0xf;
  const n = ((h.readUInt32BE(o) & 0x7fffffff) % 1_000_000).toString();
  return n.padStart(6, "0");
}
```
`apps/web/tests/e2e/fixtures/licence.pdf`: a minimal valid PDF, created with
```bash
printf '%%PDF-1.4\n1 0 obj<<>>endobj\ntrailer<<>>\n%%%%EOF\n' > apps/web/tests/e2e/fixtures/licence.pdf
```
`apps/web/tests/e2e/global-setup.ts`
```ts
import { execSync } from "node:child_process";
import path from "node:path";

export default function globalSetup() {
  const api = path.resolve(__dirname, "../../../api");
  execSync("uv run alembic upgrade head", { cwd: api, stdio: "inherit" });
  process.env.E2E_ADMIN_EMAIL = `admin+${Date.now()}@zehensync.test`;
  execSync(`uv run python -m app.cli create-admin ${process.env.E2E_ADMIN_EMAIL} "E2E Admin"`, {
    cwd: api, stdio: "inherit", env: { ...process.env, ZS_ADMIN_PASSWORD: "e2e admin long password" } });
}
```
`apps/web/playwright.config.ts`
```ts
import { defineConfig, devices } from "@playwright/test";

export default defineConfig({
  testDir: "tests/e2e",
  globalSetup: "./tests/e2e/global-setup.ts",
  fullyParallel: false,
  workers: 1,
  use: { baseURL: "http://localhost:3000", viewport: { width: 1440, height: 900 }, trace: "retain-on-failure" },
  projects: [{ name: "chromium", use: { ...devices["Desktop Chrome"], viewport: { width: 1440, height: 900 } } }],
  webServer: [
    { command: "uv run uvicorn app.main:app --port 8000", cwd: "../api", url: "http://localhost:8000/health",
      reuseExistingServer: !process.env.CI, env: { ZS_AUTH_RATE_LIMIT_PER_MINUTE: "1000" } },
    { command: process.env.CI ? "pnpm start" : "pnpm dev", url: "http://localhost:3000/login",
      reuseExistingServer: !process.env.CI },
  ],
});
```

- [ ] **Step 2: Write the E2E specs**

`apps/web/tests/e2e/signup.spec.ts`
```ts
import { expect, test } from "@playwright/test";
import path from "node:path";

const pw = "a long enough password";
const uniq = () => `${Date.now()}${Math.floor(Math.random() * 1000)}`;

test("person seeking support signs up, consents and lands home", async ({ page }) => {
  await page.goto("/signup");
  await page.getByRole("link", { name: /looking for support/i }).click();
  await page.getByLabel("What should we call you?").fill("Sana");
  await page.getByLabel("Email").fill(`sana+${uniq()}@example.com`);
  await page.getByLabel("Password").fill(pw);
  await page.getByLabel("Year you were born").fill("2000");
  await page.getByRole("button", { name: "Create account" }).click();
  await expect(page).toHaveURL(/\/onboarding\/consents/);
  for (const cb of await page.getByRole("checkbox").all()) await cb.check();
  await page.getByRole("button", { name: /accept and continue/i }).click();
  await expect(page).toHaveURL(/\/home$/);
  await expect(page.getByRole("heading", { name: "Hi, Sana." })).toBeVisible();
  await expect(page.getByRole("link", { name: /get help now/i })).toBeVisible();
  await page.reload();
  await expect(page.getByRole("heading", { name: "Hi, Sana." })).toBeVisible();
});

test("scholar signs up and lands in the scholar area", async ({ page }) => {
  await page.goto("/signup");
  await page.getByRole("link", { name: /student or researcher/i }).click();
  await page.getByLabel("What should we call you?").fill("Raza");
  await page.getByLabel("Email").fill(`raza+${uniq()}@example.com`);
  await page.getByLabel("Password").fill(pw);
  await page.getByLabel("Year you were born").fill("2003");
  await page.getByRole("button", { name: "Create account" }).click();
  for (const cb of await page.getByRole("checkbox").all()) await cb.check();
  await page.getByRole("button", { name: /accept and continue/i }).click();
  await expect(page).toHaveURL(/\/scholar$/);
  await page.goto("/home");
  await expect(page).toHaveURL(/\/scholar$/);
});

test("under-18 never gets an account", async ({ page }) => {
  await page.goto("/signup/support");
  await page.getByLabel("What should we call you?").fill("Kid");
  await page.getByLabel("Email").fill(`kid+${uniq()}@example.com`);
  await page.getByLabel("Password").fill(pw);
  await page.getByLabel("Year you were born").fill(String(new Date().getFullYear() - 15));
  await page.getByRole("button", { name: "Create account" }).click();
  await expect(page).toHaveURL(/\/under-18$/);
});

test("clinician applies and waits for review", async ({ page }) => {
  await page.goto("/signup");
  await page.getByRole("link", { name: /apply for a verified account/i }).click();
  await page.getByLabel("Full name, as on your licence").fill("Ayesha Khan");
  await page.getByLabel("Display name").fill("Dr Khan");
  await page.getByLabel("Clinic, hospital or department").fill("UCP Counselling Centre");
  await page.getByLabel("Work email").fill(`khan+${uniq()}@example.com`);
  await page.getByLabel("Password").fill(pw);
  await page.getByLabel("Year you were born").fill("1985");
  await page.getByLabel(/licence or staff id/i).setInputFiles(path.join(__dirname, "fixtures/licence.pdf"));
  await page.getByRole("button", { name: "Send application" }).click();
  await expect(page).toHaveURL(/\/onboarding\/consents/);
  await page.getByRole("checkbox").check();
  await page.getByRole("button", { name: /accept and continue/i }).click();
  await expect(page).toHaveURL(/\/clinician\/pending$/);
  await expect(page.getByRole("heading", { name: /checking your details/i })).toBeVisible();
});
```
`apps/web/tests/e2e/verification.spec.ts`
```ts
import { expect, test } from "@playwright/test";
import path from "node:path";
import { totp } from "./totp";

test("admin turns on 2FA and approves a clinician", async ({ page, browser }) => {
  const email = `khan+${Date.now()}@example.com`;
  const applicant = await browser.newPage();
  await applicant.goto("/signup/clinician");
  await applicant.getByLabel("Full name, as on your licence").fill("Bilal Ahmed");
  await applicant.getByLabel("Display name").fill("Dr Bilal");
  await applicant.getByLabel("Clinic, hospital or department").fill("Lahore General");
  await applicant.getByLabel("Work email").fill(email);
  await applicant.getByLabel("Password").fill("a long enough password");
  await applicant.getByLabel("Year you were born").fill("1980");
  await applicant.getByLabel(/licence or staff id/i).setInputFiles(path.join(__dirname, "fixtures/licence.pdf"));
  await applicant.getByRole("button", { name: "Send application" }).click();
  await expect(applicant).toHaveURL(/\/onboarding\/consents/);
  await applicant.close();

  await page.goto("/login");
  await page.getByLabel("Email").fill(process.env.E2E_ADMIN_EMAIL ?? "");
  await page.getByLabel("Password").fill("e2e admin long password");
  await page.getByRole("button", { name: "Sign in" }).click();
  await expect(page).toHaveURL(/\/settings\/security$/);
  await page.getByRole("button", { name: /set up two-step verification/i }).click();
  const secret = (await page.getByTestId("totp-secret").textContent())?.trim() ?? "";
  await page.getByLabel("Code from your app").fill(totp(secret));
  await page.getByRole("button", { name: "Turn on" }).click();
  await page.getByRole("button", { name: /saved these/i }).click();
  await expect(page).toHaveURL(/\/admin\/clinicians$/);

  const card = page.getByRole("listitem").filter({ hasText: email });
  await card.getByLabel("Reason").fill("Licence checked with PMDC");
  await card.getByRole("button", { name: "Approve" }).click();
  await page.getByRole("tab", { name: "approved" }).click();
  await expect(page.getByText(email, { exact: false })).toBeVisible();
});
```

- [ ] **Step 3: Run E2E locally**

Run (with `pnpm db:up` done): `pnpm -C apps/web exec playwright install chromium && pnpm -C apps/web e2e`
Expected: `5 passed`.

- [ ] **Step 4: CI workflow**

`.github/workflows/ci.yml`
```yaml
name: ci
on:
  push:
  pull_request:

env:
  ZS_ENV: test
  ZS_DB_OWNER_PASSWORD: postgres
  ZS_DB_APP_PASSWORD: zs_ci_app

jobs:
  api:
    runs-on: ubuntu-latest
    services:
      postgres:
        image: pgvector/pgvector:pg16
        env: { POSTGRES_USER: postgres, POSTGRES_PASSWORD: postgres, POSTGRES_DB: zehensync }
        ports: ["5432:5432"]
        options: --health-cmd "pg_isready -U postgres" --health-interval 5s --health-retries 20
      redis:
        image: redis:7-alpine
        ports: ["6379:6379"]
    defaults: { run: { working-directory: apps/api } }
    steps:
      - uses: actions/checkout@v4
      - uses: astral-sh/setup-uv@v6
      - run: uv sync --frozen
      - run: uv run ruff check .
      - run: uv run mypy app
      - run: uv run pytest -q

  web:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: pnpm/action-setup@v4
      - uses: actions/setup-node@v4
        with: { node-version: 24, cache: pnpm }
      - run: pnpm install --frozen-lockfile
      - run: pnpm -C apps/web lint
      - run: pnpm -C apps/web typecheck
      - run: pnpm -C apps/web test
      - run: pnpm -C apps/web build

  e2e:
    needs: [api, web]
    runs-on: ubuntu-latest
    env: { CI: "true", ZS_ENV: dev }
    services:
      postgres:
        image: pgvector/pgvector:pg16
        env: { POSTGRES_USER: postgres, POSTGRES_PASSWORD: postgres, POSTGRES_DB: zehensync }
        ports: ["5432:5432"]
        options: --health-cmd "pg_isready -U postgres" --health-interval 5s --health-retries 20
      redis:
        image: redis:7-alpine
        ports: ["6379:6379"]
    steps:
      - uses: actions/checkout@v4
      - uses: astral-sh/setup-uv@v6
      - run: uv sync --frozen
        working-directory: apps/api
      - uses: pnpm/action-setup@v4
      - uses: actions/setup-node@v4
        with: { node-version: 24, cache: pnpm }
      - run: pnpm install --frozen-lockfile
      - run: pnpm -C apps/web build
      - run: pnpm -C apps/web exec playwright install --with-deps chromium
      - run: pnpm -C apps/web e2e
      - if: failure()
        uses: actions/upload-artifact@v4
        with: { name: playwright-report, path: apps/web/playwright-report }
```

- [ ] **Step 5: Docs, tracker, decisions, memory**

Append ADR-017 to `docs/06-Memory/Decisions.md`:
```markdown

## ADR-017
**Next.js 16 and a same-origin API rewrite**
**Date:** 2026-09-29 · **Status:** accepted
**Context:** the TRD named Next.js 15; 16.3 is the current stable release when P1 starts. The refresh cookie is `SameSite=Strict` on `/api/v1/auth`.
**Decision:** use Next.js 16.3 with React 19.3 and TypeScript 5.9 (not TS 7 yet). The web app proxies `/api/*` to FastAPI so the browser sees one origin; no CORS, and the refresh cookie just works. The access token stays in memory.
**Consequences:** the API must be reachable from the Next.js server at `API_ORIGIN`; deployments put both behind one domain.
```
Update `README.md` "Where things live" status line to Phase 1 and add a "Run it" section:
```markdown
## Run it

    pnpm install
    pnpm db:up
    cd apps/api && cp .env.example .env && uv sync && uv run alembic upgrade head && cd ../..
    (cd apps/api && uv run uvicorn app.main:app --reload)   # terminal 1
    pnpm -C apps/web dev                                     # terminal 2 → http://localhost:3000
```
Mark T-0.06 and T-1.01–T-1.15 `[x]` in `docs/05-Planning/Tracker.md`; update `docs/06-Memory/Memory.md` "Now" to P1 complete pending exit review; set RTM rows F-PL-01..06, F-PT-01 to `done` with their test names.

- [ ] **Step 6: Phase exit check**

Run: `cd apps/api && uv run pytest -q && cd ../.. && pnpm -C apps/web lint && pnpm -C apps/web typecheck && pnpm -C apps/web test && pnpm -C apps/web e2e`
Expected: everything green. P1 exit criteria from Phases.md: patient, scholar and clinician sign up and land in their area (E2E), scholar DB role cannot select from `patient.*` (pytest `test_scholar_role_cannot_touch_patient_schema`), audit chain verifies (`test_audit_append_links_hashes`).

- [ ] **Step 7: Commit, push, open for review**

```bash
git add .
git commit -m "T-1.14 end-to-end tests, CI for api/web/e2e, P1 docs and tracker"
git push -u origin phase/p1-foundation
```
Merge into `main` and tag `v0.2.0` only after Hamza reviews the running app and CI is green.
