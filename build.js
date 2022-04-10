const esbuild = require("esbuild");
const { exec } = require("child_process");

const format = ["cjs", "iife", "esm"];
// "build": "node ./clear.js && rollup --config ./rollup.config.js ",

exec("node ./clear.js", (err) => {

  err !== null && console.log(err);
  format.forEach(f => {
    esbuild.build({
      entryPoints: ["./src/index.ts"],
      external: ["https", "http", "events"],
      bundle: true,
      outdir: `./lib/${f}`,
      format: f,
      globalName: "xs",
      target: [
        'es6',
        'node12',
        // "ie11"
      ]
      // minify:true,
      // platform:"node"
    });
  });
});
