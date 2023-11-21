import { cx } from "$cx";
import { type NextServerComponent } from "$react-types";
import {
  Avatar,
  type MantineSize,
  Paper,
  type PaperProps,
  Text,
} from "@mantine/core";
import Link from "next/link";
import { createServerApi } from "~/trpc/server";

const sizePadding: Record<MantineSize, string | number> = {
  xs: 6,
  sm: 8,
  md: "xs",
  lg: "sm",
  xl: "md",
};

export type UserBadgeProps = PaperProps & {
  size?: MantineSize;
  userId: string;
};

export const UserBadge: NextServerComponent<UserBadgeProps> = async ({
  size = "md",
  userId,
  className,
  ...props
}) => {
  const api = await createServerApi();
  const data = await api.user.getUserAuthorDisplayInfo(userId);
  return (
    <Paper
      className={cx(
        "link-overlay-container group flex items-center gap-2",
        className,
      )}
      radius="md"
      p={sizePadding[size]}
      {...props}
    >
      <Avatar
        radius="sm"
        size={size}
        src={data.pictureUrl}
        alt={`${data.username} picture`}
      />
      <Text
        component={Link}
        href={`/users/${userId}`}
        className="link-overlay-anchor group-hover:underline"
        size={size}
      >
        {data.username}
      </Text>
    </Paper>
  );
};
