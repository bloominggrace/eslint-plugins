import type { ESLint } from 'eslint';

import orderRule from './rules/ordering.js';

export default {
  meta: {
    name: 'eslint-plugin-tailwindcss-categorized',
    version: '0.1.0',
  },
  rules: {
    ordering: orderRule,
  },
} satisfies ESLint.Plugin;
