import axios from "axios";
import classNames from "classnames";
import { Sensitive } from "components/Sensitive/Sensitive";
import moment from "moment";
import React from "react";
import { useQuery } from "react-query";
import { Account, Transaction } from "types/global";
import { TransactionLogo } from "./TransactionLogo";

interface TransactionAmountProps {
  amount: number;
}

const TransactionAmount: React.FunctionComponent<TransactionAmountProps> = ({
  amount,
}) => {
  return (
    <div className="flex items-center">
      <div
        className={classNames(
          " p-1 px-3 text-center rounded-xl w-min font-bold font-mono ",
          { "bg-green-100 text-green-700": amount > 0 },
          { "bg-red-100 text-red-700": amount < 0 }
        )}
      >
        <Sensitive>{amount.toFixed(2)}</Sensitive>
      </div>
    </div>
  );
};

interface TransactionProps {
  accounts: Account[] | undefined;
}

export const Transactions: React.FunctionComponent<TransactionProps> = ({
  accounts,
}) => {
  const { data, isLoading, error } = useQuery<Transaction[]>(
    "transactions",
    () =>
      axios
        .get(`http://localhost:4000/api/transactions?limit=20&offset=0`)
        .then((res) => res.data)
  );

  const getAccountOfTransaction = (
    transaction: Transaction
  ): Account | undefined => {
    return accounts
      ? accounts.find((acc) => acc.trueLayerId === transaction.accountId)
      : undefined;
  };

  return (
    <div className="mt-4">
      {data?.map((transaction) => (
        <div
          key={transaction._id}
          className="bg-gray-100 mb-4 p-4 flex justify-between rounded-xl"
        >
          <div className="flex flex-row">
            <div className="mr-6 flex items-center">
              <TransactionLogo transaction={transaction} />
            </div>
            <div>
              <p className="font-bold">
                {transaction.merchantName ?? "Unknown"}
              </p>
              <p className="text-xs text-gray-500">{transaction.description}</p>
              <p className="text-xs text-gray-500">
                {moment(transaction.timestamp).format("DD/MM/YYYY HH:SS")}
              </p>
            </div>
          </div>
          <div className="flex flex-row">
            <TransactionAmount amount={transaction.amount} />
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              className="ml-4"
              alt="Account logo"
              src={
                getAccountOfTransaction(transaction)?.provider?.logoUri ?? ""
              }
              height={25}
              width={25}
              style={{ filter: "brightness(0) invert(0.7)" }}
            ></img>
          </div>
        </div>
      ))}
    </div>
  );
};
