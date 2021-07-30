import { Sensitive } from "components/Sensitive/Sensitive";
import moment from "moment";
import Image from "next/image";
import React from "react";
import { Account } from "types/global";

interface Props {
  accounts: Account[];
}
export const Accounts: React.FunctionComponent<Props> = ({ accounts }) => {
  return (
    <div className="flex">
      {accounts.map((account) => (
        <div
          key={account.trueLayerId}
          className="flex mb-6 w-2/6 bg-indigo-500 mr-6 text-white rounded-xl p-4 cursor-pointer"
        >
          <div className="mr-6">
            <img
              src={account.provider.logoUri}
              height={50}
              width={50}
              style={{ filter: "brightness(0) invert(1)" }}
            ></img>
          </div>
          <div>
            <div>
              <p className="font-light text-indigo-100 text-sm">
                Balance {moment(account.balance?.updatedAt).fromNow()}
              </p>
              <p className="font-bold text-2xl">
                £<Sensitive>{account.balance?.current}</Sensitive>
              </p>
            </div>
            <div>
              <p className="font-light text-indigo-100 text-sm mt-6">
                Account Number
              </p>
              <p className="font-bold font-mono">
                <span className="mr-3">
                  <Sensitive>{account.accountNumber.number}</Sensitive>
                </span>
                {account.accountNumber.sortCode}
              </p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};
