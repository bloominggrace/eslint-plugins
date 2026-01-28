import type { ESLint } from 'eslint';

import pkg from '../package.json';
import orderRule from './rules/order';

export default {
  meta: {
    name: pkg.name,
    version: pkg.version,
  },
  rules: {
    order: orderRule,
  },
} satisfies ESLint.Plugin;
