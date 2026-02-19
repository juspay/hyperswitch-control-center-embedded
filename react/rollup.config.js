import typescript from "rollup-plugin-typescript2";
import terser from "@rollup/plugin-terser";
import resolve from "@rollup/plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs";
import replace from "@rollup/plugin-replace";

export default {
  input: "src/index.tsx",
  output: [
    {
      file: "dist/index.js",
      format: "cjs",
      sourcemap: true,
    },
    {
      file: "dist/index.esm.js",
      format: "esm",
      sourcemap: true,
    },
    {
      file: "dist/index.umd.js",
      format: "umd",
      name: "HyperswitchReact",
      sourcemap: true,
      globals: {
        react: "React",
        "react-dom": "ReactDOM",
        "@juspay-tech/hyper-dashboard-embed-core": "Hyperswitch",
      },
    },
    {
      file: "dist/index.min.js",
      format: "umd",
      name: "HyperswitchReact",
      sourcemap: true,
      plugins: [terser()],
      globals: {
        react: "React",
        "react-dom": "ReactDOM",
        "@juspay-tech/hyper-dashboard-embed-core": "Hyperswitch",
      },
    },
  ],
  plugins: [
    typescript({
      tsconfig: "./tsconfig.json",
      clean: true,
      typescript: require("typescript"),
      useTsconfigDeclarationDir: false,
      check: false, // Type checking is done separately with tsc --noEmit to properly resolve workspace packages
    }),
    resolve({ preferBuiltins: false, browser: true }),
    commonjs(),
    replace({
      "process.env.NODE_ENV": JSON.stringify(process.env.NODE_ENV),
      preventAssignment: true,
    }),
  ],
  external: [
    "react",
    "react-dom",
    "react/jsx-runtime",
    "@juspay-tech/hyper-dashboard-embed-core",
  ],
};
