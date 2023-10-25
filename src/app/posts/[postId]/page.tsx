import type { NextServerPage } from "$react-types";
import { Text, Title } from "@mantine/core";
import { z } from "zod";
import { api } from "~/trpc/server";

const pageParamsSchema = z.object({
  postId: z.string(),
});

const PostPage: NextServerPage = async ({ params }) => {
  const { postId } = pageParamsSchema.parse(params);
  const post = await api.post.getById.query(postId);
  return (
    <>
      <Title order={1} className="mb-4">
        {post.title}
      </Title>
      <div className="w-full rounded-md bg-gray-200 p-man_md dark:bg-gray-800">
        <Text>{post.content}</Text>
      </div>
    </>
  );
};

export default PostPage;
