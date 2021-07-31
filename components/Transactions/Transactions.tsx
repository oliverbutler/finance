import axios from "axios";
import classNames from "classnames";
import { Sensitive } from "components/Sensitive/Sensitive";
import React from "react";
import { useQuery } from "react-query";
import { Transaction } from "types/global";

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

export const Transactions: React.FunctionComponent = () => {
  const { data, isLoading, error } = useQuery<Transaction[]>(
    "transactions",
    () =>
      axios
        .get(`http://localhost:4000/api/transactions?limit=50&offset=0`)
        .then((res) => res.data)
  );

  return (
    <div className="mt-4">
      {data?.map((transaction) => (
        <div
          key={transaction._id}
          className="bg-gray-100 mb-4 p-4 flex justify-between rounded-xl"
        >
          <div>
            <p className="font-bold">{transaction.merchantName ?? "Unknown"}</p>
            <p className="text-xs text-gray-500">{transaction.description}</p>
          </div>
          <TransactionAmount amount={transaction.amount} />
        </div>
      ))}
    </div>
  );
};
