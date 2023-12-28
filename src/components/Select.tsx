import classNames from "classnames";

type SelectOption = {
  label: string;
  value: string;
};

type SelectProps = {
  className?: string;
  name?: string;
  options: SelectOption[];
  placeholder?: string;
  onChange?: (option: SelectOption) => void;
  value?: string;
};

const Select = (props: SelectProps) => {
  return (
    <select
      className={classNames(
        "border rounded focus:border-primary-500 transition ease-in-out duration-200 p-2",
        props.className
      )}
      name={props.name}
      onChange={(event) =>
        props.onChange?.(
          props.options.find((o) => o.value == event.target.value)!
        )
      }
      value={props.value}
    >
      {props.options.map((option) => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
  );
};

export default Select;
