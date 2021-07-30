import { signIn, signOut, useSession } from "next-auth/client";
import Link from "next/link";
import Image from "next/image";
import React from "react";
import { Button, Button_Type } from "components/Button/Button";

const PAGES = [
  {
    path: "/",
    title: "Home",
    description: "Home page",
  },
];

const Navigation = () => {
  const [session, loading] = useSession();

  return (
    <>
      <nav className="fixed top-0 w-full flex justify-between p-4 bg-gray-800 text-white">
        <div>
          {PAGES.map((page) => (
            <Link href={page.path} key={page.path}>
              <a className="border-b-2">{page.title}</a>
            </Link>
          ))}
        </div>
        <div className="flex flex-row">
          <Button
            className="-m-2"
            variant={session ? Button_Type.Secondary : Button_Type.Primary}
            onClick={session ? () => signOut() : () => signIn()}
          >
            Sign {session ? "out" : "in"}
          </Button>
        </div>
      </nav>
      <div className="mt-10" />
    </>
  );
};

export default Navigation;
