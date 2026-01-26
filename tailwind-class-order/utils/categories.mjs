export const CATEGORY_ORDER = {
  MARKER: 0, // 마커 (group, peer 등)
  LAYOUT: 1, // 자식 요소 배치
  STRUCTURE: 2, // 요소 구조
  STYLE: 3, // 요소 스타일
  TRANSITION: 4, // 요소 전환
  INTERACTION: 5, // 요소 상호작용 (hover, focus)
  STATE: 6, // 요소 상태 (active, disabled)
  ACCESSIBILITY: 7, // 요소 접근성 (aria)
  CVA: 8, // Class Variance Authority
  CUSTOM: 9, // 커스텀 클래스
};

export const CATEGORY_PATTERNS = [
  {
    name: 'MARKER',
    // 마커: group, peer 등 (자식/형제 요소 상태 참조를 위한)
    patterns: [/^group$/, /^peer$/],
  },
  {
    name: 'LAYOUT',
    // 자식 요소 배치: flex, grid, items-*, justify-*, gap-*, place-*
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
    name: 'STRUCTURE',
    // 요소 구조: w-*, h-*, p-*, m-*, border (크기만), position, inset 등
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
    name: 'STYLE',
    // 요소 스타일: typography-*, bg-*, rounded-*, shadow-*, text-*, truncate, border-[color]
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
    name: 'TRANSITION',
    // 요소 전환: transition-*, animate-*, duration-*, ease-*, rotate-*, scale-*, translate-*
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
    name: 'INTERACTION',
    // 요소 상호작용: hover:*, focus:*
    patterns: [/^hover:/, /^focus:/, /^focus-within:/, /^focus-visible:/],
  },
  {
    name: 'STATE',
    // 요소 상태: active:*, disabled:* 등
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
    name: 'ACCESSIBILITY',
    // 요소 접근성: aria-*
    patterns: [/^aria-/, /^sr-only$/, /^not-sr-only$/],
  },
];

/**
 * 클래스의 카테고리를 결정
 * @param {string} className - Tailwind 클래스명
 * @returns {number} - 카테고리 순서 (낮을수록 먼저)
 */
export function getClassCategory(className) {
  const withoutResponsive = className.replace(/^(sm:|md:|lg:|xl:|2xl:)/, '');

  const withoutDark = withoutResponsive.replace(/^dark:/, '');

  // 상태 접두사가 있는 경우 (hover:, focus: 등)
  for (const category of CATEGORY_PATTERNS) {
    for (const pattern of category.patterns) {
      if (pattern.test(withoutDark)) {
        return CATEGORY_ORDER[category.name];
      }
    }
  }

  // 어떤 카테고리에도 해당하지 않으면 커스텀
  return CATEGORY_ORDER.CUSTOM;
}

/**
 * 여러 클래스의 카테고리를 일괄 분류
 * @param {string[]} classes - 클래스 배열
 * @returns {Array<{className: string, category: number}>}
 */
export function categorizeClasses(classes) {
  return classes.map((className) => ({
    className,
    category: getClassCategory(className),
  }));
}
