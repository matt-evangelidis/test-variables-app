"use client";

import { Button, TextInput } from "@mantine/core";
import { useForm, zodResolver } from "@mantine/form";
import { notifications } from "@mantine/notifications";
import { type User } from "@prisma/client";
import { signOut } from "next-auth/react";
import { redirect } from "next/navigation";
import { type FC } from "react";
import { type z } from "zod";
import { userUpdateFormSchema } from "~/schemas";
import { api } from "~/trpc/react";

const resolver = zodResolver(userUpdateFormSchema);

const useUserProfileForm = (user: User) =>
  useForm<z.infer<typeof userUpdateFormSchema>>({
    validate: resolver,
    initialValues: {
      image: user.image,
      name: user.name ?? "",
    },
  });

export const UserProfileForm: FC<{ user: User }> = ({ user }) => {
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

  const deleteUser = api.user.deleteById.useMutation({
    onSuccess: () => {
      redirect("/");
    },
  });

  const handleDelete = () => {
    const userHasConfirmed = window.confirm(
      "Are you sure you want to delete your profile? This cannot be undone.",
    );

    if (!userHasConfirmed) return;

    deleteUser.mutate(user.id);
  };

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
      <TextInput {...form.getInputProps("name")} label="Username" />
      <div className="flex gap-2">
        <Button
          variant="outline"
          color="red"
          onClick={handleDelete}
          loading={deleteUser.isLoading}
        >
          Delete
        </Button>
        <Button onClick={() => signOut({})} variant="outline" color="gray">
          Sign Out
        </Button>
        <Button type="submit" loading={updateUser.isLoading} className="w-full">
          Save
        </Button>
      </div>
    </form>
  );
};
