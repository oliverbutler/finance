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
  currency: string;
  available: number;
  current: number;
  overdraft: number;
  trueLayerUpdatedAt: Date;
  updatedAt: Date;
}

export interface Transaction {
  _id: string;
  accountId: string;
  transactionId: string;
  providerTransactionId?: string;
  timestamp: Date;
  importAt: Date;
  description: string;
  transactionType: "CREDIT" | "DEBIT";
  transactionCategory: TransactionResponseCategory;
  transactionClassification: [string];
  merchantName?: string;
  amount: number;
  currency: string;
  meta: Record<string, string>;
  runningBalance: {
    currency: string;
    amount: number;
  } | null;
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

enum TransactionResponseCategory {
  ATM = "ATM",
  BILL_PAYMENT = "BILL_PAYMENT",
  CASH = "CASH",
  CHEQUE = "CHEQUE",
  CORRECTION = "CORRECTION",
  CREDIT = "CREDIT",
  DIRECT_DEBIT = "DIRECT_DEBIT",
  DIVIDEND = "DIVIDEND",
  FEE_CHARGE = "FEE_CHARGE",
  INTEREST = "INTEREST",
  OTHER = "OTHER",
  PURCHASE = "PURCHASE",
  STANDING_ORDER = "STANDING_ORDER",
  TRANSFER = "TRANSFER",
  DEBIT = "DEBIT",
  UNKNOWN = "UNKNOWN",
}

// Response from https://docs.truelayer.com/#retrieve-account-transactions
export interface TransactionResponse {
  transaction_id: string;
  normalised_provider_transaction_id?: string;
  provider_transaction_id?: string;
  timestamp: string;
  description: string;
  transaction_type: "CREDIT" | "DEBIT";
  transaction_category: TransactionResponseCategory;
  transaction_classification: [string];
  merchant_name?: string;
  amount: number;
  currency: string;
  meta: Record<string, string>;
  running_balance: {
    currency: string;
    amount: number;
  };
}

const trueLayerCategory = [
  {
    classification_category: "Uncategorized",
    sub_classification_categories: ["Cash & ATM", "Check"],
  },
  {
    classification_category: "Entertainment",
    sub_classification_categories: [
      "Arts",
      "Music",
      "Dating",
      "Movies & DVDs",
      "Newspaper & Magazines",
      "Social Club",
      "Sport",
      "Games",
    ],
  },
  {
    classification_category: "Education",
    sub_classification_categories: [
      "Tuition",
      "Student Loan",
      "Books & Supplies",
    ],
  },
  {
    classification_category: "Shopping",
    sub_classification_categories: [
      "Pets",
      "Groceries",
      "General",
      "Clothing",
      "Home",
      "Books",
      "Electronics & Software",
      "Hobbies",
      "Sporting Goods",
    ],
  },
  {
    classification_category: "Personal Care",
    sub_classification_categories: [
      "Hair",
      "Laundry",
      "Beauty",
      "Spa & Massage",
    ],
  },
  {
    classification_category: "Health & Fitness",
    sub_classification_categories: [
      "Dentist",
      "Doctor",
      "Eye care",
      "Pharmacy",
      "Gym",
      "Pets",
      "Sports",
    ],
  },
  {
    classification_category: "Food & Dining",
    sub_classification_categories: [
      "Catering",
      "Coffee shops",
      "Delivery",
      "Fast Food",
      "Restaurants",
      "Bars",
    ],
  },
  {
    classification_category: "Gifts & Donations",
    sub_classification_categories: ["Gift", "Charity"],
  },
  {
    classification_category: "Investments",
    sub_classification_categories: [
      "Equities",
      "Bonds",
      "Bank products",
      "Retirement",
      "Annuities",
      "Real-estate",
    ],
  },
  {
    classification_category: "Bills and Utilities",
    sub_classification_categories: [
      "Television",
      "Home Phone",
      "Internet",
      "Mobile Phone",
      "Utilities",
    ],
  },
  {
    classification_category: "Auto & Transport",
    sub_classification_categories: [
      "Auto Insurance",
      "Auto Payment",
      "Parking",
      "Public transport",
      "Service & Auto Parts",
      "Taxi",
      "Gas & Fuel",
    ],
  },
  {
    classification_category: "Travel",
    sub_classification_categories: [
      "Air Travel",
      "Hotel",
      "Rental Car & Taxi",
      "Vacation",
    ],
  },
  {
    classification_category: "Fees & Charges",
    sub_classification_categories: [
      "Service Fee",
      "Late Fee",
      "Finance Charge",
      "ATM Fee",
      "Bank Fee",
      "Commissions",
    ],
  },
  {
    classification_category: "Business Services",
    sub_classification_categories: [
      "Advertising",
      "Financial Services",
      "Office Supplies",
      "Printing",
      "Shipping",
      "Legal",
    ],
  },
  {
    classification_category: "Personal Services",
    sub_classification_categories: [
      "Advisory and Consulting",
      "Financial Services",
      "Lawyer",
      "Repairs & Maintenance",
    ],
  },
  {
    classification_category: "Taxes",
    sub_classification_categories: [
      "Federal Tax",
      "State Tax",
      "Local Tax",
      "Sales Tax",
      "Property Tax",
    ],
  },
  {
    classification_category: "Gambling",
    sub_classification_categories: ["Betting", "Lottery", "Casino"],
  },
  {
    classification_category: "Home",
    sub_classification_categories: [
      "Rent",
      "Mortgage",
      "Secured loans",
      "Pension and insurances",
      "Pension payments",
      "Life insurance",
      "Buildings and contents insurance",
      "Health insurance",
    ],
  },
];
