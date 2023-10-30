"use client";

import type { WithClassName } from "$react-types";
import { Button } from "@mantine/core";
import type { FC } from "react";
import { api } from "~/trpc/react";

export const EmailTestButton: FC<WithClassName> = ({ className }) => {
  const sendEmail = api.test.email.useMutation();

  return (
    <Button
      className={className}
      onClick={() => sendEmail.mutate()}
      loading={sendEmail.isLoading}
    >
      Send Email
    </Button>
  );
};
