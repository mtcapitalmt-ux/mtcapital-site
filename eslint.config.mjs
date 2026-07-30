import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  {
    rules: {
      // Mecaniza a regra de não injetar HTML bruto, que hoje dependia de
      // disciplina. Exceção única e explícita, ainda não implementada: o
      // JSON-LD da Task 6, que precisa de um <script
      // type="application/ld+json">. Quando essa task for feita, o trecho
      // recebe uma desativação pontual da regra, na linha, com justificativa.
      "react/no-danger": "error",
    },
  },
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
  ]),
]);

export default eslintConfig;
