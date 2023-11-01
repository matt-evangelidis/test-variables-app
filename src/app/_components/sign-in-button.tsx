"use client";

import { useCacheBustedNavigation } from "$next-helpers";
import { Button, type ButtonProps } from "@mantine/core";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { type FC } from "react";

export const SignInButton: FC<ButtonProps> = (props) => {
  const session = useSession();
  const navigation = useCacheBustedNavigation();

  if (session.status === "loading") return null;

  if (session.status === "unauthenticated")
    return (
      <Button {...props} component={Link} href={"/auth/sign-in"}>
        Sign In
      </Button>
    );

  return (
    <Button
      {...props}
      onClick={() => navigation.push(`/users/${session.data?.user?.id}/edit`)}
    >
      Profile
    </Button>
  );
};
