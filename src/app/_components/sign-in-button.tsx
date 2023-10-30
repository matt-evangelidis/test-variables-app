"use client";

import { type WithClassName } from "$react-types";
import { Button } from "@mantine/core";
import { signIn, signOut, useSession } from "next-auth/react";
import { type FC } from "react";

export const SignInButton: FC<WithClassName> = ({ className }) => {
  const session = useSession();

	if (session.status === 'loading') return null;


	const handler = () => session.status === "authenticated" ? signOut() : signIn();

  return (
    <Button variant="subtle" className={className} onClick={() => handler()}>
      Sign {session.status === "authenticated" ? "Out" : "In"}
    </Button>
  );
};
