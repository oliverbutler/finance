import mongoose from "mongoose";
import {
  AccountModel,
  BankModel,
  Database,
  TrueLayerModel,
} from "types/global";

const trueLayerSchema = new mongoose.Schema<TrueLayerModel>({
  refreshToken: {
    type: String,
    required: true,
  },
  scope: {
    type: String,
    required: true,
  },
  accessToken: {
    type: String,
  },
  expiresAt: {
    type: Date,
  },
  lastAccessAt: {
    type: Date,
    required: true,
  },
});

const accountSchema = new mongoose.Schema<AccountModel>(
  {
    name: { type: String, required: true },
    bankLogo: { type: String },
    trueLayerType: { type: String },
    trueLayerId: { type: String },
    accountNumber: { type: String },
    sortCode: { type: String },
    currency: { type: String },
    balance: { type: Number },
  },
  {
    timestamps: true,
  }
);

const bankSchema = new mongoose.Schema<BankModel>(
  {
    name: { type: String, required: true, unique: true },
    trueLayer: trueLayerSchema,
    accounts: [accountSchema],
  },
  { timestamps: true }
);

const Bank = mongoose.model<BankModel>("Bank", bankSchema);
const Account = mongoose.model<AccountModel>("Account", accountSchema);
const TrueLayer = mongoose.model<TrueLayerModel>("TrueLayer", trueLayerSchema);

const database: Database = {
  models: {
    bank: Bank,
    account: Account,
    trueLayer: TrueLayer,
  },
};

export { database };
