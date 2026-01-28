import type { Rule } from 'eslint';
import type { CallExpression } from 'estree';

import { isFunctionCall } from '@/utils/ast';
import { checkClassArray, checkCvaOptions } from '@/utils/checker';

const rule: Rule.RuleModule = {
  meta: {
    type: 'suggestion',
    docs: {
      description: 'cn() 함수 및 cva() 내 배열의 클래스가 카테고리 순서대로 배치되어 있는지 검사',
      recommended: false,
    },
    fixable: 'code',
    messages: {
      unorderedArguments: '클래스 순서가 카테고리 순서와 맞지 않습니다. 올바른 순서: {{expected}}',
      misplacedClass:
        '"{{className}}"이(가) 잘못된 줄에 있습니다. {{expected}} 줄로 이동하세요. (현재: {{current}} 줄)',
    },
  },

  create(context) {
    return {
      CallExpression(node: CallExpression) {
        if (isFunctionCall(node, 'cn')) {
          checkClassArray(node.arguments, node, context);
          return;
        }

        if (isFunctionCall(node, 'cva')) {
          if (node.arguments.length >= 2 && node.arguments[1].type === 'ObjectExpression') {
            checkCvaOptions(node.arguments[1], context);
          }
        }
      },
    };
  },
};

export default rule;
