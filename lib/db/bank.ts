import { DeleteResult, ObjectId } from "mongodb";
import { Bank } from "types/global";
import { connectMongo } from "./mongodb";

export const getBanks = async (): Promise<Bank[]> => {
  const { db } = await connectMongo();
  return db.collection("banks").find({}).toArray();
};

export const getBank = async (id: string): Promise<Bank | undefined> => {
  const { db } = await connectMongo();
  return db.collection("banks").findOne({ _id: new ObjectId(id) }) as Promise<
    Bank | undefined
  >;
};

export const deleteBank = async (id: string): Promise<DeleteResult> => {
  const { db } = await connectMongo();
  return db.collection("banks").deleteOne({ _id: new ObjectId(id) });
};

export const updateBank = async (id: string, args: Partial<Bank>) => {
  const { db } = await connectMongo();
  return db
    .collection("banks")
    .updateOne({ _id: new ObjectId(id) }, { $set: args });
};

export const createBank = async (bank: Bank) => {
  const { db } = await connectMongo();
  return db.collection("banks").insertOne(bank);
};
