import type { NextServerPage } from "$react-types";
import { Button } from "@mantine/core";
import { Text, Title } from "@mantine/core";
import Link from "next/link";
import { individualPostPageParamsSchema } from "~/app/posts/pageParamsSchema";
import { getServerAuthSession } from "~/server/auth";
import { api } from "~/trpc/server";

const PostPage: NextServerPage = async ({ params }) => {
  const { postId } = individualPostPageParamsSchema.parse(params);
  const post = await api.post.getById.query(postId);
  const authSession = await getServerAuthSession();

  const userDisplayName = await api.user.getUsernameWithId.query(
    post.posterUserId,
  );

  return (
    <>
      <div className="mb-4 flex flex-col">
        <Title order={1}>{post.title}</Title>
        <div className="flex w-full items-center justify-between">
          <Text size="sm">{userDisplayName}</Text>
          {authSession?.user?.id === post.posterUserId && (
            <Button
              component={Link}
              href={`/posts/${postId}/edit`}
              variant="subtle"
              size="xs"
              className="ml-auto"
            >
              Edit
            </Button>
          )}
        </div>
      </div>
      <div className="w-full rounded-md bg-gray-200 p-man_md dark:bg-gray-800">
        <Text component="pre">{post.content}</Text>
      </div>
    </>
  );
};

export default PostPage;

export const revalidate = 0;

export const dynamic = "force-dynamic";
