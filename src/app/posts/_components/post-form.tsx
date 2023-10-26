"use client";

import { Button, TextInput, Textarea, Title } from "@mantine/core";
import { useForm, zodResolver } from "@mantine/form";
import { type z } from "zod";
import { createPostInputSchema } from "~/schemas";
import { api } from "~/trpc/react";
import { type FC } from "react";
import { useRouter } from "next/navigation";
import type { Post } from "@prisma/client";

const formResolver = zodResolver(createPostInputSchema);

const useNewPostForm = () =>
  useForm<z.infer<typeof createPostInputSchema>>({
    validate: formResolver,
    initialValues: {
      title: "",
      content: "",
    },
  });

type PostFormStatus =
  | {
      mode: "create";
    }
  | {
      mode: "edit";
      data: {
        postId: string;
      };
    };

type PostFormProps = {
  status: PostFormStatus;
};

export const PostForm: FC<PostFormProps> = ({ status }) => {
  const router = useRouter();
  const form = useNewPostForm();

  const gotoNewPost = (post: Post) => {
    router.replace(`/posts/${post.id}`);
  };

  const editPost = api.post.edit.useMutation({
    onSuccess: gotoNewPost,
  });

  const createPost = api.post.create.useMutation({
    onSuccess: gotoNewPost,
  });

  const mutate = (data: z.infer<typeof createPostInputSchema>) => {
    if (status.mode === "create") {
      createPost.mutate(data);
    } else {
      editPost.mutate({
        postId: status.data.postId,
        data,
      });
    }
  };

  return (
    <>
      <Title order={1}>Create New Post</Title>
      <form onSubmit={form.onSubmit(mutate)} className="flex flex-col gap-4">
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
