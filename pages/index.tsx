import React from "react";
import Page from "../components/Page/Page";
import { useSession } from "next-auth/client";
import { useQuery } from "react-query";
import { Button, Button_Type } from "components/Button/Button";
import { Title } from "components/Typography/Typography";
import { ConnectBankButton } from "components/ConnectBank/ConnectBankButton";
import { Account, Bank } from "types/global";
import { BankCard } from "components/Bank/BankCard";
import { Loading } from "components/Loading/Loading";
import { mapBanksToAccounts } from "lib/utils";
import { Accounts } from "components/Account/Accounts";

export default function Home() {
  const { isLoading, error, data } = useQuery<Bank[]>("banks", () =>
    fetch("http://localhost:4000/api/banks").then((res) => res.json())
  );

  const accounts = data && mapBanksToAccounts(data);

  const currentBalance = Number(
    accounts?.reduce((a, b) => a.balance?.current + b.balance?.current)
  ).toFixed(2);

  return (
    <Page>
      <div className="py-12 lg:flex lg:items-center lg:justify-between">
        <h2 className="text-3xl font-extrabold tracking-tight text-gray-900 sm:text-4xl">
          <span className="block">Welcome to your Dashboard</span>
          <span className="block text-indigo-600">
            You&lsquo;ve currently got £{currentBalance}
          </span>
        </h2>
      </div>

      {isLoading && <Loading />}
      {accounts && <Accounts accounts={accounts} />}
    </Page>
  );
}
