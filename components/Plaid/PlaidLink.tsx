import React from "react";
import { PlaidLinkOptions, usePlaidLink } from "react-plaid-link";

interface Props {
  linkToken: string;
}
export const PlaidLink: React.FunctionComponent<Props> = ({ linkToken }) => {
  const config: PlaidLinkOptions = {
    onSuccess: (public_token, metadata) => {
      console.info("PL onSuccess: ", public_token, metadata);
    },
    onExit: (err, metadata) => {
      console.error("PL onExit: ", err, metadata);
    },
    token: linkToken,
  };

  const { open, exit, ready } = usePlaidLink(config);

  console.log(linkToken);

  if (ready) {
    open();
  }

  return <div></div>;
};
