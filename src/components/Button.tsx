import classNames from "classnames";
import { PropsWithChildren } from "react";

type ButtonProps = {
  className?: string;
  onClick?: () => void;
  disabled?: boolean;
};

const Button = (props: PropsWithChildren<ButtonProps>) => {
  return (
    <button
      className={classNames(
        "bg-primary-500 border rounded border-primary-500 transition ease-in-out duration-200 text-slate-100 p-2",
        props.disabled
          ? "cursor-not-allowed"
          : "hover:bg-primary-600 hover:border-primary-600",
        props.className
      )}
      onClick={props.onClick}
      disabled={props.disabled}
    >
      {props.children}
    </button>
  );
};

export default Button;
