export const CATEGORY_ORDER = {
  MARKER: 0,
  LAYOUT: 1,
  STRUCTURE: 2,
  STYLE: 3,
  TRANSITION: 4,
  INTERACTION: 5,
  STATE: 6,
  ACCESSIBILITY: 7,
  CVA: 8,
  CUSTOM: 9,
} as const;

export type CategoryName = keyof typeof CATEGORY_ORDER;

interface CategoryPattern {
  name: CategoryName;
  patterns: RegExp[];
}

export const CATEGORY_PATTERNS: CategoryPattern[] = [
  {
    name: "MARKER",
    patterns: [/^group$/, /^peer$/],
  },
  {
    name: "LAYOUT",
    patterns: [
      /^(static|fixed|absolute|relative|sticky)$/,
      /^(inline-)?flex(-col|-row|-wrap|-nowrap|-1|-auto|-initial|-none)?$/,
      /^(inline-)?grid(-cols-|-rows-|-flow-)?/,
      /^items-/,
      /^justify-/,
      /^gap-/,
      /^place-/,
      /^content-/,
      /^self-/,
      /^order-/,
      /^col-/,
      /^row-/,
    ],
  },
  {
    name: "STRUCTURE",
    patterns: [
      /^w-/,
      /^h-/,
      /^min-w-/,
      /^max-w-/,
      /^min-h-/,
      /^max-h-/,
      /^size-/,
      /^p-/,
      /^px-/,
      /^py-/,
      /^pt-/,
      /^pr-/,
      /^pb-/,
      /^pl-/,
      /^m-/,
      /^mx-/,
      /^my-/,
      /^mt-/,
      /^mr-/,
      /^mb-/,
      /^ml-/,
      /^-m/, // 네거티브 마진
      /^space-/,
      /^border$/, // border만 (색상 제외)
      /^border-(t|r|b|l|x|y)$/,
      /^border-\d/, // border-2 등
      /^(top|right|bottom|left|inset)-/,
      /^z-/,
      /^float-/,
      /^clear-/,
      /^overflow-/,
      /^overscroll-/,
      /^visible$/,
      /^invisible$/,
      /^collapse$/,
      /^flex-shrink/,
      /^flex-grow/,
      /^shrink/,
      /^grow/,
      /^basis-/,
      /^aspect-/,
      /^object-/,
    ],
  },
  {
    name: "STYLE",
    patterns: [
      /^typography-/,
      /^font-/,
      /^text-/,
      /^leading-/,
      /^tracking-/,
      /^line-clamp-/,
      /^truncate$/,
      /^whitespace-/,
      /^break-/,
      /^bg-/,
      /^from-/,
      /^via-/,
      /^to-/,
      /^gradient-/,
      /^rounded/,
      /^shadow/,
      /^opacity-/,
      /^border-[a-zA-Z]/, // border-neutral-* 등 색상
      /^ring-/,
      /^divide-/,
      /^fill-/,
      /^stroke-/,
      /^decoration-/,
      /^underline/,
      /^overline$/,
      /^line-through$/,
      /^no-underline$/,
      /^list-/,
      /^placeholder:/,
      /^caret-/,
      /^accent-/,
      /^cursor-/,
      /^select-/,
      /^scroll-/,
      /^snap-/,
      /^touch-/,
      /^resize/,
      /^appearance-/,
      /^outline-/,
      /^pointer-events-/,
      /^will-change-/,
      /^filter$/,
      /^blur/,
      /^brightness-/,
      /^contrast-/,
      /^grayscale/,
      /^hue-rotate-/,
      /^invert/,
      /^saturate-/,
      /^sepia/,
      /^backdrop-/,
      /^mix-blend-/,
      /^bg-blend-/,
      /^isolation-/,
    ],
  },
  {
    name: "TRANSITION",
    patterns: [
      /^transition/,
      /^animate-/,
      /^duration-/,
      /^ease-/,
      /^delay-/,
      /^rotate-/,
      /^scale-/,
      /^translate-/,
      /^skew-/,
      /^origin-/,
      /^transform/,
    ],
  },
  {
    name: "INTERACTION",
    patterns: [/^hover:/, /^focus:/, /^focus-within:/, /^focus-visible:/],
  },
  {
    name: "STATE",
    patterns: [
      /^active:/,
      /^disabled:/,
      /^enabled:/,
      /^checked:/,
      /^indeterminate:/,
      /^default:/,
      /^required:/,
      /^valid:/,
      /^invalid:/,
      /^in-range:/,
      /^out-of-range:/,
      /^placeholder-shown:/,
      /^autofill:/,
      /^read-only:/,
      /^open:/,
      /^group-hover:/,
      /^group-focus:/,
      /^group-aria-selected:/,
      /^peer-/,
      /^first:/,
      /^last:/,
      /^only:/,
      /^odd:/,
      /^even:/,
      /^first-of-type:/,
      /^last-of-type:/,
      /^empty:/,
      /^target:/,
      /^visited:/,
    ],
  },
  {
    name: "ACCESSIBILITY",
    patterns: [/^aria-/, /^sr-only$/, /^not-sr-only$/],
  },
];


export function getClassCategory(className: string): number {
  const baseClass = className.replace(/^((sm:|md:|lg:|xl:|2xl:|dark:)+)/, "");

  for (const category of CATEGORY_PATTERNS) {
    for (const pattern of category.patterns) {
      if (pattern.test(baseClass)) {
        return CATEGORY_ORDER[category.name];
      }
    }
  }

  return CATEGORY_ORDER.CUSTOM;
}

export function categorizeClasses(
  classes: string[]
): Array<{ className: string; category: number }> {
  return classes.map((className) => ({
    className,
    category: getClassCategory(className),
  }));
}

export function getCategoryName(cat: number): string {
  for (const [name, order] of Object.entries(CATEGORY_ORDER)) {
    if (order === cat) return name;
  }
  return "CUSTOM";
}

export function getArgumentCategory(classString: string): number {
  const classes = classString
    .trim()
    .split(/\s+/)
    .filter((c) => c.length > 0);
  if (classes.length === 0) {
    return CATEGORY_ORDER.CUSTOM;
  }
  return getClassCategory(classes[0]);
}
