import { type PromiseOrNot } from "$utility-types";
import { useMutation } from "@tanstack/react-query";
import { type BuiltInProviderType } from "next-auth/providers";

import { type SignInOptions, signIn } from "next-auth/react";

export type UseSignInMutationInput = {
  provider: BuiltInProviderType;
  options?: SignInOptions;
};

export const signInMutationKey = ["signIn"];
export const useSignInMutation = (
  options: {
    onSuccess?: () => PromiseOrNot<void>;
  } = {},
) =>
  useMutation({
    mutationFn: ({ provider, options }: UseSignInMutationInput) =>
      signIn(provider, options),
    mutationKey: signInMutationKey,
    ...options,
  });
