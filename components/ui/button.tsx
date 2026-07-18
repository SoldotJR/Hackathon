import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/utils/cn";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/60 disabled:pointer-events-none disabled:opacity-50 cursor-pointer select-none",
  {
    variants: {
      variant: {
        primary:
          "bg-primary text-white shadow-lg shadow-primary/25 hover:-translate-y-0.5 hover:shadow-xl hover:shadow-primary/35 active:translate-y-0",
        secondary:
          "bg-secondary/15 text-secondary border border-secondary/30 hover:bg-secondary/25 hover:-translate-y-0.5",
        ghost:
          "bg-transparent text-subtext hover:text-white hover:bg-white/5",
        outline:
          "border border-white/15 bg-white/5 text-white hover:bg-white/10 hover:-translate-y-0.5",
        danger:
          "bg-danger/15 text-danger border border-danger/30 hover:bg-danger/25",
        glass:
          "glass text-white hover:-translate-y-0.5 hover:border-white/20",
      },
      size: {
        sm: "h-9 px-3 text-sm rounded-xl",
        md: "h-11 px-5 text-sm rounded-2xl",
        lg: "h-13 px-8 text-base rounded-[20px] min-h-[52px]",
        icon: "h-10 w-10 rounded-xl",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "md",
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, ...props }, ref) => (
    <button
      ref={ref}
      className={cn(buttonVariants({ variant, size }), className)}
      {...props}
    />
  )
);
Button.displayName = "Button";

export { buttonVariants };
