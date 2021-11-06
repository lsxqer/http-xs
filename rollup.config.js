import ts2 from "rollup-plugin-typescript2";
import { getBabelOutputPlugin, babel } from "@rollup/plugin-babel";
import resolve from "rollup-plugin-node-resolve";
import commonjs from "rollup-plugin-commonjs";
import { eslint } from "rollup-plugin-eslint";
import { uglify } from "rollup-plugin-uglify";
import nodePolyfills from "rollup-plugin-node-polyfills";
import pkg from "./package.json";

export default {
  input: "./src/index.ts",
  plugins: [
    resolve({
      preferBuiltins: true
    }),
    commonjs(),
    nodePolyfills(),
    eslint({
      fix: true,
      throwOnError: true,
      throwOnWarning: true,
      include: ["./src/**/*.ts", "./scr/*.ts"],
      exclude: ["node_modules", "./dev"]
    }),
    ts2({
      exclude: "./node_modules",
      clean: true,
      tsconfig: "./tsconfig.json",
      useTsconfigDeclarationDir: true
    }),
    babel({
      configFile: "./.babelrc",
      babelHelpers: "runtime"
    }),
    uglify()
  ],
  output: [
    {
      //@ esm
      file: pkg.module,
      format: "es",
      plugins: [getBabelOutputPlugin({
        allowAllFormats: true
      })],
      sourcemap: true
    },
    {
      //@ umd
      file: pkg.browser,
      plugins: [getBabelOutputPlugin({
        allowAllFormats: true
      })],
      name: "xs",
      format: "umd",
      exports: "named",
      esModule: false,
      sourcemap: true
    }
  ]
};
