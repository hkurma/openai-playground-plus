import { cn } from "@/lib/utils";
import { VariantProps, cva } from "class-variance-authority";
import { LinkProps as NextLinkProps, default as NextLink } from "next/link";
import React from "react";

const linkVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap text-sm scroll-m-20 tracking-tight text-primary",
  {
    variants: {
      variant: {
        default: "underline-offset-4 hover:underline",
        active: "underline-offset-4 underline",
        ghost: "",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

export interface LinkProps
  extends Omit<
      React.AnchorHTMLAttributes<HTMLAnchorElement>,
      keyof NextLinkProps
    >,
    NextLinkProps,
    VariantProps<typeof linkVariants> {}

const Link = React.forwardRef<HTMLAnchorElement, LinkProps>(
  ({ className, variant, ...props }, ref) => {
    return (
      <NextLink
        className={cn(linkVariants({ variant, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);
Link.displayName = "Link";

export { Link };
