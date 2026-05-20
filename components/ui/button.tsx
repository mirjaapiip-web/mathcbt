import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "focus-ring inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-xl text-sm font-semibold transition-all disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default:
          "bg-primary text-primary-foreground shadow-exam hover:-translate-y-0.5 hover:bg-blue-600",
        secondary:
          "bg-secondary text-secondary-foreground hover:-translate-y-0.5 hover:bg-blue-100 dark:hover:bg-white/10",
        outline:
          "border border-border bg-white/70 hover:-translate-y-0.5 hover:bg-secondary dark:bg-white/5",
        ghost:
          "hover:bg-secondary hover:text-secondary-foreground dark:hover:bg-white/10",
        destructive:
          "bg-destructive text-destructive-foreground hover:bg-rose-700",
        success:
          "bg-emerald-600 text-white shadow-exam hover:-translate-y-0.5 hover:bg-emerald-700",
      },
      size: {
        default: "h-11 px-5",
        sm: "h-9 rounded-lg px-3",
        lg: "h-12 rounded-2xl px-6 text-base",
        icon: "size-10 rounded-xl",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
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
  },
);
Button.displayName = "Button";

export { Button, buttonVariants };
