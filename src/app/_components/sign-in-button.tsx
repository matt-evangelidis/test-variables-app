"use client";

import { useCacheBustedNavigation } from "$next-helpers";
import { type WithClassName } from "$react-types";
import { Button, type ButtonProps } from "@mantine/core";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { type FC } from "react";

export const SignInButton: FC<WithClassName> = ({ className }) => {
  const session = useSession();
  const navigation = useCacheBustedNavigation();

  if (session.status === "loading") return null;

  const sharedButtonProps = {
    variant: "subtle",
    className,
  } satisfies Partial<ButtonProps>;

  if (session.status === "unauthenticated")
    return (
      <Button {...sharedButtonProps} component={Link} href={"/auth/sign-in"}>
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
