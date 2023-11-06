"use client";

import { useCacheBustedNavigation } from "$next-helpers";
import { Button, type ButtonProps } from "@mantine/core";
import Link from "next/link";
import { type FC } from "react";
import { useSessionContext } from "~/auth/session-provider";

export const SignInButton: FC<ButtonProps> = (props) => {
  const session = useSessionContext();
  const navigation = useCacheBustedNavigation();

  if (!session)
    return (
      <Button {...props} component={Link} href={"/auth/sign-in"}>
        Sign In
      </Button>
    );

  return (
    <Button
      {...props}
      onClick={() => navigation.push(`/users/${session.user.userId}/edit`)}
    >
      Profile
    </Button>
  );
};
