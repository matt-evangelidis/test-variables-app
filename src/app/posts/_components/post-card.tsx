import { cx } from "$cx";
import { type WithClassName } from "$react-types";
import { Text, Title } from "@mantine/core";
import type { Post } from "@prisma/client";
import { type FC } from "react";

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
      <Title order={4}>{post.title}</Title>
      <Text>{post.content}</Text>
    </div>
  );
};
