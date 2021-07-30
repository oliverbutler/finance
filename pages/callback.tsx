import axios from "axios";
import { Loading } from "components/Loading/Loading";
import Page from "components/Page/Page";
import { Title } from "components/Typography/Typography";
import { PrettyPrint } from "lib/utils";
import { useRouter } from "next/dist/client/router";
import React, { useEffect, useState } from "react";

interface Props {}
const Callback: React.FunctionComponent<Props> = (props) => {
  const router = useRouter();

  const authCode = router.query.code ? (router.query?.code as string) : null;

  const [response, setResponse] = useState(null);

  useEffect(() => {
    if (authCode && response === null) {
      axios
        .post("http://localhost:4000/api/true-layer/exchange", {
          code: authCode,
        })
        .then((response) => setResponse(response.data))
        .catch((err) => setResponse(err));
    }
  }, [authCode]);

  return (
    <Page>
      <Title>Successfully Connected To TrueLayer 🎉</Title>

      {!authCode ? (
        <p>Auth Code Missing</p>
      ) : response ? (
        <PrettyPrint json={response} />
      ) : (
        <Loading />
      )}
    </Page>
  );
};

export default Callback;
