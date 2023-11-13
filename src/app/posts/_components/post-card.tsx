import { cx } from "$cx";
import { type NextServerPage, type WithClassName } from "$react-types";
import { Divider, Text } from "@mantine/core";
import type { Post } from "@prisma/client";
import Link from "next/link";
import { TimeStamp } from "~/components/time-stamp";
import { api } from "~/trpc/server";

export const PostCard: NextServerPage<WithClassName & { post: Post }> = async ({
  className,
  post,
}) => {
  const author = await api.user.getUserAuthorDisplayInfo.query(
    post.authorUserId,
  );
  return (
    <div
      className={cx(
        "link-overlay-container rounded-md bg-gray-200 p-man_lg dark:bg-gray-800",
        className,
      )}
    >
      <div className="w-full">
        <Text
          className="link-overlay-anchor text-lg font-bold hover:underline"
          component={Link}
          href={`/posts/${post.id}`}
        >
          {post.title}
        </Text>
        <div className="items-bottom mt-1 flex w-full justify-between">
          <Text size="xs" className="opacity-60">
            {author.username}
          </Text>
          <TimeStamp
            size="xs"
            className="opacity-60"
            considerDistanceFromNow
            date={post.createdAt}
          />
        </div>
      </div>
      <Divider className="mb-4 mt-2 !border-t-textColor opacity-90" />
      <Text component="pre" className="text-textColor">
        {post.content}
      </Text>
    </div>
  );
};
