import React from "react";
import Page from "../components/Page/Page";
import { useSession } from "next-auth/client";

export default function Home() {
  const [session, loading] = useSession();

  return (
    <Page>
      <h1 className="text-2xl font-bold">Welcome {session?.user?.name}</h1>
    </Page>
  );
}
