import { signIn, signOut, useSession } from "next-auth/client";
import Link from "next/link";
import Image from "next/image";
import React from "react";

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
    <nav className="flex justify-between p-4 bg-gray-800 text-white">
      <div>
        {PAGES.map((page) => (
          <Link href={page.path} key={page.path}>
            <a className="border-b-2">{page.title}</a>
          </Link>
        ))}
      </div>
      <div className="flex flex-row">
        {session ? (
          <button onClick={() => signOut()}>Sign Out</button>
        ) : (
          <button onClick={() => signIn()}>Sign In</button>
        )}
      </div>
    </nav>
  );
};

export default Navigation;
