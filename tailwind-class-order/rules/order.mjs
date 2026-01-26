import { CATEGORY_ORDER, getClassCategory } from '../utils/categories.mjs';
import { parseClasses } from '../utils/sorter.mjs';

/**
 * 카테고리 번호로 카테고리 이름 찾기
 * @param {number} cat
 * @returns {string}
 */
function getCategoryName(cat) {
  for (const [name, order] of Object.entries(CATEGORY_ORDER)) {
    if (order === cat) return name;
  }
  return 'CUSTOM';
}

/**
 * AST 노드가 특정 함수 호출인지 확인
 * @param {import('estree').CallExpression} node
 * @param {string} functionName
 * @returns {boolean}
 */
function isFunctionCall(node, functionName) {
  if (node.type !== 'CallExpression') {
    return false;
  }
  if (node.callee.type === 'Identifier' && node.callee.name === functionName) {
    return true;
  }
  return false;
}

/**
 * 문자열 리터럴 노드에서 값 추출
 * @param {import('estree').Node} node
 * @returns {string | null}
 */
function getStringValue(node) {
  if (node.type === 'Literal' && typeof node.value === 'string') {
    return node.value;
  }
  if (node.type === 'TemplateLiteral' && node.quasis.length === 1 && node.expressions.length === 0) {
    return node.quasis[0].value.cooked;
  }
  return null;
}

/**
 * 인자의 대표 카테고리 결정 (첫 번째 클래스 기준)
 * @param {string} classString
 * @returns {number}
 */
function getArgumentCategory(classString) {
  const classes = parseClasses(classString);
  if (classes.length === 0) {
    return CATEGORY_ORDER.CUSTOM;
  }
  return getClassCategory(classes[0]);
}

/**
 * 인자 배열이 올바른 순서인지 확인
 * @param {Array<{category: number}>} args
 * @returns {boolean}
 */
function isInCorrectOrder(args) {
  for (let i = 1; i < args.length; i++) {
    if (args[i].category < args[i - 1].category) {
      return false;
    }
  }
  return true;
}

