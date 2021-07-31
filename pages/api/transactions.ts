import { getTransactions } from "lib/db/transaction";
import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  switch (req.method) {
    case "GET":
      const transactions = await getTransactions(
        {},
        Number(req.query.limit),
        Number(req.query.offset)
      );
      return res.json(transactions);
    default:
      return res.status(405).json({
        message: "Method not allowed",
      });
  }
}
