import type { ESLint } from "eslint";
import pkg from "../package.json" with { type: "json" };
import orderRule from "./rules/order";

const plugin: ESLint.Plugin = {
  meta: {
    name: pkg.name,
    version: pkg.version,
  },
  rules: {
    order: orderRule,
  },
};

export default plugin;
