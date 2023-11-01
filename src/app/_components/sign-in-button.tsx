"use client";

import { useCacheBustedNavigation } from "$next-helpers";
import { type WithClassName } from "$react-types";
import { Button, type ButtonProps } from "@mantine/core";
import { signIn, useSession } from "next-auth/react";
import { useEffect, type FC } from "react";

export const SignInButton: FC<WithClassName> = ({ className }) => {
  const session = useSession();
  const navigation = useCacheBustedNavigation();

  useEffect(() => {
    console.log("(sign-in-button) Rendered!", { session });
  });

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
      onClick={() => navigation.push(`/users/${session.data?.user?.id}/edit`)}
    >
      Profile
    </Button>
  );
};
