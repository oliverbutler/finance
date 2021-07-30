import React from "react";

const Page: React.FunctionComponent = (props) => {
  return <div className="mx-auto container p-4">{props.children}</div>;
};

export default Page;
