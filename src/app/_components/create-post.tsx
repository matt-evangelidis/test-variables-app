"use client";

import { useRouter } from "next/navigation";
import { useForm, zodResolver } from "@mantine/form";

import { api } from "~/trpc/react";
import { createPostInputSchema } from "~/schemas";
import type { z } from "zod";
import { Button, TextInput } from "@mantine/core";

const useCreatePostForm = () =>
  useForm<z.infer<typeof createPostInputSchema>>({
    validate: zodResolver(createPostInputSchema),
    initialValues: {
      title: "",
    },
  });

export function CreatePost() {
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
      className="flex flex-col gap-2"
    >
      <TextInput label="Title" {...form.getInputProps("title")} />
      <Button type="submit" loading={createPost.isLoading}>
        Submit
      </Button>
    </form>
  );
}
