import orderRule from "./rules/order.mjs";
import pkg from "./package.json";

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
