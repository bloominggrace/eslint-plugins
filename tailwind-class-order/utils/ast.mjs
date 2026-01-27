/**
 * AST 노드가 특정 함수 호출인지 확인
 * @param {import('estree').CallExpression} node
 * @param {string} functionName
 * @returns {boolean}
 */
export function isFunctionCall(node, functionName) {
  if (node.type !== "CallExpression") {
    return false;
  }
  if (node.callee.type === "Identifier" && node.callee.name === functionName) {
    return true;
  }
  return false;
}

/**
 * 문자열 리터럴 노드에서 값 추출
 * @param {import('estree').Node} node
 * @returns {string | null}
 */
export function getStringValue(node) {
  if (node.type === "Literal" && typeof node.value === "string") {
    return node.value;
  }
  if (
    node.type === "TemplateLiteral" &&
    node.quasis.length === 1 &&
    node.expressions.length === 0
  ) {
    return node.quasis[0].value.cooked;
  }
  return null;
}
