import {
  getAccountBalance,
  getTruelayerAccounts,
  refreshTokenTrueLayer,
} from "lib/truelayer/data";
import moment from "moment";
import {
  DeleteResult,
  Document,
  InsertOneResult,
  ObjectId,
  UpdateResult,
} from "mongodb";
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

export const createBank = async (
  bank: Omit<Bank, "_id">
): Promise<InsertOneResult<Bank>> => {
  const { db } = await connectMongo();
  return db.collection("banks").insertOne(bank);
};

export const upsertBankAccounts = async (
  id: string
): Promise<Document | UpdateResult | Error> => {
  const { db } = await connectMongo();

  // Get the accounts from truelayer
  const accountResponse = await getTruelayerAccounts(id);
  if (accountResponse instanceof Error) return accountResponse;

  // Map them to bank accounts
  const mappedAccounts = accountResponse.map(mapTrueLayerAccount);

  // Get the bank
  const bank = await getBank(id);
  if (bank === undefined) return new Error("Bank not found");

  // Check which accounts are new
  let newAccounts: Account[] = [];
  mappedAccounts.forEach((account) => {
    // If the account doesn't exist, add it to the new accounts list
    if (!bank.accounts.find((a) => a.trueLayerId === account.trueLayerId))
      newAccounts.push(account);
  });

  // Insert these new accounts into the db
  const upsertResponse = db
    .collection("banks")
    .updateOne(
      { _id: new ObjectId(id) },
      { $addToSet: { accounts: { $each: newAccounts } } }
    );

  return upsertResponse;
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
  };
};

export const refreshBankIfNeeded = async (id: string): Promise<boolean> => {
  const bank = await getBank(id);

  if (bank === undefined) throw new Error("Bank doesn't exist");

  if (bank.trueLayer === null) throw new Error("No TrueLayer auth on bank");

  if (moment(bank.trueLayer.expiresAt).isAfter(moment().add(1, "minute")))
    return false;

  const refreshResponse = await refreshTokenTrueLayer(
    bank.trueLayer.refreshToken
  );

  if (refreshResponse instanceof Error) throw new Error("Error refreshing");

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

export const updateBankBalances = async (
  bankId: string
): Promise<string | Error> => {
  const { db } = await connectMongo();

  const bank = await getBank(bankId);

  if (bank === undefined) return new Error("Bank not found");

  bank.accounts.forEach(async (account, index) => {
    const balance = await getAccountBalance(bankId, account.trueLayerId);

    if (balance instanceof Error)
      return new Error("Can't get balance for account");

    await db.collection("banks").updateOne(
      { _id: new ObjectId(bankId) },
      {
        $set: {
          [`accounts.${index}.balance`]: balance,
        },
      }
    );
  });

  return "Success";
};

export const checkBankBalanceAndUpdate = (bank: Bank): void => {
  const bankAccounts = bank.accounts;

  let markedForRefresh = false;

  bankAccounts.forEach((account) => {
    if (account.balance === undefined) markedForRefresh = true;
    else if (
      moment(account.balance?.updatedAt).isBefore(moment().subtract(30, "m"))
    )
      markedForRefresh = true;
  });

  if (markedForRefresh) updateBankBalances(bank._id);
};
