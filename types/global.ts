export interface TrueLayer {
  refreshToken: string;
  accessToken: string;
  scope: string[];
  expiresAt: Date;
  lastAccessAt: Date;
}

export interface Bank {
  _id: string;
  name: string;
  trueLayer: TrueLayer | null;
  accounts: Account[];
  createdAt: Date;
  updatedAt: Date;
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
  trueLayerId: string;
  trueLayerType: string;
  name: string;
  currency: string;
  accountNumber: {
    iban: string;
    swiftBic: string;
    number: string;
    sortCode: string;
  };
  provider: {
    displayName: string;
    providerId: string;
    logoUri: string;
  };
  trueLayerUpdatedAt: Date;

  balance?: Balance;
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
    logo_uri: string;
  };
  update_timestamp: string;
}
