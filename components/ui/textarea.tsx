import * as React from "react";
import { cn } from "@/utils/cn";

export const Textarea = React.forwardRef<
  HTMLTextAreaElement,
  React.TextareaHTMLAttributes<HTMLTextAreaElement>
>(({ className, ...props }, ref) => (
  <textarea
    ref={ref}
    className={cn(
      "flex min-h-[160px] w-full rounded-[24px] border border-white/10 bg-surface/60 px-5 py-4 text-base text-white placeholder:text-subtext/60 transition focus:border-primary/50 focus:outline-none focus:ring-2 focus:ring-primary/30 resize-y",
      className
    )}
    {...props}
  />
));
Textarea.displayName = "Textarea";
