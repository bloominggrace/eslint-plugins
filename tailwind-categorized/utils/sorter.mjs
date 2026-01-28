import { getClassCategory } from "./categories.mjs";

/**
 * 클래스 문자열을 파싱하여 개별 클래스 배열로 변환
 * @param {string} classString - 공백으로 구분된 클래스 문자열
 * @returns {string[]} - 클래스 배열
 */
export function parseClasses(classString) {
  return classString
    .trim()
    .split(/\s+/)
    .filter((c) => c.length > 0);
}

/**
 * 클래스 배열을 카테고리 순서대로 정렬
 * @param {string[]} classes - 클래스 배열
 * @returns {string[]} - 정렬된 클래스 배열
 */
export function sortClasses(classes) {
  return [...classes].sort((a, b) => {
    const categoryA = getClassCategory(a);
    const categoryB = getClassCategory(b);

    if (categoryA !== categoryB) {
      return categoryA - categoryB;
    }

    return 0;
  });
}

/**
 * 클래스 문자열을 정렬하여 반환
 * @param {string} classString - 공백으로 구분된 클래스 문자열
 * @returns {string} - 정렬된 클래스 문자열
 */
export function sortClassString(classString) {
  const classes = parseClasses(classString);
  const sorted = sortClasses(classes);
  return sorted.join(" ");
}

/**
 * 두 클래스 배열의 순서가 동일한지 비교
 * @param {string[]} classes1
 * @param {string[]} classes2
 * @returns {boolean}
 */
export function areClassesInOrder(classes1, classes2) {
  if (classes1.length !== classes2.length) {
    return false;
  }
  return classes1.every((c, i) => c === classes2[i]);
}

/**
 * 클래스 문자열이 올바른 순서인지 확인
 * @param {string} classString - 공백으로 구분된 클래스 문자열
 * @returns {boolean}
 */
export function isClassStringInOrder(classString) {
  const classes = parseClasses(classString);
  const sorted = sortClasses(classes);
  return areClassesInOrder(classes, sorted);
}

/**
 * cn() 인자들의 순서가 올바른지 확인 (줄 순서 검사)
 * @param {Array<{value: string, category: number}>} args - cn() 인자 정보 배열
 * @returns {boolean}
 */
export function areArgumentsInOrder(args) {
  for (let i = 1; i < args.length; i++) {
    if (args[i].category < args[i - 1].category) {
      return false;
    }
  }

  return true;
}
