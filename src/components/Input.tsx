import classNames from "classnames";
import { KeyboardEvent } from "react";

type InputProps = {
  className?: string;
  id?: string;
  name: string;
  type?: "text" | "number" | "password";
  min?: string | number;
  max?: string | number;
  step?: string | number;
  placeholder?: string;
  onChange?: (value: string) => void;
  value?: string;
  disabled?: boolean;
  onKeyUp?: (event: KeyboardEvent<HTMLInputElement>) => void;
};

const Input = (props: InputProps) => {
  return (
    <input
      className={classNames(
        "border focus:border-primary-500 transition ease-in-out duration-200 p-2",
        props.className
      )}
      type={props.type}
      min={props.min}
      max={props.max}
      step={props.step}
      id={props.id}
      name={props.name}
      placeholder={props.placeholder}
      onChange={(event) => props.onChange?.(event.target.value)}
      value={props.value}
      disabled={props.disabled}
      onKeyUp={props.onKeyUp}
    />
  );
};

export default Input;
