import type { ESLint } from 'eslint';

import pkg from '../package.json';
import orderRule from './rules/ordering';

export default {
  meta: {
    name: pkg.name,
    version: pkg.version,
  },
  rules: {
    ordering: orderRule,
  },
} satisfies ESLint.Plugin;
