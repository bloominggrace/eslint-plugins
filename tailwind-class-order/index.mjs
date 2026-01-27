import orderRule from "./rules/order.mjs";

/** @type {import('eslint').ESLint.Plugin} */
export default {
  meta: {
    name: "eslint-plugin-tailwind-class-order",
    version: "1.0.0",
  },
  rules: {
    order: orderRule,
  },
};
