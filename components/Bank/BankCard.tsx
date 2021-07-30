import React from "react";
import { Bank } from "types/global";

interface Props {
  bank: Bank;
}
export const BankCard: React.FunctionComponent<Props> = ({ bank }) => {
  return (
    <div className="bg-pink-100 p-2 rounded-md mt-4">
      <p>Name: {bank.name}</p>
      <p>Id: {bank._id}</p>
      <p>Last Updated: {bank.updatedAt}</p>
      <p>Accounts:</p>
      {bank.accounts.map((account) => (
        <div className="ml-6" key={account.trueLayerId}>
          <p> Account: {account.provider.displayName}</p>
          <p> Number: {account.accountNumber.number}</p>
          <p> Sort Code: {account.accountNumber.sortCode}</p>
          <p>Balance: {account.balance}</p>
        </div>
      ))}
    </div>
  );
};
