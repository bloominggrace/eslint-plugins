import pkg from "./package.json" with { type: "json" };
import orderRule from "./rules/order.mjs";

/** @type {import('eslint').ESLint.Plugin} */
export default {
  meta: {
    name: pkg.name,
    version: pkg.version,
  },
  rules: {
    order: orderRule,
  },
};
