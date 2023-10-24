import {
  type MantineTheme,
  type MantineColor,
  getPrimaryShade,
  type MantineColorShade,
} from "@mantine/core";
import { keys, arrayOfAll } from "./utils"; // Must be relative path to be imported by tailwind config
import type { StrictExclude, StrictExtract } from "$utility-types";

export const MANTINE_COLOR_NAMES = arrayOfAll<MantineColor>()([
  "blue",
  "cyan",
  "gray",
  "green",
  "indigo",
  "orange",
  "pink",
  "dark",
  "red",
  "teal",
  "yellow",
  "grape",
  "lime",
  "violet",
  "primary",
  "secondary",
]);

const expandPotentiallyShortHexColor = (hexColor: string) => {
  const hexWithoutHash = hexColor.replace("#", "");

  const hexR = hexWithoutHash[0];
  const hexG = hexWithoutHash[1];
  const hexB = hexWithoutHash[2];
  if (hexWithoutHash.length === 3) {
    return `#${hexR}${hexR}${hexG}${hexG}${hexB}${hexB}`;
  }

  return hexColor;
};

export const printHexColorRGBValues = (hexColor: string) => {
  const fullLengthHexColor = expandPotentiallyShortHexColor(hexColor);
  const hex = fullLengthHexColor.replace("#", "");
  const r = parseInt(hex.substring(0, 2), 16);
  const g = parseInt(hex.substring(2, 4), 16);
  const b = parseInt(hex.substring(4, 6), 16);
  const a = parseInt(hex.substring(6, 8), 16) / 255;

  let result = `${r} ${g} ${b}`;

  if (!Number.isNaN(a) && a !== 1) {
    result += ` / ${a}`;
  }

  return result;
};

export const composeColorPrimitiveVariableName = (
  colorName: string,
  shade?: number | string,
) => `--tw-color-${colorName}` + (shade ? `-${shade}` : "");

export const TAILWIND_COLOR_SHADES = [
  50, 100, 200, 300, 400, 500, 600, 700, 800, 900,
];

export const composeColorPrimitiveVariablesForColorName = (
  colorName: MantineColor,
  theme: MantineTheme,
) => {
  const cssVariables: Record<string, string> = {};

  TAILWIND_COLOR_SHADES.forEach((shade, index) => {
    const color = theme.colors[colorName][index];
    const variableName = composeColorPrimitiveVariableName(colorName, shade);

    if (!color)
      throw new Error(
        `Color ${colorName} does not have shade ${shade} (index: ${index})`,
      );

    cssVariables[variableName] = printHexColorRGBValues(color);
  });

  return cssVariables;
};

export const composeSpecialVariantColorPrimitiveVariables = (
  colorName: MantineColor,
  colorMode: "light" | "dark",
  theme: MantineTheme,
) => {
  const primaryShade = getPrimaryShade(theme, colorMode);
  const hoverShade: MantineColorShade =
    primaryShade === 9 ? 8 : ((primaryShade + 1) as MantineColorShade);

  const cssVariables = {
    [composeColorPrimitiveVariableName(colorName, "filled")]:
      printHexColorRGBValues(theme.colors[colorName][primaryShade]),
    [composeColorPrimitiveVariableName(colorName, "filled-hover")]:
      printHexColorRGBValues(theme.colors[colorName][hoverShade]),
  };

  return cssVariables;
};

export const createColorPrimitiveVariables = (theme: MantineTheme) => {
  let result: Record<string, string> = {};

  MANTINE_COLOR_NAMES.forEach((colorName) => {
    const colorVariables = composeColorPrimitiveVariablesForColorName(
      colorName,
      theme,
    );
    result = {
      ...result,
      ...colorVariables,
    };
  });

  return result;
};

export const composeSingleTailwindRgbColor = (
  colorName: string,
  shade?: number,
) =>
  `rgb(var(${composeColorPrimitiveVariableName(
    colorName,
    shade,
  )}) / <alpha-value>)`;

export const MANTINE_SPECIAL_COLORS = [
  "error",
  "white",
  "black",
  "textColor",
  "body",
] as const;

type SpecialMantineColor = (typeof MANTINE_SPECIAL_COLORS)[number];

type ColorSchemeDependentSpecialMantineColor = StrictExtract<
  SpecialMantineColor,
  "error" | "body" | "textColor"
>;

type ConsistentSpecialMantineColor = StrictExclude<
  SpecialMantineColor,
  ColorSchemeDependentSpecialMantineColor
>;

const generateColorVariableCompositionHelper =
  <Color extends SpecialMantineColor>() =>
  (colors: Record<Color, string>) => {
    const result: Record<string, string> = {};

    keys(colors).forEach((colorName) => {
      const cssVarName = composeColorPrimitiveVariableName(colorName);
      const hexColor = colors[colorName];
      result[cssVarName] = printHexColorRGBValues(hexColor);
    });

    return result;
  };

export const composeSchemeDependentColorVariableResolutions =
  generateColorVariableCompositionHelper<ColorSchemeDependentSpecialMantineColor>();

export const composeConsistentColorVariableResolutions =
  generateColorVariableCompositionHelper<ConsistentSpecialMantineColor>();
