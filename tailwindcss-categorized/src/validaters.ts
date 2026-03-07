import type { Rule } from 'eslint';
import type { Node, ObjectExpression, Property, SpreadElement } from 'estree';

import { CATEGORIES, getCategoryName, getCategoryOrder } from './categories';

interface ClassMeta {
  node: Node;
  index: number;
  text: string;
  categoryOrder: number;
}

export function validateClassNames(
  classNames: Array<Node | SpreadElement | null>,
  parentNode: Node,
  context: Rule.RuleContext,
): void {
  const classMetas: ClassMeta[] = classNames
    .map((node, index) => {
      if (node === null) {
        return null;
      }

      const className = getValue(node);
      const isValidClassName = typeof className === 'string' && className.trim() !== '';
      const categoryOrder = isValidClassName ? getCategoryOrder(className) : CATEGORIES.CVA.order;

      return {
        node,
        index,
        text: context.sourceCode.getText(node),
        categoryOrder,
      };
    })
    .filter((meta): meta is ClassMeta => meta !== null);

  if (classMetas.length <= 1) {
    return;
  }

  classMetas.forEach((classMeta) => validateClassName(classMeta, context));

  if (isOrderedByCategory(classMetas)) {
    return;
  }

  const sortedClassMetas = [...classMetas].sort((a, b) => {
    if (a.categoryOrder !== b.categoryOrder) {
      return a.categoryOrder - b.categoryOrder;
    }
    return a.index - b.index;
  });

  context.report({
    node: parentNode,
    messageId: 'unorderedCategories',
    data: {
      expected: sortedClassMetas.map((item) => `${getCategoryName(item.categoryOrder)}`).join(' → '),
    },
    fix(fixer) {
      const nodes = classNames.filter((node): node is Node => node !== null);

      if (nodes.length === 0) {
        return null;
      }

      const separators = nodes
        .slice(0, -1)
        .map((node, index) => context.sourceCode.text.slice(node.range![1], nodes[index + 1].range![0]));
      const className = sortedClassMetas.reduce((accumulator, meta, index) => {
        return `${accumulator}${index === 0 ? '' : (separators[index - 1] ?? ', ')}${meta.text}`;
      }, '');

      return fixer.replaceTextRange([nodes[0].range![0], nodes[nodes.length - 1].range![1]], className);
    },
  });
}

export function validateCvaOptions(cvaConfig: ObjectExpression, context: Rule.RuleContext): void {
  const variantsProperty = cvaConfig.properties.find(
    (property): property is Property =>
      property.type === 'Property' &&
      property.key.type === 'Identifier' &&
      property.key.name === 'variants' &&
      property.value.type === 'ObjectExpression',
  );

  if (!variantsProperty) {
    return;
  }

  for (const variantProperty of (variantsProperty.value as ObjectExpression).properties) {
    if (variantProperty.type !== 'Property' || variantProperty.value.type !== 'ObjectExpression') {
      continue;
    }

    for (const optionProperty of variantProperty.value.properties) {
      if (optionProperty.type !== 'Property' || optionProperty.value.type !== 'ArrayExpression') {
        continue;
      }

      const classNames = optionProperty.value;
      const classNamesCount = classNames.elements.filter((element) => element !== null).length;

      if (classNamesCount <= 1) {
        continue;
      }

      validateClassNames(classNames.elements, classNames, context);
    }
  }
}

function validateClassName(classMeta: ClassMeta, context: Rule.RuleContext): void {
  if (classMeta.categoryOrder === CATEGORIES.CVA.order) {
    return;
  }

  const className = getValue(classMeta.node);
  const isValidClassName = typeof className === 'string' && className.trim() !== '';

  if (!isValidClassName) {
    return;
  }

  const classes = parseClasses(className);

  if (classes.length <= 1) {
    return;
  }

  classes
    .filter((utility) => getCategoryOrder(utility) !== classMeta.categoryOrder)
    .forEach((className) => {
      context.report({
        node: classMeta.node,
        messageId: 'misplacedClass',
        data: {
          className,
        },
      });
    });
}

function parseClasses(className: string): string[] {
  return className.trim().split(/\s+/).filter(Boolean);
}

function getValue(node: Node): string | null {
  if (!node) {
    return null;
  }

  if (node.type === 'Literal' && typeof node.value === 'string') {
    return node.value;
  }

  if (node.type === 'TemplateLiteral' && node.expressions.length === 0) {
    return node.quasis[0].value.cooked ?? null;
  }

  if (node.type === 'LogicalExpression') {
    return getValue(node.right);
  }

  if (node.type === 'ConditionalExpression') {
    return getValue(node.consequent) ?? getValue(node.alternate);
  }

  return null;
}

function isOrderedByCategory(classMetas: ClassMeta[]): boolean {
  for (let i = 1; i < classMetas.length; ++i) {
    if (classMetas[i].categoryOrder < classMetas[i - 1].categoryOrder) {
      return false;
    }
  }

  return true;
}
