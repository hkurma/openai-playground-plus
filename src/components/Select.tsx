import classNames from "classnames";

type SelectProps = {
  className?: string;
  options: string[];
  placeholder?: string;
};

const Select = (props: SelectProps) => {
  return (
    <select
      className={classNames(
        "border border-primary-300 focus:border-primary-500 transition ease-in-out duration-200 p-4",
        props.className
      )}
    >
      {props.options.map((option) => (
        <option key={option} value={option}>
          {option}
        </option>
      ))}
    </select>
  );
};

export default Select;
