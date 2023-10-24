"use client";

import {
  createTheme,
  type CSSVariablesResolver,
  DEFAULT_THEME,
} from "@mantine/core";
import {
  composeSchemeDependentColorVariableResolutions,
  composeConsistentColorVariableResolutions,
  createColorPrimitiveVariables,
} from "$theme-helpers";

export const mantineThemeOverride = createTheme({
  colors: {
    primary: DEFAULT_THEME.colors.blue,
    secondary: DEFAULT_THEME.colors.yellow,
  },
  primaryColor: "primary",
});

/**
 * We need to setup a custom css variables resolver so we can export
 * extra CSS variables that contain the underlying RGB numeric values
 * for each color. This is required for tailwind to be able to use its
 * color transparency feature.
 */

export const mantineCssVariablesResolver: CSSVariablesResolver = (theme) => ({
  variables: {
    ...createColorPrimitiveVariables(theme),
    ...composeConsistentColorVariableResolutions({
      black: theme.black,
      white: theme.white,
    }),
  },
  dark: composeSchemeDependentColorVariableResolutions({
    error: theme.colors.red[9],
    body: theme.colors.dark[7],
    textColor: theme.colors.dark[0],
  }),
  light: composeSchemeDependentColorVariableResolutions({
    error: theme.colors.red[6],
    body: theme.white,
    textColor: theme.black,
  }),
});
