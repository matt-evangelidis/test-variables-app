"use client";

import { useCacheBustedNavigation } from "$next-helpers";
import { Button, TextInput } from "@mantine/core";
import { useForm, zodResolver } from "@mantine/form";
import { notifications } from "@mantine/notifications";
import { useMutation } from "@tanstack/react-query";
import { type FC } from "react";
import { type z } from "zod";
import { invalidateAuthSessionsForUserWithId } from "~/app/actions";
import { type InwardFacingUserDTO } from "~/dtos";
import { userUpdateFormSchema } from "~/schemas";
import { api } from "~/trpc/react";

const resolver = zodResolver(userUpdateFormSchema);

const useUserProfileForm = (user: InwardFacingUserDTO) =>
  useForm<z.infer<typeof userUpdateFormSchema>>({
    validate: resolver,
    initialValues: {
      username: user.username ?? "",
    },
  });

export const UserProfileForm: FC<{ user: InwardFacingUserDTO }> = ({
  user,
}) => {
  const navigation = useCacheBustedNavigation();
  const form = useUserProfileForm(user);

  const updateUser = api.user.update.useMutation({
    onSuccess: () => {
      notifications.show({
        title: "Success",
        message: "User updated successfully",
        color: "green",
      });
    },
  });

  const handleDelete = () => {
    const userHasConfirmed = window.confirm(
      "Are you sure you want to delete your profile? This cannot be undone.",
    );

    if (!userHasConfirmed) return;

    deleteUser.mutate(user.id);
  };

  const signOutMutation = useMutation({
    mutationFn: invalidateAuthSessionsForUserWithId,
    mutationKey: ["signOut"],
    onSuccess: () => {
      navigation.replace("/");
    },
  });

  const deleteUser = api.user.deleteById.useMutation({
    onSuccess: async () => {
      await signOutMutation.mutateAsync(user.id);
    },
  });

  return (
    <form
      className="flex w-full flex-col gap-4 [&>*]:w-full"
      onSubmit={form.onSubmit((data) =>
        updateUser.mutate({
          userId: user.id,
          data,
        }),
      )}
    >
      <TextInput {...form.getInputProps("username")} label="Username" />
      <div className="w-full">
        <Button
          type="submit"
          loading={updateUser.isLoading}
          className="mb-2 w-full"
        >
          Save
        </Button>
        <div className="flex w-full gap-2 [&>*]:w-full">
          <Button
            variant="outline"
            color="red"
            onClick={handleDelete}
            loading={deleteUser.isLoading}
          >
            Delete Account
          </Button>
          <Button
            onClick={() => signOutMutation.mutate(user.id)}
            loading={signOutMutation.isLoading}
            variant="outline"
            color="gray"
          >
            Sign Out
          </Button>
        </div>
      </div>
    </form>
  );
};
