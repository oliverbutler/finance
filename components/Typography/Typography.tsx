import React from "react";

interface Props {}
export const Title: React.FunctionComponent<Props> = (props) => {
  return <h1 className={"text-3xl font-bold mb-6 mt-5"}>{props.children}</h1>;
};
