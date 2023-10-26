"use client";

import { Button, TextInput, Textarea, Title } from "@mantine/core";
import { useForm, zodResolver } from "@mantine/form";
import { type z } from "zod";
import { createPostInputSchema } from "~/schemas";
import { api } from "~/trpc/react";
import { type FC } from "react";
import { useRouter } from "next/navigation";

const formResolver = zodResolver(createPostInputSchema);

const useNewPostForm = () =>
  useForm<z.infer<typeof createPostInputSchema>>({
    validate: formResolver,
    initialValues: {
      title: "",
      content: "",
    },
  });

const NewPostPage: FC = () => {
  const router = useRouter();
  const form = useNewPostForm();

  const createPost = api.post.create.useMutation({
    onSuccess: (data) => {
      router.replace(`/posts/${data.id}`);
    },
  });

  return (
    <>
      <Title order={1}>Create New Post</Title>
      <form
        onSubmit={form.onSubmit((data) => createPost.mutate(data))}
        className="flex flex-col gap-4"
      >
        <TextInput {...form.getInputProps("title")} label="Title" />
        <Textarea
          rows={16}
          {...form.getInputProps("content")}
          label="Content"
        />
        <Button type="submit" loading={createPost.isLoading}>
          Create Post
        </Button>
      </form>
    </>
  );
};

export default NewPostPage;
