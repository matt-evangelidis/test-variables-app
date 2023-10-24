import { Text, type TextProps } from "@mantine/core";
import * as T from "date-fns";
import { type FC } from "react";

type SmartFormattingProps = {
  considerDistanceFromNow: boolean;
};

export type TimeStampProps = Omit<TextProps, "children"> & {
  date: Date;
  format?: string;
  considerDistanceFromNow?: boolean;
} & Partial<SmartFormattingProps>;

const applySmartFormatting = (
  date: Date,
  { considerDistanceFromNow }: SmartFormattingProps,
): string => {
  const isToday = T.isToday(date);

  if (considerDistanceFromNow && isToday) {
    const minutesFromNow = T.differenceInMinutes(new Date(), date);
    if (minutesFromNow <= 2) return "just now";
    if (minutesFromNow <= 50) return `${minutesFromNow} minutes ago`;
    if (minutesFromNow <= 70) return "an hour ago";
    if (minutesFromNow <= 60 * 12)
      return `${T.differenceInHours(new Date(), date)} hours ago`;
  }

  return T.format(date, "MMMM d");
};

export const TimeStamp: FC<TimeStampProps> = ({
  date,
  format,
  considerDistanceFromNow = false,
  ...props
}: TimeStampProps) => {
  const formatted = format
    ? T.format(date, format)
    : applySmartFormatting(date, {
        considerDistanceFromNow,
      });
  return (
    <Text component="time" {...props}>
      {formatted}
    </Text>
  );
};
