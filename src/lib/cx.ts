import { MANTINE_SIZES } from "$theme-helpers";
import { extendTailwindMerge } from "tailwind-merge";
import classnames, { type ArgumentArray } from "classnames";

const prefixedMantineSizeScales = MANTINE_SIZES.map((size) => `man_${size}`);

const twMerge = extendTailwindMerge({
  theme: {
    spacing: prefixedMantineSizeScales,
    maxWidth: prefixedMantineSizeScales,
  },
});

export const cx = (...args: ArgumentArray) => twMerge(classnames(...args));
