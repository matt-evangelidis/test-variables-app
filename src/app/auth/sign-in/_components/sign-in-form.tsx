"use client";

import { Alert, Button, TextInput } from "@mantine/core";
import { useForm, zodResolver } from "@mantine/form";
import { useMutation } from "@tanstack/react-query";
import { type FC } from "react";
import { z } from "zod";
import { useSignInMutation } from "~/hooks/auth-mutation-hooks";
import { api } from "~/trpc/react";

const signInFormSchema = z.object({
  email: z.string().email(),
});

type SignInFormFields = z.infer<typeof signInFormSchema>;

const formResolver = zodResolver(signInFormSchema);

const useSignInForm = () =>
  useForm<SignInFormFields>({
    validate: formResolver,
    initialValues: {
      email: "",
    },
  });

export const SignInForm: FC = () => {
  const form = useSignInForm();

  const signInMutation = useSignInMutation();
  const getIdOfUserWithEmailMutation =
    api.user.getIdOfUserWithEmailIfItExists.useMutation();

  const fullAuthFlowMutation = useMutation({
    mutationFn: async ({ email }: SignInFormFields) => {
      const existingUserId = await getIdOfUserWithEmailMutation.mutateAsync(
        email,
      );
      console.log("(sign-in-form) existingUserId: ", existingUserId);

      await signInMutation.mutateAsync({
        provider: "email",
        options: {
          redirect: false,
          email,
          callbackUrl: existingUserId ? "/" : `/users/new`,
        },
      });
      return;
    },
  });

  const handleSubmit = form.onSubmit((data) => {
    fullAuthFlowMutation.mutate(data);
  });

  if (signInMutation.isSuccess)
    return (
      <Alert color="green" title="Email Sent">
        An email has been sent to {form.values.email}. Please check your inbox,
        and click the link in the email to sign in.
      </Alert>
    );

  return (
    <form
      onSubmit={handleSubmit}
      className="mx-auto flex w-full max-w-xs flex-col gap-2"
    >
      <TextInput
        {...form.getInputProps("email")}
        label="Email"
        placeholder="Enter Email"
      />
      <Button type="submit" loading={fullAuthFlowMutation.isLoading}>
        Sign In
      </Button>
    </form>
  );
};
