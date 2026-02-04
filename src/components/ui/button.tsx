import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-wave-500 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        // Primary - Wave (main CTA)
        default: "bg-wave-500 text-white hover:bg-wave-600",

        // Navy - Secondary brand button
        navy: "bg-navy-900 text-white hover:bg-navy-800",

        // Violetta - Accent/Highlight actions
        violetta: "bg-violetta-500 text-white hover:bg-violetta-600",

        // Destructive - Uses Violetta
        destructive: "bg-violetta-500 text-white hover:bg-violetta-600",

        // Outline variants
        outline: "border-2 border-navy-900 text-navy-900 bg-transparent hover:bg-navy-50",
        "outline-wave": "border-2 border-wave-500 text-wave-500 bg-transparent hover:bg-wave-50",

        // Secondary - Subtle
        secondary: "bg-navy-100 text-navy-900 hover:bg-navy-200",

        // Ghost - Minimal
        ghost: "hover:bg-navy-100 hover:text-navy-900",

        // Link style
        link: "text-wave-500 underline-offset-4 hover:underline",

        // Success - Uses Wave
        success: "bg-wave-500 text-white hover:bg-wave-600",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 rounded-md px-3 text-sm",
        lg: "h-12 rounded-md px-8 text-base",
        xl: "h-14 rounded-md px-10 text-lg",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";

export { Button, buttonVariants };
