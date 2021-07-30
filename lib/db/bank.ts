import {
  getTruelayerAccounts,
  refreshTokenTrueLayer,
} from "lib/truelayer/data";
import moment from "moment";
import { DeleteResult, Document, ObjectId, UpdateResult } from "mongodb";
import { Account, AccountResponse, Bank } from "types/global";
import { connectMongo } from "./mongodb";

export const getBanks = async (): Promise<Bank[]> => {
  const { db } = await connectMongo();
  return db.collection("banks").find({}).toArray();
};

export const getBank = async (id: string): Promise<Bank | undefined> => {
  const { db } = await connectMongo();
  return db.collection("banks").findOne({ _id: new ObjectId(id) }) as Promise<
    Bank | undefined
  >;
};

export const deleteBank = async (id: string): Promise<DeleteResult> => {
  const { db } = await connectMongo();
  return db.collection("banks").deleteOne({ _id: new ObjectId(id) });
};

export const updateBank = async (id: string, args: Partial<Bank>) => {
  const { db } = await connectMongo();
  return db
    .collection("banks")
    .updateOne({ _id: new ObjectId(id) }, { $set: args });
};

export const createBank = async (bank: Omit<Bank, "_id">) => {
  const { db } = await connectMongo();
  return db.collection("banks").insertOne(bank);
};

export const initializeBankAccounts = async (
  id: string
): Promise<Document | UpdateResult | Error> => {
  const accountResponse = await getTruelayerAccounts(id);

  if (accountResponse instanceof Error) return accountResponse;

  const mappedAccounts = accountResponse.map(mapTrueLayerAccount);

  const updatedResponse = await updateBank(id, { accounts: mappedAccounts });

  return updatedResponse;
};

export const mapTrueLayerAccount = (account: AccountResponse): Account => {
  return {
    trueLayerId: account.account_id,
    trueLayerType: account.account_type,
    name: account.display_name,
    currency: account.currency,
    accountNumber: {
      iban: account.account_number.iban,
      number: account.account_number.number,
      swiftBic: account.account_number.swift_bic,
      sortCode: account.account_number.sort_code,
    },
    provider: {
      displayName: account.provider.display_name,
      logoUri: account.provider.logo_uri,
      providerId: account.provider.provider_id,
    },
    trueLayerUpdatedAt: moment(account.update_timestamp).toDate(),
    transactions: [],
  };
};

export const refreshBankIfNeeded = async (id: string): Promise<boolean> => {
  const bank = await getBank(id);

  if (bank === undefined) return false;

  if (bank.trueLayer === null) return false;

  if (moment(bank.trueLayer.expiresAt).isAfter(moment().add(1, "minute")))
    return false;

  const refreshResponse = await refreshTokenTrueLayer(
    bank.trueLayer.refreshToken
  );

  if (refreshResponse instanceof Error) return false;

  await updateBank(id, {
    trueLayer: {
      accessToken: refreshResponse.access_token,
      refreshToken: refreshResponse.refresh_token,
      expiresAt: moment().add(refreshResponse.expires_in, "seconds").toDate(),
      scope: bank.trueLayer.scope,
      lastAccessAt: moment().toDate(),
    },
  });

  return true;
};
