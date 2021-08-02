import { getUser } from "lib/auth";
import { plaid } from "lib/plaid/plaid";
import type { NextApiRequest, NextApiResponse } from "next";
import { getSession } from "next-auth/client";
import { CountryCode, Products } from "plaid";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const session = await getUser(req);
  if (!session) return res.status(401).send("No Authorized Session");

  if (session.id === undefined || session.id === null)
    return res.status(401).send("Session doesn't have a id field");

  switch (req.method) {
    case "GET":
      plaid.pay({
        ac,
      });
    case "POST":
      const token = await plaid
        .linkTokenCreate({
          user: {
            client_user_id: session.id,
          },
          client_name: "Personal Finances",
          products: [Products.Auth, Products.Transactions],
          country_codes: [CountryCode.Gb],
          language: "en",
        })
        .then((res) => res.data);
      return res.json(token);
    default:
      return res.status(405).json({
        message: "Method not allowed",
      });
  }
}
