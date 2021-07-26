export interface TrueLayer {
  id: string;
  refreshToken: string;
  accessToken: string;
  scope: string[];
  expiresAt: string;
  lastAccessAt: string;
}

export interface Bank {
  id: string;
  name: string;
  trueLayer: TrueLayer | null;
  accounts: Account[];
  createdAt: string;
  updatedAt: string;
}

export interface Balance {
  id: string;
  currency: string;
  available: number;
  current: number;
  overdraft: number;
}

export interface Transaction {
  id: string;
  currency: string;
  amount: number;
  description: string;
  timestamp: string;
}

export interface Account {
  id: string;
  name: string;
  bankLogo: string;
  trueLayerType: string;
  trueLayerId: string;
  accountNumber: string;
  sortCode: string;
  currency: string;
  balance: Balance;
  transactions: Transaction[];
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
