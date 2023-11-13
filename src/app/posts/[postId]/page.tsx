import type { NextServerPage } from "$react-types";
import { Button, Divider, Paper } from "@mantine/core";
import { Text, Title } from "@mantine/core";
import Link from "next/link";
import { UserBadge } from "~/app/_components/user-badge";
import { individualPostPageParamsSchema } from "~/app/posts/pageParamsSchema";
import { getServerAuthSession } from "~/auth/lucia";
import { TimeStamp } from "~/components/time-stamp";
import { api } from "~/trpc/server";

const PostPage: NextServerPage = async ({ params }) => {
  const { postId } = individualPostPageParamsSchema.parse(params);
  const post = await api.post.getById.query(postId);
  const authSession = await getServerAuthSession();

  const viewerIsAuthor = authSession?.user?.userId === post.authorUserId;
  return (
    <>
      <div className="flex flex-col">
        <Title order={1}>{post.title}</Title>
        <TimeStamp date={post.createdAt} considerDistanceFromNow />
        <div className="flex w-full items-center justify-between">
          <UserBadge userId={post.authorUserId} size="sm" />
          {viewerIsAuthor && (
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
      <Divider my="md" />
      <Paper radius="md" p="sm" w="100%">
        <Text component="pre">{post.content}</Text>
      </Paper>
    </>
  );
};

export default PostPage;

export const revalidate = 0;

export const dynamic = "force-dynamic";
