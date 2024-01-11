import { cn } from "@/lib/utils";
import { VariantProps, cva } from "class-variance-authority";
import React from "react";

const textVariants = cva("scroll-m-20 tracking-tight", {
  variants: {
    variant: {
      default: "text-sm",
      title: "text-4xl font-bold",
      heading: "text-2xl font-semibold",
      large: "text-lg font-medium",
      medium: "text-md font-medium",
    },
  },
  defaultVariants: {
    variant: "default",
  },
});

export interface TextProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof textVariants> {}

const Text = React.forwardRef<HTMLDivElement, TextProps>(
  ({ className, variant, ...props }, ref) => {
    return (
      <div className={cn(textVariants({ variant, className }))} ref={ref}>
        {props.children}
      </div>
    );
  }
);
Text.displayName = "Text";

export { Text };
