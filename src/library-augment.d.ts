import {
  type DefaultMantineColor,
  type MantineColorsTuple,
  type MantineTheme,
} from "@mantine/core";
import type { Merge, PartialDeep, SetRequired } from "type-fest";
import type { ExtractLiterals } from "$utility-types";

type CustomMantineColor = "primary" | "secondary";
type ExtendedMantineColor = ExtractLiterals<
  DefaultMantineColor | CustomMantineColor
>;

declare module "@mantine/core" {
  type NewColorsObject = Record<ExtendedMantineColor, MantineColorsTuple>;

  export interface MantineThemeColorsOverride {
    colors: Record<ExtendedMantineColor, MantineColorsTuple>;
  }

  export { CustomMantineColor };

  type ColorThemeOverrideInput = SetRequired<
    Partial<NewColorsObject>,
    CustomMantineColor
  >;

  type ThemeOverrideInput = Merge<
    PartialDeep<MantineTheme>,
    { colors: ColorThemeOverrideInput }
  >;

  /**
   * We override the `createTheme` function to make sure that any
   * values that do not exist on the default mantine theme are
   * required in the input.
   */
  const _createTheme: (themeOverride: ThemeOverrideInput) => ThemeOverrideInput;
  export { _createTheme as createTheme };
}
