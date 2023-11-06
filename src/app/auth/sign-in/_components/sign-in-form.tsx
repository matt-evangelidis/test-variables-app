"use client";

import { Alert, Button, Text, TextInput } from "@mantine/core";
import { useForm, zodResolver } from "@mantine/form";
import Link from "next/link";
import { type FC, useMemo } from "react";
import { type z } from "zod";
import { userSignInFormSchema } from "~/schemas";
import { api } from "~/trpc/react";

const formResolver = zodResolver(userSignInFormSchema);

const useSignInForm = () =>
  useForm<z.infer<typeof userSignInFormSchema>>({
    validate: formResolver,
    initialValues: {
      email: "",
    },
  });

export const SignInForm: FC = () => {
  const form = useSignInForm();

  const signInMutation = api.auth.signIn.useMutation({
    onError: (error) => {
      if (error.data?.code === "NOT_FOUND") {
        form.setFieldError("email", "No email with that address was found");
      }
    },
  });

  const onSubmit = useMemo(
    () =>
      form.onSubmit((data) => {
        signInMutation.mutate(data);
      }),
    [form, signInMutation],
  );

  if (signInMutation.isSuccess) {
    return (
      <Alert color="green" title="Email Sent">
        An email has been sent to {form.values.email}. Please check your inbox,
        and click the link in the email to sign in.
      </Alert>
    );
  }

  return (
    <div className="mx-auto flex w-full max-w-xs flex-col items-center">
      <form onSubmit={onSubmit} className="mb-4 flex w-full flex-col">
        <TextInput
          {...form.getInputProps("email")}
          label="Email"
          placeholder="eg; jane-doe@email.com"
          className="mb-8"
        />
        <Button type="submit" loading={signInMutation.isLoading}>
          Submit
        </Button>
      </form>

      <div className="flex flex-col items-center">
        <Text size="xs">Don{"'"}t have an account yet?</Text>
        <Button
          variant="subtle"
          size="xs"
          component={Link}
          href="/auth/sign-up"
        >
          Sign Up
        </Button>
      </div>
    </div>
  );
};