/** @type {import('eslint').Rule.RuleModule} */
export default {
  meta: {
    type: 'suggestion',
    docs: {
      description: 'cn() 함수 및 cva() 내 배열의 클래스가 카테고리 순서대로 배치되어 있는지 검사',
      category: 'Stylistic Issues',
      recommended: false,
    },
    fixable: 'code',
    schema: [
      {
        type: 'object',
        properties: {
          functions: {
            type: 'array',
            items: { type: 'string' },
          },
        },
        additionalProperties: false,
      },
    ],
    messages: {
      unorderedArguments: '클래스 순서가 카테고리 순서와 맞지 않습니다. 올바른 순서: {{expected}}',
      misplacedClass:
        '"{{className}}"이(가) 잘못된 줄에 있습니다. {{expected}} 줄로 이동하세요. (현재: {{current}} 줄)',
    },
  },

  create(context) {
    /**
     * 문자열 배열(또는 cn() 인자들)을 검사하는 공통 로직
     * @param {import('estree').Node[]} elements - 배열 요소들 또는 함수 인자들
     * @param {import('estree').Node} parentNode - 부모 노드 (에러 리포트용)
     */
    function checkClassArray(elements, parentNode) {
      /** @type {Array<{node: import('estree').Node, text: string, category: number, index: number, isString: boolean}>} */
      const allItems = [];

      for (let i = 0; i < elements.length; i++) {
        const element = elements[i];
        const text = context.sourceCode.getText(element);
        const stringValue = getStringValue(element);

        if (stringValue !== null && stringValue.trim() !== '') {
          allItems.push({
            node: element,
            text,
            category: getArgumentCategory(stringValue),
            index: i,
            isString: true,
          });
        } else {
          // 비문자열 (조건부, 변수, 함수 호출 등) - CVA 카테고리로 취급
          allItems.push({
            node: element,
            text,
            category: CATEGORY_ORDER.CVA,
            index: i,
            isString: false,
          });
        }
      }

      if (allItems.length <= 1) {
        return;
      }

      // 1. 각 줄 내에 다른 카테고리 클래스가 있는지 검사
      for (const item of allItems) {
        if (!item.isString) continue;

        const stringValue = getStringValue(item.node);
        if (!stringValue) continue;

        const classes = parseClasses(stringValue);
        if (classes.length <= 1) continue;

        const lineCategory = item.category; // 첫 번째 클래스의 카테고리

        for (const cls of classes) {
          const clsCategory = getClassCategory(cls);
          if (clsCategory !== lineCategory) {
            context.report({
              node: item.node,
              messageId: 'misplacedClass',
              data: {
                className: cls,
                expected: getCategoryName(clsCategory),
                current: getCategoryName(lineCategory),
              },
            });
          }
        }
      }

      if (isInCorrectOrder(allItems)) {
        return;
      }

      const sorted = [...allItems].sort((a, b) => {
        if (a.category !== b.category) {
          return a.category - b.category;
        }
        return a.index - b.index;
      });

      const expectedOrder = sorted.map((item) => `${getCategoryName(item.category)}`).join(' → ');

      context.report({
        node: parentNode,
        messageId: 'unorderedArguments',
        data: {
          expected: expectedOrder,
        },
        fix(fixer) {
          // 요소들을 정렬된 순서로 재배치
          const sortedTexts = sorted.map((item) => item.text);

          // 원본 요소들의 시작과 끝 위치
          const firstElement = elements[0];
          const lastElement = elements[elements.length - 1];

          // 각 요소 사이의 구분자 추출
          const separators = [];
          for (let i = 0; i < elements.length - 1; i++) {
            const currentEnd = elements[i].range[1];
            const nextStart = elements[i + 1].range[0];
            const separator = context.sourceCode.getText().slice(currentEnd, nextStart);
            separators.push(separator);
          }

          // 정렬된 요소들을 원본 구분자와 함께 조합
          let newText = sortedTexts[0];
          for (let i = 1; i < sortedTexts.length; i++) {
            // 구분자가 있으면 사용, 없으면 기본값
            const separator = separators[i - 1] || ',\n        ';
            newText += separator + sortedTexts[i];
          }

          return fixer.replaceTextRange([firstElement.range[0], lastElement.range[1]], newText);
        },
      });
    }

    /**
     * cva() 내부의 variants 객체에서 배열들을 찾아 검사
     * @param {import('estree').ObjectExpression} optionsNode
     */
    function checkCvaOptions(optionsNode) {
      for (const prop of optionsNode.properties) {
        if (prop.type !== 'Property') continue;
        if (prop.key.type !== 'Identifier' || prop.key.name !== 'variants') continue;
        if (prop.value.type !== 'ObjectExpression') continue;

        // variants 객체 내부 탐색
        for (const variantProp of prop.value.properties) {
          if (variantProp.type !== 'Property') continue;
          if (variantProp.value.type !== 'ObjectExpression') continue;

          // 각 variant 옵션 탐색
          for (const optionProp of variantProp.value.properties) {
            if (optionProp.type !== 'Property') continue;

            // 배열인 경우 검사
            if (optionProp.value.type === 'ArrayExpression') {
              const elements = optionProp.value.elements.filter((el) => el !== null);
              if (elements.length > 1) {
                checkClassArray(elements, optionProp.value);
              }
            }
          }
        }
      }
    }

    return {
      CallExpression(node) {
        if (isFunctionCall(node, 'cn')) {
          checkClassArray(node.arguments, node);
          return;
        }

        if (isFunctionCall(node, 'cva')) {
          if (node.arguments.length >= 2 && node.arguments[1].type === 'ObjectExpression') {
            checkCvaOptions(node.arguments[1]);
          }
        }
      },
    };
  },
};
