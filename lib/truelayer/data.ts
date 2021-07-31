import axios from "axios";
import { getBank, refreshBankIfNeeded } from "lib/db/bank";
import { connectMongo } from "lib/db/mongodb";
import moment from "moment";
import { Moment } from "moment";
import {
  AccountResponse,
  Balance,
  ExchangeCodeResponse,
  RefreshTokenResponse,
  Transaction,
  TransactionResponse,
} from "types/global";

const TRUE_LAYER_CLIENT_ID = process.env.TRUE_LAYER_CLIENT_ID;
const TRUE_LAYER_CLIENT_SECRET = process.env.TRUE_LAYER_CLIENT_SECRET;

if (!TRUE_LAYER_CLIENT_ID || !TRUE_LAYER_CLIENT_SECRET)
  throw new Error(
    "TRUE_LAYER_CLIENT_ID and TRUE_LAYER_CLIENT_SECRET must be set in environment"
  );

export const exchangeCode = async (
  code: string
): Promise<ExchangeCodeResponse | Error> => {
  const params = new URLSearchParams();
  params.set("grant_type", "authorization_code");
  params.set("client_id", TRUE_LAYER_CLIENT_ID);
  params.set("client_secret", TRUE_LAYER_CLIENT_SECRET);
  params.set("redirect_uri", "http://localhost:4000/callback");
  params.set("code", code);

  return axios
    .post(`https://${process.env.TRUE_LAYER_AUTH_API}/connect/token`, params, {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
    })
    .then((res) => {
      return res.data as ExchangeCodeResponse;
    })
    .catch(() => new Error("Exchange code failed"));
};

export const refreshTokenTrueLayer = async (
  refreshToken: string
): Promise<RefreshTokenResponse | Error> => {
  const params = new URLSearchParams();
  params.set("grant_type", "refresh_token");
  params.set("client_id", TRUE_LAYER_CLIENT_ID);
  params.set("client_secret", TRUE_LAYER_CLIENT_SECRET);
  params.set("refresh_token", refreshToken);

  return axios
    .post(`https://${process.env.TRUE_LAYER_AUTH_API}/connect/token`, params, {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
    })
    .then((res) => {
      return res.data as RefreshTokenResponse;
    })
    .catch((err) => {
      return new Error("Refresh token flow failed");
    });
};

/**
 * @param {string} id
 *
 * Gets a list of accounts for a bank from TrueLayer.
 **/
export const getTruelayerAccounts = async (
  bankId: string
): Promise<AccountResponse[] | Error> => {
  const bank = await getBank(bankId);

  if (bank === undefined) {
    return new Error(`No Bank ${bankId} found`);
  }

  // If we're expired, kick off a refresh
  await refreshBankIfNeeded(bankId);

  return axios
    .get(`https://${process.env.TRUE_LAYER_API}/data/v1/accounts`, {
      headers: {
        Authorization: `Bearer ${bank.trueLayer?.accessToken}`,
      },
    })
    .then((res) => res.data.results as AccountResponse[])
    .catch(() => new Error("Error fetching TrueLayer accounts"));
};

export const getAccountBalance = async (
  bankId: string,
  accountId: string
): Promise<Balance | Error> => {
  const bank = await getBank(bankId);
  if (bank === undefined) return new Error("Bank doesn't exist");

  // If we're expired, kick off a refresh
  await refreshBankIfNeeded(bankId);

  return axios
    .get(
      `https://${process.env.TRUE_LAYER_API}/data/v1/accounts/${accountId}/balance`,
      {
        headers: {
          Authorization: `Bearer ${bank.trueLayer?.accessToken}`,
        },
      }
    )
    .then((res) => {
      const data = res.data.results[0];
      const balance: Balance = {
        currency: data.currency,
        available: data.available,
        current: data.current,
        overdraft: data.overdraft,
        trueLayerUpdatedAt: new Date(data.update_timestamp),
        updatedAt: new Date(),
      };
      return balance;
    })
    .catch((err) => {
      return new Error("TL request for balance failed");
    });
};

export const fetchTransactionsTimeSpan = async (
  bankId: string,
  accountId: string,
  from?: string,
  to?: string
): Promise<Omit<Transaction, "_id">[] | Error> => {
  const bank = await getBank(bankId);
  if (bank === undefined) return new Error("Bank doesn't exist");

  // If we're expired, kick off a refresh
  await refreshBankIfNeeded(bankId);

  return axios
    .get(
      from && to
        ? `https://${process.env.TRUE_LAYER_API}/data/v1/accounts/${accountId}/transactions?from=${from}&to=${to}`
        : `https://${process.env.TRUE_LAYER_API}/data/v1/accounts/${accountId}/transactions`,
      {
        headers: {
          Authorization: `Bearer ${bank.trueLayer?.accessToken}`,
        },
      }
    )
    .then((res) => {
      const trueLayerResults = res.data.results as TransactionResponse[];
      return trueLayerResults.map((t) => mapTrueLayerTransaction(t, accountId));
    })
    .catch((err) => err);
};

export const fetchTwoYearsTransactions = async (
  bankId: string,
  accountId: string
): Promise<Omit<Transaction, "_id">[] | Error> => {
  return fetchTransactionsTimeSpan(
    bankId,
    accountId,
    moment().subtract(1, "y").format("YYYY-MM-DD"),
    moment().subtract(1, "d").format("YYYY-MM-DD")
  );
};

export const fetchLatestTransactions = async (
  bankId: string,
  accountId: string
): Promise<Omit<Transaction, "_id">[] | Error> => {
  return fetchTransactionsTimeSpan(bankId, accountId);
};

export const mapTrueLayerTransaction = (
  transaction: TransactionResponse,
  accountId: string
): Omit<Transaction, "_id"> => {
  return {
    transactionId: transaction.transaction_id,
    accountId: accountId,
    timestamp: new Date(transaction.timestamp),
    importAt: new Date(),
    description: transaction.description,
    transactionType: transaction.transaction_type,
    transactionCategory: transaction.transaction_category,
    transactionClassification: transaction.transaction_classification,
    merchantName: transaction.merchant_name,
    amount: transaction.amount,
    currency: transaction.currency,
    meta: transaction.meta,
    runningBalance: {
      currency: transaction.running_balance.currency,
      amount: transaction.running_balance.amount,
    },
  };
};
