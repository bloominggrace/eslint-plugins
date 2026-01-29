import { type Rule } from 'eslint';
import type { CallExpression } from 'estree';

import { validateClassNames, validateCvaOptions } from '@/utils/validaters';

export function isCallTo(node: CallExpression, name: string): boolean {
  return node.type === 'CallExpression' && node.callee.type === 'Identifier' && node.callee.name === name;
}

export default {
  meta: {
    type: 'suggestion',
    docs: {
      description: 'cn() 및 cva()의 클래스들이 정의된 카테고리에 맞게 배치되었는지 검사',
      recommended: false,
    },
    fixable: 'code',
    messages: {
      unorderedCategories: '카테고리 정렬 오류입니다. (권장 순서: {{expected}})',
      misplacedClass: "'{{className}}'의 카테고리가 올바르지 않습니다.",
    },
  },

  create(context) {
    return {
      CallExpression(node: CallExpression) {
        if (isCallTo(node, 'cn')) {
          validateClassNames(node.arguments, node, context);
        } else if (isCallTo(node, 'cva')) {
          const [base, options] = node.arguments;

          if (base) {
            validateClassNames(base.type === 'ArrayExpression' ? base.elements : [base], node, context);
          }

          if (options?.type === 'ObjectExpression') {
            validateCvaOptions(options, context);
          }
        }
      },
    };
  },
} satisfies Rule.RuleModule;
