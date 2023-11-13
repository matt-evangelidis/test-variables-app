"use client";

import { useCacheBustedNavigation } from "$next-helpers";
import { Button, TextInput } from "@mantine/core";
import { useForm, zodResolver } from "@mantine/form";
import { notifications } from "@mantine/notifications";
import { useMutation } from "@tanstack/react-query";
import { type FC, useMemo, useState, useCallback } from "react";
import { type z } from "zod";
import { invalidateAuthSessionsForUserWithId } from "~/app/actions";
import { UserPictureInput } from "~/app/users/[userId]/edit/_components/user-picture-input";
import { type InwardFacingUserDTO } from "~/dtos";
import { userUpdateFormSchema } from "~/schemas";
import { api } from "~/trpc/react";
import { api as directApi } from "~/trpc/client";
import { uploadFilesFromClient } from "~/uploadthing/utils";
import { compressUserPictureFile } from "~/utils/compress-user-picture-file";
import { waitUntilPictureWithKeyExistsInDb } from "~/utils/wait-until-picture-with-key-exists-in-db";

const useSubmitMutation = () =>
  useMutation({
    onSuccess: () => {
      notifications.show({
        title: "Success",
        message: "User updated successfully",
        color: "green",
      });
    },
    mutationKey: ["submitUserForm"],
    mutationFn: async ({
      userId,
      data,
      file,
    }: {
      userId: string;
      data: z.infer<typeof userUpdateFormSchema>;
      file: File | null;
    }) => {
      const compressedFile = !!file
        ? await compressUserPictureFile(file)
        : null;

      console.log("(user-profile-form): ", { compressedFile });

      const fileToUpload = compressedFile
        ? new File([compressedFile], `user-picture-${userId}.webp`, {
            type: "image/webp",
          })
        : null;

      const uploadResult = fileToUpload
        ? await uploadFilesFromClient({
            files: [fileToUpload],
            endpoint: "userPictureUploader",
          })
        : null;

      if (uploadResult?.[0])
        await waitUntilPictureWithKeyExistsInDb(uploadResult[0].key);

      await directApi.user.update.mutate({
        userId,
        data: {
          ...data,
          pictureKey: uploadResult?.[0]?.key,
        },
      });
    },
  });

const useSignOutMutation = () => {
  const navigation = useCacheBustedNavigation();

  return useMutation({
    mutationFn: invalidateAuthSessionsForUserWithId,
    mutationKey: ["signOut"],
    onSuccess: () => {
      navigation.replace("/");
    },
  });
};

const useImageUpload = (currentPictureUrl: string | undefined) => {
  const [userHasClearedPicture, setUserHasClearedPicture] = useState(
    !currentPictureUrl,
  );

  const [uploadedFile, setUploadedFile] = useState<File | null>(null);

  const pictureUrl = useMemo(() => {
    if (uploadedFile) return URL.createObjectURL(uploadedFile);
    if (!userHasClearedPicture) return currentPictureUrl;
    return undefined;
  }, [uploadedFile, currentPictureUrl, userHasClearedPicture]);

  const handleFileUpload = useCallback((file: File | null) => {
    if (!file) {
      setUserHasClearedPicture(true);
    }
    setUploadedFile(file);
  }, []);

  return { pictureUrl, handleFileUpload, uploadedFile };
};

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
  const form = useUserProfileForm(user);

  const { handleFileUpload, pictureUrl, uploadedFile } = useImageUpload(
    user.picture?.url,
  );

  const submitMutation = useSubmitMutation();

  const signOutMutation = useSignOutMutation();

  const deleteUserMutation = api.user.deleteById.useMutation({
    onSuccess: async () => {
      await signOutMutation.mutateAsync(user.id);
    },
  });

  const handleDelete = () => {
    const userHasConfirmed = window.confirm(
      "Are you sure you want to delete your profile? This cannot be undone.",
    );

    if (!userHasConfirmed) return;

    deleteUserMutation.mutate(user.id);
  };

  return (
    <form
      className="flex w-full flex-col gap-4 [&>*]:w-full"
      onSubmit={form.onSubmit((data) =>
        submitMutation.mutate({
          userId: user.id,
          data,
          file: uploadedFile,
        }),
      )}
    >
      <div className="flex justify-center">
        <UserPictureInput
          pictureUrl={pictureUrl}
          onFileUpload={handleFileUpload}
        />
      </div>
      <TextInput {...form.getInputProps("username")} label="Username" />
      <div className="w-full">
        <Button
          type="submit"
          loading={submitMutation.isLoading}
          className="mb-2 w-full"
        >
          Save
        </Button>
        <div className="flex w-full gap-2 [&>*]:w-full">
          <Button
            variant="outline"
            color="red"
            onClick={handleDelete}
            loading={deleteUserMutation.isLoading}
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
