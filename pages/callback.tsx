import Page from "components/Page/Page";
import { Title } from "components/Typography/Typography";
import { useRouter } from "next/dist/client/router";
import React from "react";

interface Props {}
const Callback: React.FunctionComponent<Props> = (props) => {
  const router = useRouter();

  const scope = router.query.scope ? (router.query?.scope as string) : null;

  return (
    <Page>
      <Title>Successfully Connected To TrueLayer 🎉</Title>
    </Page>
  );
};

export default Callback;
