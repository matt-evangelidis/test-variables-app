import type { Variable } from "@prisma/client";

export const resolveDependencies = (
  formula: string,
  variables: Variable[],
): string[] => {
  if (formula === "") {
    return [];
  }
  return variables
    .filter((variable) => formula.includes(`{${variable.name}}`))
    .map((variable) => variable.id);
};
