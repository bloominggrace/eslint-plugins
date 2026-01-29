import type { CallExpression, Node } from 'estree';

export function isFunctionCall(node: CallExpression, functionName: string): boolean {
  if (node.type === 'CallExpression' && node.callee.type === 'Identifier' && node.callee.name === functionName) {
    return true;
  }
  return false;
}

export function getStringValue(node: Node): string | null {
  if (node.type === 'Literal' && typeof node.value === 'string') {
    return node.value;
  }
  if (node.type === 'TemplateLiteral') {
    if (node.expressions.length === 0) return node.quasis[0].value.cooked ?? null;
  }
  return null;
}
