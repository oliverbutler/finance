import axios from "axios";
import { getBank, refreshBankIfNeeded } from "lib/db/bank";
import {
  AccountResponse,
  ExchangeCodeResponse,
  RefreshTokenResponse,
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

// /**
//  * @param {number} bankId
//  *
//  * Populates the bank entry with TrueLayer accounts.
//  **/
// const populateTrueLayerAccounts = async (
//   bankId: number
// ): Promise<BankModel | Error> => {
//   const accountsResponse = await getTruelayerAccounts(bankId);

//   if (accountsResponse instanceof Error) {
//     return accountsResponse;
//   }

//   const bank = await Bank.findByPk(bankId);

//   // Map each TrueLayer account to an AccountModel
//   accountsResponse.forEach((account) => {
//     const newAccount = Account.create({
//       accountId: account.account_id,
//       accountType: account.account_type,
//       bankName: account.provider.display_name,
//       displayName: account.display_name,
//       currency: account.currency,
//       accountNumber: account.account_number.number,
//       sortCode: account.account_number.sort_code,
//       swiftBic: account.account_number.swift_bic,
//       iban: account.account_number.iban,
//       providerId: account.provider.provider_id,
//       bankLogo: account.provider.logo_url,
//     });

//     // TODO set AccountModel PK to accountId so we can just update it whenever, without risk
//     // TODO then update bank to have the latest info
//   });

//   return bank;
// };
