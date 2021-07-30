import axios from "axios";
import { Button, Button_Type } from "components/Button/Button";
import moment from "moment";
import React from "react";
import { Bank } from "types/global";

const handleFetchAccounts = (bankId: string) => {
  axios.put("http://localhost:4000/api/true-layer/accounts", {
    bankId,
  });
};

const handleUpdateBalance = (bankId: string) => {
  axios.put("http://localhost:4000/api/true-layer/balance", {
    bankId,
  });
};

interface Props {
  bank: Bank;
}
export const BankCard: React.FunctionComponent<Props> = ({ bank }) => {
  return (
    <div className="bg-pink-100 p-2 rounded-md mt-4">
      <div className="flex flex-row">
        <Button
          className="mr-4"
          variant={Button_Type.Primary}
          onClick={() => handleFetchAccounts(bank._id)}
        >
          Update Accounts
        </Button>
        <Button
          variant={Button_Type.Primary}
          onClick={() => handleUpdateBalance(bank._id)}
        >
          Update Balance
        </Button>
      </div>
      <p>Name: {bank.name}</p>
      <p>Id: {bank._id}</p>
      <p>Last Updated: {bank.updatedAt}</p>
      <p>Accounts:</p>
      {bank.accounts.map((account) => (
        <div className="ml-6" key={account.trueLayerId}>
          <p>Id: {account.trueLayerId}</p>
          <p> Account: {account.provider.displayName}</p>
          <p> Number: {account.accountNumber.number}</p>
          <p> Sort Code: {account.accountNumber.sortCode}</p>
          <p>
            Balance: {account.balance?.current} @{" "}
            {moment(account.balance?.updatedAt).fromNow()}
          </p>
          <img src={account.provider.logoUri} className="w-16" />
        </div>
      ))}
    </div>
  );
};
