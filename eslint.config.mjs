import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";
import prettier from "eslint-config-prettier";

/**
 * ESLint — hält den Code sauber und den Agenten ehrlich.
 * Prettier steht ganz am Ende, damit es Formatierungs-Regeln abschaltet
 * (Prettier formatiert, ESLint prüft Logik — sie streiten sich nicht).
 */
const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  {
    rules: {
      // Nichts Ungenutztes liegen lassen (führende _ sind erlaubt).
      "@typescript-eslint/no-unused-vars": [
        "error",
        { argsIgnorePattern: "^_", varsIgnorePattern: "^_" },
      ],
      // Kein `any` einschleusen.
      "@typescript-eslint/no-explicit-any": "warn",
      // console.log vergessen? -> Warnung. warn/error sind ok.
      "no-console": ["warn", { allow: ["warn", "error"] }],
      // React Hooks korrekt benutzen.
      "react-hooks/exhaustive-deps": "warn",
      // Wir hydraten bewusst aus localStorage im Effect (SSR-sicher) und
      // resetten Formulare im Effect -> als Hinweis, nicht als Fehler.
      "react-hooks/set-state-in-effect": "warn",
    },
  },
  prettier,
  globalIgnores([".next/**", "out/**", "build/**", "next-env.d.ts"]),
]);

export default eslintConfig;
