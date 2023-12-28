import classNames from "classnames";
import { default as NextLink } from "next/link";
import { PropsWithChildren } from "react";

type LinkProps = {
  className?: string;
  href: string;
};

const Link = (props: PropsWithChildren<LinkProps>) => {
  return (
    <NextLink
      className={classNames(
        "text-primary-500 hover:text-primary-600 transition duration-200 ease-in-out",
        props.className
      )}
      href={props.href}
    >
      {props.children}
    </NextLink>
  );
};

export default Link;
