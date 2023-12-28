import { PropsWithChildren } from "react";

type TextProps = {
  className?: string;
};

const Text = (props: PropsWithChildren<TextProps>) => {
  return <div className={props.className}>{props.children}</div>;
};

export default Text;
