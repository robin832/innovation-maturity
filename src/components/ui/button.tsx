import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 rounded-xl text-sm font-semibold transition-all focus-visible:outline-none disabled:pointer-events-none disabled:opacity-40",
  {
    variants: {
      variant: {
        default:  "bg-beacon-orange text-beacon-ivory hover:opacity-90",
        outline:  "border border-beacon-border text-beacon-ivory/70 hover:text-beacon-ivory hover:border-beacon-ivory/30",
        ghost:    "text-beacon-ivory/60 hover:text-beacon-ivory hover:bg-beacon-card",
        blue:     "bg-beacon-blue text-white hover:opacity-90",
      },
      size: {
        default: "h-11 px-6",
        sm:      "h-9 px-4 text-xs",
        lg:      "h-13 px-8 text-base",
        icon:    "h-10 w-10",
      },
    },
    defaultVariants: { variant: "default", size: "default" },
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
    return <Comp className={cn(buttonVariants({ variant, size, className }))} ref={ref} {...props} />;
  }
);
Button.displayName = "Button";

export { Button, buttonVariants };
