import { NextApiRequest } from "next";
import { getSession } from "next-auth/client";

interface UserSession {
  user?: {
    name?: string | null;
    email?: string | null;
    image?: string | null;
  };
  expires?: string;
  id?: string;
}

export const getUser = async (req: NextApiRequest) => {
  const session: UserSession | null = (await getSession({
    req,
  })) as UserSession | null;

  return session;
};
