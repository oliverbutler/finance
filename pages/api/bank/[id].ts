import type { NextApiRequest, NextApiResponse } from "next";
import { connectMongo } from "lib/db/mongodb";
import { deleteBank, getBank, getBanks, updateBank } from "lib/db/banks";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { id } = req.query;
  let result;

  switch (req.method) {
    case "GET":
      const bank = await getBank(id as string);
      return res.json(bank);
    case "DELETE":
      result = await deleteBank(id as string);
      return res.json(result);
    case "PATCH":
      result = await updateBank(id as string, req.body);
      return res.json(result);

    default:
      return res.status(405).json({
        message: "Method not allowed",
      });
  }
}
