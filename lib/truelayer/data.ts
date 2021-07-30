import axios from "axios";
import { getBank, refreshBankIfNeeded } from "lib/db/bank";
import {
  AccountResponse,
  Balance,
  ExchangeCodeResponse,
  RefreshTokenResponse,
  Transaction,
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
  params.set("redirect_uri", "http://localhost:3000/callback");
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

export const getAllAccountTransactions = async (
  bankId: string,
  accountId: string
): Promise<Transaction[]> => {
  return [];
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
