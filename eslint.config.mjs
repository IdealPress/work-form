import nextCoreWebVitals from "eslint-config-next/core-web-vitals";

// Note: ESLint is held at 9.x. eslint-config-next 16.3.0 still ships plugins and a
// parser that use APIs removed in ESLint 10 (scopeManager.addGlobals,
// context.getFilename), so ESLint 10 crashes before linting any file.
const eslintConfig = [
  { ignores: [".next/**", "out/**", "node_modules/**"] },
  ...nextCoreWebVitals,
];

export default eslintConfig;
