export interface UserModel {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  banks?: BankModel[];
}

export interface TrueLayerModel {
  refreshToken: string;
  accessToken: string;
  scope: string[];
  expiresAt: Date;
  lastAccessAt: Date;
}

export interface BankModel {
  name: string;
  trueLayer: TrueLayerModel;
  accounts?: AccountModel[];
}

export interface BalanceModel {
  currency: string;
  available: number;
  current: number;
  overdraft: number;
}

export interface TransactionModel {
  currency: string;
  amount: number;
  description: string;
  timestamp: Date;
}

export interface AccountModel {
  name: string;
  bankLogo: string;

  trueLayerType: string;
  trueLayerId: string;

  accountNumber: string;
  sortCode: string;
  currency: string;
  balance: BalanceModel;

  transactions: TransactionModel[];
}

export interface ExchangeCodeResponse {
  access_token: string;
  expires_in: number;
  token_type: string;
  refresh_token: string;
  scope: string;
}

export interface RefreshTokenResponse {
  access_token: string;
  expires_in: number;
  token_type: string;
  refresh_token: string;
}

// Response from https://docs.truelayer.com/#list-all-accounts
export interface AccountResponse {
  account_id: string;
  account_type: string;
  display_name: string;
  currency: string;
  account_number: {
    iban: string;
    swift_bic: string;
    number: string;
    sort_code: string;
  };
  provider: {
    display_name: string;
    provider_id: string;
    logo_url: string;
  };
}
