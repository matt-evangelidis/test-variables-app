import { type FC, type PropsWithChildren } from "react";
import { Tooltip } from "@mantine/core";

interface Props {
  label: string;
}

export const NullableTooltip: FC<PropsWithChildren<Props>> = ({
  label,
  children,
}) => {
  if (label === "") {
    return <>{children}</>;
  }

  return <Tooltip label={label}>{children}</Tooltip>;
};
