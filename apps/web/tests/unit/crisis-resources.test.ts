import { readFileSync } from "node:fs";
import path from "node:path";
import { crisisResources } from "@/lib/crisis/resources";

const protocol = readFileSync(path.resolve(__dirname, "../../../../docs/07-Clinical/Safety-Protocol.md"), "utf8");

describe("crisis resources", () => {
  it("lists exactly the four numbers approved in Safety-Protocol", () => {
    expect(crisisResources.map((r) => r.display)).toEqual(["0311 7786264", "0304 111 1741", "1122", "115"]);
  });
  it("matches every number and name on the protocol page", () => {
    for (const r of crisisResources) {
      expect(protocol).toContain(r.display);
      expect(protocol).toContain(r.name);
    }
  });
  it("builds tel links that dial the displayed digits", () => {
    for (const r of crisisResources) expect(r.tel).toBe(r.display.replace(/\s/g, ""));
  });
});
