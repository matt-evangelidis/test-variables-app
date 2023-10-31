"use client";

import { type WithClassName } from "$react-types";
import { Button, type ButtonProps } from "@mantine/core";
import { signIn, signOut, useSession } from "next-auth/react";
import Link from "next/link";
import { type FC } from "react";

export const SignInButton: FC<WithClassName> = ({ className }) => {
  const session = useSession();

  if (session.status === "loading") return null;

  const sharedButtonProps = {
    variant: "subtle",
    className,
  } satisfies Partial<ButtonProps>;

  if (session.status === "unauthenticated")
    return (
      <Button {...sharedButtonProps} onClick={() => signIn()}>
        Sign In
      </Button>
    );

  return (
    <Button
      {...sharedButtonProps}
      component={Link}
      href={`/users/${session.data?.user?.id}/edit`}
    >
      Profile
    </Button>
  );
};
