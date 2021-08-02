import axios from "axios";
import Page from "components/Page/Page";
import { PlaidLink } from "components/Plaid/PlaidLink";
import { Title } from "components/Typography/Typography";
import { ac } from "lib/axios";
import React from "react";
import { useEffect } from "react";

interface Props {}
const Connect: React.FunctionComponent<Props> = (props) => {
  const [linkToken, setLinkToken] = React.useState<string | null>(null);

  useEffect(() => {
    ac.post("/plaid/link-token").then((res) => {
      console.log(res.data);
      setLinkToken(res.data.link_token);
    });
  }, []);

  if (linkToken) {
    return <PlaidLink linkToken={linkToken} />;
  }

  return (
    <Page>
      <Title>Connect</Title>
    </Page>
  );
};

export default Connect;
