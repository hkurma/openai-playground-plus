import classNames from "classnames";
import { PropsWithChildren } from "react";

type FlexProps = {
  className: string;
};

const Flex = (props: PropsWithChildren<FlexProps>) => {
  return (
    <div className={classNames("flex", props.className)}>{props.children}</div>
  );
};

export default Flex;
