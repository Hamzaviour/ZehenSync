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
