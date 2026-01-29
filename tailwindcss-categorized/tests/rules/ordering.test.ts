import { RuleTester } from 'eslint';

import rule from '../../src/rules/ordering';

const ruleTester = new RuleTester();

ruleTester.run('categorized', rule, {
  valid: [
    {
      code: 'cn("flex items-center", "w-4 h-4", "text-sm")',
    },
    {
      code: 'cva("flex", { variants: { size: { sm: ["flex", "w-4"] } } })',
    },
    {
      code: 'cn("flex dark:inline-flex", "bg-white dark:bg-black")',
    },
    {
      code: 'cn("flex dark:sm:inline-flex sm:dark:inline")',
    },
    {
      code: 'cn("flex", isActive && "bg-blue-500")',
    },
    {
      code: 'cn("flex", isActive ? "bg-blue-500" : "bg-gray-500")',
    },
    {
      code: 'cn("flex items-center", "text-sm", disabled && "opacity-50")',
    },
  ],
  invalid: [
    {
      code: 'cn("w-4", "flex")',
      errors: [{ messageId: 'unorderedCategories' }],
      output: 'cn("flex", "w-4")',
    },
    {
      code: 'cn("sm:w-4", "sm:flex")',
      errors: [{ messageId: 'unorderedCategories' }],
      output: 'cn("sm:flex", "sm:w-4")',
    },
    {
      code: 'cn("dark:text-white", "dark:flex")',
      errors: [{ messageId: 'unorderedCategories' }],
      output: 'cn("dark:flex", "dark:text-white")',
    },
    {
      code: 'cn("dark:sm:w-4", "dark:sm:flex")',
      errors: [{ messageId: 'unorderedCategories' }],
      output: 'cn("dark:sm:flex", "dark:sm:w-4")',
    },
    {
      code: 'cn("text-sm", isActive && "flex")',
      errors: [{ messageId: 'unorderedCategories' }],
      output: 'cn(isActive && "flex", "text-sm")',
    },
    {
      code: 'cva("flex", { variants: { size: { sm: ["w-4", "flex"] } } })',
      errors: [{ messageId: 'unorderedCategories' }],
      output: 'cva("flex", { variants: { size: { sm: ["flex", "w-4"] } } })',
    },
    {
      code: 'cn("w-4 flex", "text-sm")',
      errors: [{ messageId: 'misplacedClass' }],
    },
    {
      code: `const buttonVariants = cva(
        "inline-flex items-center justify-center",
        {
          variants: {
            variant: {
              default: [
                "bg-primary text-white shadow-sm",
                "hover:bg-primary/90",
                "w-full h-10 px-4 rounded-md",
                "flex items-center gap-2",
                "transition-colors duration-200",
                "disabled:opacity-50 disabled:pointer-events-none",
              ],
              outline: [
                "border",
                "hover:bg-accent hover:text-accent-foreground",
                "h-9 px-3 rounded-lg",
                "flex-shrink-0",
                "text-sm font-medium",
                "transition-all ease-in-out",
                "focus:ring-2 focus:ring-offset-2",
                "active:scale-95",
              ]
            },
            size: {
              sm: [
                "text-xs",
                "h-8 px-2 rounded",
                "gap-1",
              ],
              lg: [
                "text-lg font-semibold shadow-md",
                "h-12 px-6 rounded-xl",
                "gap-3",
              ]
            }
          }
        }
      )`,
      errors: [
        { messageId: 'unorderedCategories' },
        { messageId: 'unorderedCategories' },
        { messageId: 'unorderedCategories' },
        { messageId: 'unorderedCategories' },
      ],
      output: `const buttonVariants = cva(
        "inline-flex items-center justify-center",
        {
          variants: {
            variant: {
              default: [
                "flex items-center gap-2",
                "w-full h-10 px-4 rounded-md",
                "bg-primary text-white shadow-sm",
                "transition-colors duration-200",
                "hover:bg-primary/90",
                "disabled:opacity-50 disabled:pointer-events-none",
              ],
              outline: [
                "border",
                "h-9 px-3 rounded-lg",
                "flex-shrink-0",
                "text-sm font-medium",
                "transition-all ease-in-out",
                "hover:bg-accent hover:text-accent-foreground",
                "focus:ring-2 focus:ring-offset-2",
                "active:scale-95",
              ]
            },
            size: {
              sm: [
                "gap-1",
                "h-8 px-2 rounded",
                "text-xs",
              ],
              lg: [
                "gap-3",
                "h-12 px-6 rounded-xl",
                "text-lg font-semibold shadow-md",
              ]
            }
          }
        }
      )`,
    },
  ],
});
