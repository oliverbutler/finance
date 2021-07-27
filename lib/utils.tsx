import React from "react";

const prettyJson = (json: JSON) => JSON.stringify(json, null, 2);

interface Props {
  json: any;
}

export const PrettyPrint = ({ json }: Props) => {
  return <pre>{prettyJson(json)}</pre>;
};
