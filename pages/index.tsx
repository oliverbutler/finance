import React from "react";
import Page from "../components/Page/Page";
import { useSession } from "next-auth/client";
import { useQuery } from "react-query";
import { Button, Button_Type } from "components/Button/Button";
import { Title } from "components/Typography/Typography";
import { ConnectBankButton } from "components/ConnectBank/ConnectBankButton";

export default function Home() {
  const [session, loading] = useSession();

  const { isLoading, error, data } = useQuery("banks", () =>
    fetch("http://localhost:4000/api/banks").then((res) => res.json())
  );

  return (
    <Page>
      <Title>Banks</Title>
      <ConnectBankButton />
      {data && <pre>{JSON.stringify(data, null, 2)}</pre>}
    </Page>
  );
}
