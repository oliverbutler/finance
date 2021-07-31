import React from "react";
import Page from "../components/Page/Page";
import { useQuery } from "react-query";
import { Bank } from "types/global";
import { Loading } from "components/Loading/Loading";
import { mapBanksToAccounts, sumAccountsBalances } from "lib/utils";
import { Accounts } from "components/Account/Accounts";
import { Sensitive } from "components/Sensitive/Sensitive";
import { Transactions } from "components/Transactions/Transactions";
import { MoneyOverTime } from "components/Charts/MoneyOverTime";

export default function Home() {
  const { isLoading, error, data } = useQuery<Bank[]>("banks", () =>
    fetch("http://localhost:4000/api/banks").then((res) => res.json())
  );

  const accounts = data && mapBanksToAccounts(data);

  const currentBalance = sumAccountsBalances(accounts).toFixed(2);

  return (
    <Page>
      <div className="py-12 lg:flex lg:items-center lg:justify-between">
        <h2 className="text-3xl font-extrabold tracking-tight text-gray-900 sm:text-4xl">
          <span className="block">Welcome to your Dashboard</span>
          <span className="block text-indigo-600">
            You&lsquo;ve currently got £<Sensitive>{currentBalance}</Sensitive>
          </span>
        </h2>
      </div>
      {isLoading && <Loading />}
      {accounts && <Accounts accounts={accounts} />}
      {/* <MoneyOverTime /> */}
      <Transactions />
    </Page>
  );
}
