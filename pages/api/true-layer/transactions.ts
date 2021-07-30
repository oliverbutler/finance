import type { NextApiRequest, NextApiResponse } from "next";
import { initializeBankAccounts } from "lib/db/bank";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  switch (req.method) {
    case "GET":
      return res.json({});
    default:
      return res.status(405).json({
        message: "Method not allowed",
      });
  }
}
