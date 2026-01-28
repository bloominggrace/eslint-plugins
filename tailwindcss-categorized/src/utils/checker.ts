import type { Rule } from 'eslint';
import type { Node, ObjectExpression, SpreadElement } from 'estree';

import { getStringValue } from './ast';
import { CATEGORY_ORDER, getArgumentCategory, getCategoryName, getClassCategory } from './categories';
import { parseClasses } from './sorter';

interface ClassItem {
  node: Node;
  text: string;
  category: number;
  index: number;
  isString: boolean;
}

function isCorrectOrder(args: Array<{ category: number }>): boolean {
  for (let i = 1; i < args.length; i++) {
    if (args[i].category < args[i - 1].category) {
      return false;
    }
  }
  return true;
}

export function checkClassArray(
  elements: Array<Node | SpreadElement | null>,
  parentNode: Node,
  context: Rule.RuleContext,
): void {
  const allItems: ClassItem[] = [];

  for (let i = 0; i < elements.length; i++) {
    const element = elements[i];
    if (element === null) continue;

    const text = context.sourceCode.getText(element);
    const line = getStringValue(element);

    if (line !== null && line.trim() !== '') {
      allItems.push({
        node: element,
        text,
        category: getArgumentCategory(line),
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

  for (const item of allItems) {
    if (!item.isString) continue;

    const line = getStringValue(item.node);
    if (!line) continue;

    const classes = parseClasses(line);
    if (classes.length <= 1) continue;

    const lineCategory = item.category;

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

  if (isCorrectOrder(allItems)) {
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
      const sortedTexts = sorted.map((item) => item.text);
      const validElements = elements.filter((el) => el !== null);

      const firstElement = validElements[0];
      const lastElement = validElements[validElements.length - 1];

      const separators: string[] = [];
      for (let i = 0; i < validElements.length - 1; i++) {
        const currentEnd = (validElements[i] as Node & { range: [number, number] }).range[1];
        const nextStart = (validElements[i + 1] as Node & { range: [number, number] }).range[0];
        const separator = context.sourceCode.getText().slice(currentEnd, nextStart);
        separators.push(separator);
      }

      let newText = sortedTexts[0];
      for (let i = 1; i < sortedTexts.length; i++) {
        const separator = separators[i - 1] || ',\n        ';
        newText += separator + sortedTexts[i];
      }

      return fixer.replaceTextRange(
        [
          (firstElement as Node & { range: [number, number] }).range[0],
          (lastElement as Node & { range: [number, number] }).range[1],
        ],
        newText,
      );
    },
  });
}

export function checkCvaOptions(optionsNode: ObjectExpression, context: Rule.RuleContext): void {
  for (const prop of optionsNode.properties) {
    if (prop.type !== 'Property') continue;
    const property = prop;
    if (property.key.type !== 'Identifier' || property.key.name !== 'variants') continue;
    if (property.value.type !== 'ObjectExpression') continue;

    for (const variantProp of property.value.properties) {
      if (variantProp.type !== 'Property') continue;
      const variantProperty = variantProp;
      if (variantProperty.value.type !== 'ObjectExpression') continue;

      for (const optionProp of variantProperty.value.properties) {
        if (optionProp.type !== 'Property') continue;
        const optionProperty = optionProp;

        if (optionProperty.value.type === 'ArrayExpression') {
          const arrayValue = optionProperty.value;
          const validElements = arrayValue.elements.filter((el) => el !== null);
          if (validElements.length > 1) {
            checkClassArray(arrayValue.elements, arrayValue, context);
          }
        }
      }
    }
  }
}
