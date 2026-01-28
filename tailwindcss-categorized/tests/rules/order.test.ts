import { RuleTester } from "eslint";
import rule from "../../src/rules/order";

const ruleTester = new RuleTester();

ruleTester.run("order", rule, {
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
      errors: [{ messageId: "unorderedArguments" }],
      output: 'cn("flex", "w-4")',
    },
    {
      code: 'cn("sm:w-4", "sm:flex")',
      errors: [{ messageId: "unorderedArguments" }],
      output: 'cn("sm:flex", "sm:w-4")',
    },
    {
      code: 'cn("dark:text-white", "dark:flex")',
      errors: [{ messageId: "unorderedArguments" }],
      output: 'cn("dark:flex", "dark:text-white")',
    },
    {
      code: 'cn("dark:sm:w-4", "dark:sm:flex")',
      errors: [{ messageId: "unorderedArguments" }],
      output: 'cn("dark:sm:flex", "dark:sm:w-4")',
    },
    {
      code: 'cn(isActive && "flex", "text-sm")',
      errors: [{ messageId: "unorderedArguments" }],
      output: 'cn("text-sm", isActive && "flex")',
    },
    {
      code: 'cva("flex", { variants: { size: { sm: ["w-4", "flex"] } } })',
      errors: [{ messageId: "unorderedArguments" }],
      output: 'cva("flex", { variants: { size: { sm: ["flex", "w-4"] } } })',
    },
    {
      code: 'cn("w-4 flex", "text-sm")',
      errors: [{ messageId: "misplacedClass" }],
    },
    {
      code: `const buttonVariants = cva(
  "inline-flex items-center justify-center",
  {
    variants: {
      variant: {
        default: [
          "bg-primary text-white",
          "hover:bg-primary/90",
          "w-full h-10 px-4",
          "flex items-center gap-2",
          "rounded-md shadow-sm",
          "transition-colors duration-200",
          "disabled:opacity-50 disabled:pointer-events-none"
        ],
        outline: [
          "border",
          "hover:bg-accent hover:text-accent-foreground",
          "h-9 px-3",
          "flex-shrink-0",
          "text-sm font-medium",
          "rounded-lg",
          "transition-all ease-in-out",
          "focus:ring-2 focus:ring-offset-2",
          "active:scale-95"
        ]
      },
      size: {
        sm: [
          "text-xs",
          "h-8 px-2",
          "gap-1",
          "rounded"
        ],
        lg: [
          "text-lg font-semibold",
          "h-12 px-6",
          "gap-3",
          "rounded-xl shadow-md"
        ]
      }
    }
  }
)`,
      errors: [
        { messageId: "unorderedArguments" },
        { messageId: "unorderedArguments" },
        { messageId: "unorderedArguments" },
        { messageId: "unorderedArguments" },
      ],
      output: `const buttonVariants = cva(
  "inline-flex items-center justify-center",
  {
    variants: {
      variant: {
        default: [
          "flex items-center gap-2",
          "w-full h-10 px-4",
          "bg-primary text-white",
          "rounded-md shadow-sm",
          "transition-colors duration-200",
          "hover:bg-primary/90",
          "disabled:opacity-50 disabled:pointer-events-none"
        ],
        outline: [
          "border",
          "h-9 px-3",
          "flex-shrink-0",
          "text-sm font-medium",
          "rounded-lg",
          "transition-all ease-in-out",
          "hover:bg-accent hover:text-accent-foreground",
          "focus:ring-2 focus:ring-offset-2",
          "active:scale-95"
        ]
      },
      size: {
        sm: [
          "gap-1",
          "h-8 px-2",
          "text-xs",
          "rounded"
        ],
        lg: [
          "gap-3",
          "h-12 px-6",
          "text-lg font-semibold",
          "rounded-xl shadow-md"
        ]
      }
    }
  }
)`,
    },
  ],
});
