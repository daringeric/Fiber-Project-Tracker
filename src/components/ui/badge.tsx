import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-wave-500 focus:ring-offset-2",
  {
    variants: {
      variant: {
        // Brand variants
        default: "border-transparent bg-navy-900 text-white",
        secondary: "border-transparent bg-navy-100 text-navy-900",
        wave: "border-transparent bg-wave-500 text-white",
        violetta: "border-transparent bg-violetta-500 text-white",
        outline: "border-navy-200 text-navy-900",

        // Semantic variants
        success: "border-transparent bg-wave-100 text-wave-700",
        warning: "border-transparent bg-warning-100 text-warning-700",
        destructive: "border-transparent bg-violetta-500 text-white",
        info: "border-transparent bg-wave-100 text-wave-700",

        // Stage status variants (Lightcurve branded)
        pending: "border-transparent bg-navy-100 text-navy-600",
        inProgress: "border-transparent bg-wave-100 text-wave-700",
        completed: "border-transparent bg-wave-100 text-wave-700",
        blocked: "border-transparent bg-violetta-100 text-violetta-700",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  );
}

export { Badge, badgeVariants };
