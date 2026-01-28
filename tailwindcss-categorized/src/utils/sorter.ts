import { getClassCategory } from './categories';

export function parseClasses(classString: string): string[] {
  return classString
    .trim()
    .split(/\s+/)
    .filter((c) => c.length > 0);
}

export function sortClasses(classes: string[]): string[] {
  return [...classes].sort((a, b) => {
    const categoryA = getClassCategory(a);
    const categoryB = getClassCategory(b);

    if (categoryA !== categoryB) {
      return categoryA - categoryB;
    }

    return 0;
  });
}

export function sortClassString(classString: string): string {
  const classes = parseClasses(classString);
  const sorted = sortClasses(classes);
  return sorted.join(' ');
}

export function areClassesInOrder(classes1: string[], classes2: string[]): boolean {
  if (classes1.length !== classes2.length) {
    return false;
  }
  return classes1.every((c, i) => c === classes2[i]);
}

export function isClassStringInOrder(classString: string): boolean {
  const classes = parseClasses(classString);
  const sorted = sortClasses(classes);
  return areClassesInOrder(classes, sorted);
}

interface ArgumentInfo {
  value: string;
  category: number;
}

export function areArgumentsInOrder(args: ArgumentInfo[]): boolean {
  for (let i = 1; i < args.length; i++) {
    if (args[i].category < args[i - 1].category) {
      return false;
    }
  }

  return true;
}
