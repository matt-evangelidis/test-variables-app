import { cx } from "$cx";
import { type NextServerComponent } from "$react-types";
import {
  Avatar,
  type MantineSize,
  Paper,
  type PaperProps,
  Text,
} from "@mantine/core";
import { api } from "~/trpc/server";

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
  const data = await api.user.getUserAuthorDisplayInfo.query(userId);
  return (
    <Paper
      className={cx("flex items-center gap-2", className)}
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
      <Text size={size}>{data.username}</Text>
    </Paper>
  );
};
