import { cx } from "$cx";
import { type WithClassName } from "$react-types";
import {
  ActionIcon,
  Avatar,
  FileButton,
  UnstyledButton,
  Text,
} from "@mantine/core";
import { IconX } from "@tabler/icons-react";
import { type FC } from "react";

export type UserPictureInputProps = WithClassName & {
  onFileUpload: (file: File | null) => void;
  pictureUrl: string | null | undefined;
  disabled?: boolean;
};

export const UserPictureInput: FC<UserPictureInputProps> = ({
  onFileUpload,
  className,
  pictureUrl,
  disabled = false,
}) => {
  return (
    <div className={cx("group relative h-[150px] w-[150px]", className)}>
      <Avatar
        radius={0}
        className="absolute left-0 top-0 h-full w-full"
        src={pictureUrl}
      />
      <FileButton onChange={onFileUpload} accept="image/*">
        {(props) => (
          <UnstyledButton
            className={cx(
              "flex h-full w-full items-center justify-center",
              !disabled &&
                "group-hover-focus-within:bg-dark-800/50 group-hover-focus-within:[backdrop-filter:blur(8px)]",
            )}
            {...props}
          >
            <Text
              size="sm"
              className={cx(
                "font-semibold text-white",
                "opacity-0 group-hover-focus-within:opacity-100",
                disabled && "hidden",
              )}
            >
              Upload Image
            </Text>
          </UnstyledButton>
        )}
      </FileButton>
      <ActionIcon
        color="red"
        radius="100%"
        size="sm"
        className={cx(
          "absolute bottom-[-10px] right-[-10px]",
          "h-[10px] w-[10px]",
          "opacity-0 group-focus-within:opacity-100 group-hover:opacity-100",
          disabled && "hidden",
        )}
        onClick={() => onFileUpload(null)}
      >
        <IconX />
      </ActionIcon>
    </div>
  );
};
