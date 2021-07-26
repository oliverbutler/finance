import { database } from "models";
import { getBankModels } from "models/bank";
import type { NextApiRequest, NextApiResponse } from "next";
import dbConnect from "utils/db/mongodb";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  await dbConnect();

  switch (req.method) {
    case "GET":
      const banks = await getBankModels();
      res.json(banks);
      break;
    case "POST":

    default:
      res.status(405).json({
        message: "Method not allowed",
      });
  }
}
