import {
  CATEGORY_ORDER,
  getClassCategory,
  getCategoryName,
  getArgumentCategory,
} from "./categories.mjs";
import { parseClasses } from "./sorter.mjs";
import { getStringValue } from "./ast.mjs";

/**
 * 인자 배열이 올바른 순서인지 확인
 * @param {Array<{category: number}>} args
 * @returns {boolean}
 */
function isCorrectOrder(args) {
  for (let i = 1; i < args.length; i++) {
    if (args[i].category < args[i - 1].category) {
      return false;
    }
  }
  return true;
}

/**
 * 문자열 배열(또는 cn() 인자들)을 검사하는 공통 로직
 * @param {import('estree').Node[]} elements - 배열 요소들 또는 함수 인자들
 * @param {import('estree').Node} parentNode - 부모 노드 (에러 리포트용)
 * @param {import('eslint').Rule.RuleContext} context - ESLint 룰 컨텍스트
 */
export function checkClassArray(elements, parentNode, context) {
  /** @type {Array<{node: import('estree').Node, text: string, category: number, index: number, isString: boolean}>} */
  const allItems = [];

  for (let i = 0; i < elements.length; i++) {
    const element = elements[i];
    const text = context.sourceCode.getText(element);
    const line = getStringValue(element);

    if (line !== null && line.trim() !== "") {
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

  // 각 줄 내에 다른 카테고리 클래스가 있는지 검사
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
          messageId: "misplacedClass",
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

  const expectedOrder = sorted
    .map((item) => `${getCategoryName(item.category)}`)
    .join(" → ");

  context.report({
    node: parentNode,
    messageId: "unorderedArguments",
    data: {
      expected: expectedOrder,
    },
    fix(fixer) {
      const sortedTexts = sorted.map((item) => item.text);

      const firstElement = elements[0];
      const lastElement = elements[elements.length - 1];

      const separators = [];
      for (let i = 0; i < elements.length - 1; i++) {
        const currentEnd = elements[i].range[1];
        const nextStart = elements[i + 1].range[0];
        const separator = context.sourceCode
          .getText()
          .slice(currentEnd, nextStart);
        separators.push(separator);
      }

      let newText = sortedTexts[0];
      for (let i = 1; i < sortedTexts.length; i++) {
        const separator = separators[i - 1] || ",\n        ";
        newText += separator + sortedTexts[i];
      }

      return fixer.replaceTextRange(
        [firstElement.range[0], lastElement.range[1]],
        newText,
      );
    },
  });
}

/**
 * cva() 내부의 variants 객체에서 배열들을 찾아 검사
 * @param {import('estree').ObjectExpression} optionsNode
 * @param {import('eslint').Rule.RuleContext} context - ESLint 룰 컨텍스트
 */
export function checkCvaOptions(optionsNode, context) {
  for (const prop of optionsNode.properties) {
    if (prop.type !== "Property") continue;
    if (prop.key.type !== "Identifier" || prop.key.name !== "variants")
      continue;
    if (prop.value.type !== "ObjectExpression") continue;

    // variants 객체 내부 탐색
    for (const variantProp of prop.value.properties) {
      if (variantProp.type !== "Property") continue;
      if (variantProp.value.type !== "ObjectExpression") continue;

      // 각 variant 옵션 탐색
      for (const optionProp of variantProp.value.properties) {
        if (optionProp.type !== "Property") continue;

        // 배열인 경우 검사
        if (optionProp.value.type === "ArrayExpression") {
          const elements = optionProp.value.elements.filter(
            (el) => el !== null,
          );
          if (elements.length > 1) {
            checkClassArray(elements, optionProp.value, context);
          }
        }
      }
    }
  }
}
