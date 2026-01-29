export const CATEGORIES = {
  MARKER: {
    order: 0,
    name: 'Marker',
    patterns: [/^group$/, /^peer$/],
  },
  LAYOUT: {
    order: 1,
    name: 'Layout',
    patterns: [
      /^(static|fixed|absolute|relative|sticky)$/,
      /^container$/,
      /^(block|inline-block|inline|flex|inline-flex|table|inline-table|grid|inline-grid)$/,
      /^(table-(caption|cell|column|column-group|footer-group|header-group|row-group|row))$/,
      /^(contents|flow-root|list-item|hidden)$/,
      /^flex-(row|row-reverse|col|col-reverse|wrap|wrap-reverse|nowrap)$/,
      /^grid-(cols|rows)-/,
      /^grid-flow-(row|col|dense|row-dense|col-dense)$/,
      /^auto-(cols|rows)-/,
      /^(items|justify|gap|place|content|self)-/,
      /^columns-/,
      /^(order|col|row)-/,
    ],
  },
  STRUCTURE: {
    order: 2,
    name: 'Structure',
    patterns: [
      /^(?:min-|max-)?(?:w|h|size)-/,
      /^box-(?:border|content)$/,
      /^-?[mp][xytrbl]?-/,
      /^space-[xy]-/,
      /^(?:top|right|bottom|left|inset)-/,
      /^z-/,
      /^border(?:-[trblxyse])?(?:-(?:\d+|\[[^\]]+]))?$/,
      /^border(?:-[trblxyse])?-(?:solid|dashed|dotted|double|none)$/,
      /^border-(?:collapse|separate)$/,
      /^border-spacing-/,
      /^(?:float|clear|overflow|overscroll|aspect|object|basis)-/,
      /^flex-(?:shrink|grow)/,
      /^flex-(?:1|auto|initial|none)$/,
      /^(?:shrink|grow)(?:-|$)/,
      /^(?:visible|invisible|collapse)$/,
    ],
  },
  STYLE: {
    order: 3,
    name: 'Style',
    patterns: [
      /^(?:typography|font|text|leading|tracking|line-clamp)-/,
      /^(?:whitespace|break)-/,
      /^(?:truncate|underline|overline|line-through|no-underline)$/,
      /^(?:bg|from|via|to|gradient)-/,
      /^rounded(?:-[trblxy])?(?:-|$)/,
      /^border-(?:[a-z]+|\[[^\]]+])/,
      /^(?:shadow|drop-shadow|opacity|ring|divide|fill|stroke|decoration)-/,
      /^(?:caret|accent|appearance|outline|will-change)-/,
      /^(?:filter|blur|brightness|contrast|grayscale|hue-rotate)-/,
      /^(?:invert|saturate|sepia|backdrop|mix-blend|bg-blend|isolation|isolate)/,
      /^(?:cursor|select|scroll|snap|touch|resize|pointer-events)-/,
    ],
  },
  TRANSITION: {
    order: 4,
    name: 'Transition',
    patterns: [
      /^(?:transition|animate|duration|ease|delay)(?:-|$)/,
      /^(?:rotate|scale|translate|skew|origin|transform)(?:-|$)/,
    ],
  },
  INTERACTION: {
    order: 5,
    name: 'Interaction',
    patterns: [/^(?:hover|focus|focus-within|focus-visible):/],
  },
  STATE: {
    order: 6,
    name: 'State',
    patterns: [
      /^(?:active|disabled|enabled|checked|indeterminate|default|required):/,
      /^(?:valid|invalid|in-range|out-of-range|placeholder-shown):/,
      /^(?:autofill|read-only|open):/,
      /^(?:group|peer)-(?:hover|focus|active|disabled|checked|aria-selected):/,
      /^(?:first|last|only|odd|even|first-of-type):/,
      /^(?:last-of-type|empty|target|visited):/,
    ],
  },
  ACCESSIBILITY: {
    order: 7,
    name: 'Accessibility',
    patterns: [/^aria-/, /^sr-only$/, /^not-sr-only$/],
  },
  CVA: {
    order: 8,
    name: 'Custom Variant',
    patterns: [],
  },
  CUSTOM: {
    order: 9,
    name: 'Custom',
    patterns: [],
  },
} as const;

const categories = Object.values(CATEGORIES).filter((category) => category.patterns.length > 0);

export function getCategoryOrder(className: string): number {
  const firstClass = className.trim().split(/\s+/)[0];

  if (!firstClass) {
    return CATEGORIES.CUSTOM.order;
  }

  const targetClass = firstClass.replace(/^((sm:|md:|lg:|xl:|2xl:|dark:)+)/, '');

  for (const category of categories) {
    if (category.patterns.some((pattern) => pattern.test(targetClass))) {
      return category.order;
    }
  }

  return CATEGORIES.CUSTOM.order;
}

export function getCategoryName(order: number): string {
  return categories.find((c) => c.order === order)?.name ?? CATEGORIES.CUSTOM.name;
}
