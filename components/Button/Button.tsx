import classNames from "classnames";
import Link, { LinkProps } from "next/link";
import React from "react";

export enum Button_Type {
  Primary,
  Secondary,
  Info,
  Success,
  Warning,
  Error,
}

interface Props
  extends React.DetailedHTMLProps<
    React.ButtonHTMLAttributes<HTMLButtonElement>,
    HTMLButtonElement
  > {
  variant?: Button_Type;
  link?: LinkProps;
}

const getColor = (type: Button_Type) => {
  switch (type) {
    case Button_Type.Primary:
      return "bg-indigo-500 hover:bg-indigo-700";
    case Button_Type.Secondary:
      return "bg-pink-500 hover:bg-pink-700";
    case Button_Type.Info:
      return "bg-blue-500 hover:bg-blue-700";
    case Button_Type.Success:
      return "bg-green-500 hover:bg-green-700";
    case Button_Type.Warning:
      return "bg-yellow-500 hover:bg-yellow-700";
    case Button_Type.Error:
      return "bg-red-500 hover:bg-red-700";
  }
};

const LinkWrapper = (props: Partial<Props>) => {
  if (props.link) {
    return <Link {...props.link}>{props.children}</Link>;
  } else {
    return <>{props.children}</>;
  }
};

export const Button: React.FunctionComponent<Props> = ({
  variant = Button_Type.Info,
  children,
  link,
  ...props
}) => {
  return (
    <LinkWrapper link={link}>
      <button
        className={classNames(
          "text-white font-bold py-2 px-4 rounded",
          getColor(variant)
        )}
        {...props}
      >
        {children}
      </button>
    </LinkWrapper>
  );
};
