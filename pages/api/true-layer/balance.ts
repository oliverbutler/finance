import { updateBankBalances } from "lib/db/bank";
import { getAccountBalance } from "lib/truelayer/data";
import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  switch (req.method) {
    case "PUT":
      if (req.body.bankId === undefined)
        return res.status(405).send("bankId required");

      const result = await updateBankBalances(req.body.bankId);
      return res.send(result);
    default:
      return res.status(405).json({
        message: "Method not allowed",
      });
  }
}
