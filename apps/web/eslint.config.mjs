import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const config = [
  ...nextVitals,
  ...nextTs,
  { ignores: [".next/**", "next-env.d.ts"] },
  { rules: { "no-restricted-syntax": ["error", { selector: "Literal[value=/^#[0-9a-fA-F]{3,8}$/]",
      message: "Use design tokens, not raw hex." }] } },
];

export default config;
