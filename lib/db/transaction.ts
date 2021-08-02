import {
  Document,
  Filter,
  InsertManyResult,
  ObjectId,
  UpdateResult,
} from "mongodb";
import { Transaction } from "types/global";
import { connectMongo } from "./mongodb";

export const getTransactions = async (
  filter: Filter<Document>,
  limit: number,
  offset: number
): Promise<Transaction[]> => {
  const { db } = await connectMongo();

  return db
    .collection("transactions")
    .find(filter)
    .skip(offset)
    .limit(limit)
    .sort({ timestamp: -1 })
    .toArray();
};

export const getTransactionsGroupAccount = async (
  filter: Filter<Document>,
  limit: number,
  offset: number
): Promise<Transaction[]> => {
  const { db } = await connectMongo();

  return db
    .collection("transactions")
    .find(filter)
    .skip(offset)
    .limit(limit)

    .sort({ timestamp: -1 })
    .toArray();
};

export const getTransactionsOfAccount = async (
  accountId: string,
  limit: number,
  offset: number
): Promise<Transaction[]> => {
  return await getTransactions({ accountId: accountId }, limit, offset);
};

export const getTransaction = async (
  id: string
): Promise<Transaction | undefined> => {
  const { db } = await connectMongo();

  return db
    .collection("transactions")
    .findOne({ _id: new ObjectId(id) }) as Promise<Transaction | undefined>;
};

export const upsertTransaction = async (
  transaction: Omit<Transaction, "_id">
): Promise<Document | UpdateResult> => {
  const { db } = await connectMongo();

  return db
    .collection("transactions")
    .updateOne({ transactionId: transaction.transactionId }, transaction, {
      upsert: true,
    });
};

export const batchUpsertTransactions = async (
  transactions: Omit<Transaction, "_id">[]
): Promise<InsertManyResult<Transaction> | Error> => {
  const { db } = await connectMongo();

  return db
    .collection("transactions")
    .insertMany(transactions, { ordered: false })
    .catch((err) => err);
};
