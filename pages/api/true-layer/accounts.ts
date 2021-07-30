import type { NextApiRequest, NextApiResponse } from "next";
import { initializeBankAccounts } from "lib/db/bank";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  switch (req.method) {
    case "GET":
      // Force renewal of accounts on a bank
      if (req.body.bankId === undefined)
        return res.status(400).json({ error: "Missing bankId" });

      const accountInitializeResult = await initializeBankAccounts(
        req.body.bankId
      );

      return res.json(accountInitializeResult);
    default:
      return res.status(405).json({
        message: "Method not allowed",
      });
  }
}
