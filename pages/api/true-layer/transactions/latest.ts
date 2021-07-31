import { batchUpsertTransactions } from "lib/db/transaction";
import { fetchLatestTransactions } from "lib/truelayer/data";
import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  switch (req.method) {
    case "PATCH":
      if (req.body.bankId === undefined)
        return res.status(400).json({ error: "Missing bankId" });

      if (req.body.accountId === undefined)
        return res.status(400).json({ error: "Missing accountId" });

      const result = await fetchLatestTransactions(
        req.body.bankId,
        req.body.accountId
      );

      if (result instanceof Error)
        return res.status(400).json({
          message: result.message,
          name: result.name,
          stack: result.stack,
        });

      const batchResult = await batchUpsertTransactions(result);

      return res.json(batchResult);

    default:
      return res.status(405).json({
        message: "Method not allowed",
      });
  }
}
