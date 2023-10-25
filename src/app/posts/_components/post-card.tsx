import { cx } from "$cx";
import { type WithClassName } from "$react-types";
import { Anchor, Text, Title } from "@mantine/core";
import type { Post } from "@prisma/client";
import Link from "next/link";
import { type FC } from "react";
import { TimeStamp } from "~/components/time-stamp";

export const PostCard: FC<WithClassName & { post: Post }> = ({
  className,
  post,
}) => {
  return (
    <div
      className={cx(
        "link-overlay-container rounded-md bg-gray-200 p-man_lg dark:bg-gray-800",
        className,
      )}
    >
      <div className="flex w-full justify-between">
        <Text
          className="link-overlay-anchor text-lg hover:underline"
          component={Link}
          href={`/posts/${post.id}`}
        >
          {post.title}
        </Text>
        <TimeStamp size="sm" considerDistanceFromNow date={post.createdAt} />
      </div>
      <Text>{post.content}</Text>
    </div>
  );
};
