import babel from "rollup-plugin-babel";
import resolve from "rollup-plugin-node-resolve";
import commonjs from "rollup-plugin-commonjs";
import json from "rollup-plugin-json";
import sourceMaps from "rollup-plugin-sourcemaps";
import camelcase from "camelcase";

import pkg from "./package.json";

const extensions = [".js" /* ".jsx", ".ts", ".tsx" */];

function getPkgName() {
  const matched = /^(?:@[^/@]+\/)?([^/@]+)/.exec(pkg.name);
  const rawPkgName = matched[1];
  if (!rawPkgName) {
    throw new URIError(`Failed to parse package.name: ${pkg.name}`);
  }
  return camelcase(rawPkgName);
}

// const isProd = process.env.NODE_ENV === "production";

/** @type {import("rollup").Plugin[]} */
const commonPlugins = [
  resolve({ extensions }),

  sourceMaps(),

  json(),

  commonjs({
    include: "node_modules/**",
    extensions,
    ignoreGlobal: true
  }),

  babel({ extensions, include: ["src/**/*"] })
];

/** @type {import("rollup").RollupOptions} */
const baseConfig = {
  input: "src/index.js",
  plugins: commonPlugins
};

const CjsConfig = Object.assign({}, baseConfig, {
  output: {
    // exports: "named",
    file: pkg.main,
    format: "cjs"
  }
});

const EsmConfig = Object.assign({}, baseConfig, {
  output: {
    file: pkg.module,
    format: "esm"
  }
});

const BrowserConfig = Object.assign({}, baseConfig, {
  output: {
    name: getPkgName(),
    file: pkg.browser,
    format: "iife"
  }
});

export default [CjsConfig, EsmConfig, BrowserConfig];
