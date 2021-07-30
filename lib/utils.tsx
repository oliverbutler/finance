import React from "react";
import { Account, Bank } from "types/global";

const prettyJson = (json: JSON) => JSON.stringify(json, null, 2);

interface Props {
  json: any;
}

export const PrettyPrint = ({ json }: Props) => {
  return <pre>{prettyJson(json)}</pre>;
};

export const mapBanksToAccounts = (banks: Bank[]): Account[] => {
  let accounts: Account[] = [];
  banks.forEach((bank) => accounts.push(...bank.accounts));
  return accounts;
};
