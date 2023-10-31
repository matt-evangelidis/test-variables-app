"use client";

import { Button, Modal, TextInput, Textarea, Title } from "@mantine/core";
import { useForm, zodResolver } from "@mantine/form";
import { type z } from "zod";
import { createPostInputSchema } from "~/schemas";
import { api } from "~/trpc/react";
import { type FC } from "react";
import type { Post } from "@prisma/client";
import { useCacheBustedNavigation } from "$next-helpers";
import {
  uiIsOpenAtom,
  useDisappearingHashAtom,
} from "$jotai-hash-disappear-atom";
import { Text } from "@mantine/core";

const formResolver = zodResolver(createPostInputSchema);

const useCreateOrEditPostForm = (existingPost: Post | null) =>
  useForm<z.infer<typeof createPostInputSchema>>({
    validate: formResolver,
    initialValues: {
      title: existingPost?.title ?? "",
      content: existingPost?.content ?? "",
    },
  });

type PostFormStatus =
  | {
      mode: "create";
    }
  | {
      mode: "edit";
      data: {
        post: Post;
      };
    };

type PostFormProps = {
  status: PostFormStatus;
};

const deleteModalIsOpenAtom = uiIsOpenAtom("delete-post-modal");

const viewPostPageUrlPattern = /^\/posts\/.*$/;

export const PostForm: FC<PostFormProps> = ({ status }) => {
  const [deleteModalIsOpen, setDeleteModalIsOpen] = useDisappearingHashAtom(
    deleteModalIsOpenAtom,
  );
  const nav = useCacheBustedNavigation();
  const form = useCreateOrEditPostForm(
    status.mode === "edit" ? status.data.post : null,
  );

  const gotoNewPost = (post: Post) => {
    nav.replace(`/posts/${post.id}`);
  };

  const editPost = api.post.edit.useMutation({
    onSuccess: gotoNewPost,
  });

  const createPost = api.post.create.useMutation({
    onSuccess: gotoNewPost,
  });

  const deletePost = api.post.deleteById.useMutation({
    onSuccess: () => {
      nav.replace("/posts");
    },
  });

  const mutate = (data: z.infer<typeof createPostInputSchema>) => {
    if (status.mode === "create") {
      createPost.mutate(data);
    } else {
      editPost.mutate({
        postId: status.data.post.id,
        data,
      });
    }
  };

  const navigationToViewPostPageIsLoading = viewPostPageUrlPattern.test(
    nav.loading?.url ?? "",
  );

  console.log({
    navigationToViewPostPageIsLoading,
    navLoading: nav.loading,
  });

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
        <div className="flex w-full gap-2">
          {status.mode === "edit" && (
            <Button
              color="red"
              variant="outline"
              onClick={() => setDeleteModalIsOpen(true)}
            >
              Delete
            </Button>
          )}
          <Button
            type="submit"
            className="flex-grow"
            loading={
              createPost.isLoading ||
              editPost.isLoading ||
              navigationToViewPostPageIsLoading
            }
          >
            {status.mode === "create" ? "Create" : "Save"}
          </Button>
        </div>
      </form>
      {status.mode === "edit" && (
        <Modal
          opened={deleteModalIsOpen}
          onClose={() => setDeleteModalIsOpen(false)}
          title="Delete Post?"
        >
          <Text>Are you sure?</Text>
          <div className="flex w-full justify-end">
            <Button
              color="red"
              loading={deletePost.isLoading || !!nav.loading}
              onClick={() => deletePost.mutate(status.data.post.id)}
            >
              Delete
            </Button>
          </div>
        </Modal>
      )}
    </>
  );
};
