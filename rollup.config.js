import ts2 from "rollup-plugin-typescript2";
import pkg from "./package.json";

export default {
  input: "./src/index.ts",
  plugins: [
    ts2({
      exclude: "./node_modules",
      clean: true,
      tsconfig: "./tsconfig.json",
      useTsconfigDeclarationDir: true,
    }),
  ],
  output: [
    {
      file: pkg.module,
      format: "es",
      sourcemap: true
    },
    {
      file: pkg.browser,
      name: "xs",
      format: "umd",
      exports: "named",
      esModule: false,
      sourcemap: true
    }
  ]
};
