import classNames from "classnames";
import { useSensitive } from "components/ContextWrapper/ContextWrapper";
import React from "react";

interface Props
  extends React.DetailedHTMLProps<
    React.HTMLAttributes<HTMLSpanElement>,
    HTMLSpanElement
  > {}
export const Sensitive: React.FunctionComponent<Props> = ({ children }) => {
  const { sensitive } = useSensitive();

  return (
    <span className={classNames({ "filter blur-lg": sensitive })}>
      {children}
    </span>
  );
};
