import classNames from "classnames";
import { default as NextLink } from "next/link";
import { HTMLAttributeAnchorTarget, PropsWithChildren } from "react";

type LinkProps = {
  className?: string;
  href: string;
  target?: HTMLAttributeAnchorTarget;
};

const Link = (props: PropsWithChildren<LinkProps>) => {
  return (
    <NextLink
      className={classNames(
        "text-primary-500 hover:text-primary-600 transition duration-200 ease-in-out",
        props.className
      )}
      href={props.href}
      target={props.target}
    >
      {props.children}
    </NextLink>
  );
};

export default Link;
