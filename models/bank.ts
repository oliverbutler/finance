import { database } from "models";
import { Bank, BankAttributes, BankModel } from "types/global";

export const mapBankModel = (bank: BankModel): Bank => {
  return {
    id: bank.id,
    name: bank.name,
    createdAt: bank.createdAt.toISOString(),
    updatedAt: bank.updatedAt.toISOString(),
    trueLayer: null,
    accounts: [],
  };
};

export const getBankModels = async (): Promise<BankModel[]> => {
  const banks = await database.models.bank.find({});
  return banks;
};

export const getBankModel = async (id: string): Promise<BankModel | null> => {
  const bank = await database.models.bank.findById(id);
  return bank;
};

export const createBankModel = async (
  bank: BankAttributes
): Promise<BankModel> => {
  const bankModel = await database.models.bank.create(bank);
  return bankModel;
};
