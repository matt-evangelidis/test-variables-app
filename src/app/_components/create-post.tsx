"use client";

import { useRouter } from "next/navigation";
import { useForm, zodResolver } from "@mantine/form";

import { api } from "~/trpc/react";
import { createPostInputSchema } from "~/schemas";
import type { z } from "zod";
import { Button, TextInput } from "@mantine/core";
import { type FC } from "react";
import { type WithClassName } from "$react-types";
import { cx } from "$cx";

const useCreatePostForm = () =>
  useForm<z.infer<typeof createPostInputSchema>>({
    validate: zodResolver(createPostInputSchema),
    initialValues: {
      title: "",
    },
  });

export const CreatePost: FC<WithClassName> = ({ className }) => {
  const router = useRouter();
  const form = useCreatePostForm();

  const createPost = api.post.create.useMutation({
    onSuccess: () => {
      router.refresh();
      form.reset();
    },
  });

  return (
    <form
      onSubmit={form.onSubmit((data) => createPost.mutate(data))}
      onReset={form.onReset}
      className={cx("flex flex-col", className)}
    >
      <h2 className="mb-2">Create New Post</h2>
      <TextInput
        classNames={{
          root: cx("mb-8"),
          input: cx("!bg-transparent"),
        }}
        label="Title"
        placeholder="Enter New Post Title"
        {...form.getInputProps("title")}
      />
      <Button type="submit" loading={createPost.isLoading}>
        Submit
      </Button>
    </form>
  );
};
