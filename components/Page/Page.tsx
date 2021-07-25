import React from "react";

const Page: React.FunctionComponent = (props) => {
  return <div className="m-5">{props.children}</div>;
};

export default Page;
