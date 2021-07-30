import { signIn, signOut, useSession } from "next-auth/client";
import Link from "next/link";
import { EyeOffIcon } from "@heroicons/react/outline";
import React from "react";
import { Button, Button_Type } from "components/Button/Button";
import { useSensitive } from "components/ContextWrapper/ContextWrapper";

const PAGES = [
  {
    path: "/",
    title: "Home",
    description: "Home page",
  },
];

const Navigation = () => {
  const [session, loading] = useSession();

  const { sensitive, setSensitive } = useSensitive();

  return (
    <>
      <nav className="fixed top-0 w-full flex justify-between p-4 bg-indigo-700 text-white z-50">
        <div>
          {PAGES.map((page) => (
            <Link href={page.path} key={page.path}>
              <a className="font-bold text-md">{page.title}</a>
            </Link>
          ))}
        </div>
        <div className="flex flex-row">
          <Button
            className="-m-2 mr-4"
            variant={Button_Type.Primary}
            icon={<EyeOffIcon />}
            onClick={() => setSensitive(!sensitive)}
          />
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
