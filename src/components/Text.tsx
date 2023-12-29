import { PropsWithChildren } from "react";

type TextProps = {
  className?: string;
  onClick?: () => void;
};

const Text = (props: PropsWithChildren<TextProps>) => {
  return (
    <div className={props.className} onClick={props.onClick}>
      {props.children}
    </div>
  );
};

export default Text;
