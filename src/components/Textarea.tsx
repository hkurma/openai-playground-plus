import classNames from "classnames";
import { KeyboardEvent } from "react";

type TextareaProps = {
  className?: string;
  placeholder?: string;
  onChange?: (value: string) => void;
  value?: string;
  disabled?: boolean;
  onKeyUp?: (event: KeyboardEvent<HTMLTextAreaElement>) => void;
};

const Textarea = (props: TextareaProps) => {
  return (
    <textarea
      className={classNames(
        "border focus:border-primary-500 transition ease-in-out duration-200 p-4",
        props.className
      )}
      placeholder={props.placeholder}
      onChange={(event) => props.onChange?.(event.target.value)}
      value={props.value}
      disabled={props.disabled}
      onKeyUp={props.onKeyUp}
    ></textarea>
  );
};

export default Textarea;
