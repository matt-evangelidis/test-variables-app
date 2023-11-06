"use client";

import { Alert, Button, Text, TextInput } from "@mantine/core";
import { useForm, zodResolver } from "@mantine/form";
import { notifications } from "@mantine/notifications";
import Link from "next/link";
import { type FC } from "react";
import { type z } from "zod";
import { userSignUpFormSchema } from "~/schemas";
import { api } from "~/trpc/react";

const formResolver = zodResolver(userSignUpFormSchema);

const useSignInForm = () =>
  useForm<z.infer<typeof userSignUpFormSchema>>({
    validate: formResolver,
    initialValues: {
      email: "",
      username: "",
    },
  });

export const SignUpForm: FC = () => {
  const form = useSignInForm();

  const signUpMutation = api.auth.signUp.useMutation({
    onError: (error) => {
      switch (error.data?.code) {
        case "CONFLICT":
          form.setFieldError("email", "Email already in use");
          break;
        default:
          notifications.show({
            message: error.message,
            color: "red",
          });
      }
    },
  });
  const handleSubmit = form.onSubmit((data) => {
    signUpMutation.mutate(data);
  });

  if (signUpMutation.isSuccess)
    return (
      <Alert color="green" title="Email Sent">
        An email has been sent to {form.values.email}. Please check your inbox,
        and click the link in the email to sign in.
      </Alert>
    );

  return (
    <div className="mx-auto flex w-full max-w-xs flex-col items-center">
      <form onSubmit={handleSubmit} className="mb-4 flex w-full flex-col">
        <div className="mb-8 flex flex-col gap-2">
          <TextInput
            {...form.getInputProps("email")}
            label="Email"
            placeholder="Enter Email"
          />
          <TextInput
            {...form.getInputProps("username")}
            label="Username"
            placeholder="Enter Username"
          />
        </div>
        <Button type="submit" loading={signUpMutation.isLoading}>
          Submit
        </Button>
      </form>
      <div className="flex flex-col items-center">
        <Text size="xs">Already have an account?</Text>
        <Button
          variant="subtle"
          size="xs"
          component={Link}
          href="/auth/sign-in"
        >
          Sign In
        </Button>
      </div>
    </div>
  );
};
