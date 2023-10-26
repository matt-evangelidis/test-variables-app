import type { NextServerPage } from "$react-types";
import { Button } from "@mantine/core";
import { Text, Title } from "@mantine/core";
import Link from "next/link";
import { individualPostPageParamsSchema } from "~/app/posts/pageParamsSchema";
import { api } from "~/trpc/server";

const PostPage: NextServerPage = async ({ params }) => {
  const { postId } = individualPostPageParamsSchema.parse(params);
  const post = await api.post.getById.query(postId);
  return (
    <>
      <div className="flex justify-between">
        <Title order={1} className="mb-4">
          {post.title}
        </Title>
        <Button
          component={Link}
          href={`/posts/${postId}/edit`}
          variant="subtle"
          size="sm"
        >
          Edit
        </Button>
      </div>
      <div className="w-full rounded-md bg-gray-200 p-man_md dark:bg-gray-800">
        <Text>{post.content}</Text>
      </div>
    </>
  );
};

export default PostPage;

export const dynamic = "force-dynamic";
