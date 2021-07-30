import React from "react";
import Page from "../components/Page/Page";
import { useSession } from "next-auth/client";
import { useQuery } from "react-query";
import { Button, Button_Type } from "components/Button/Button";
import { Title } from "components/Typography/Typography";
import { ConnectBankButton } from "components/ConnectBank/ConnectBankButton";
import { Bank } from "types/global";
import { BankCard } from "components/Bank/BankCard";
import { Loading } from "components/Loading/Loading";

export default function Home() {
  const { isLoading, error, data } = useQuery<Bank[]>("banks", () =>
    fetch("http://localhost:4000/api/banks").then((res) => res.json())
  );

  return (
    <Page>
      <Title>Banks</Title>
      <ConnectBankButton />
      {isLoading && <Loading />}
      {data && data.map((bank) => <BankCard key={bank._id} bank={bank} />)}
    </Page>
  );
}
