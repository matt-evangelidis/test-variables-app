"use client";

import { Button, TextInput } from "@mantine/core";
import { useForm, zodResolver } from "@mantine/form";
import { notifications } from "@mantine/notifications";
import { type User } from "@prisma/client";
import { signIn } from "next-auth/react";
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
      <div className="flex justify-center">
        <Button className="w-32" type="submit" loading={updateUser.isLoading}>
          Save
        </Button>
      </div>
    </form>
  );
};
