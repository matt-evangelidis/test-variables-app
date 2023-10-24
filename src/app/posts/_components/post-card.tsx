import { cx } from "$cx";
import { type WithClassName } from "$react-types";
import { Text, Title } from "@mantine/core";
import type { Post } from "@prisma/client";
import { type FC } from "react";
import { TimeStamp } from "~/components/time-stamp";

export const PostCard: FC<WithClassName & { post: Post }> = ({
  className,
  post,
}) => {
  return (
    <div
      className={cx(
        "rounded-md bg-gray-200 p-man_lg dark:bg-gray-800",
        className,
      )}
    >
      <div className="flex w-full justify-between">
        <Title order={4}>{post.title}</Title>
        <TimeStamp size="sm" considerDistanceFromNow date={post.createdAt} />
      </div>
      <Text>{post.content}</Text>
    </div>
  );
};
