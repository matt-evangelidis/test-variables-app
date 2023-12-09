import { parse } from "mathjs";
import { type Variable } from "@prisma/client";

type EvalFn = (v: Record<string, number>) => number;
const compileEvalFn = (expr: string): { evaluate: EvalFn } => {
  return parse(expr).compile();
};

const shouldBeResolved = (variable: Variable): boolean =>
  (variable.formula !== undefined || variable.formula !== "") &&
  variable.dependencies.length > 0;

const sanitizeFormula = (formula: string | undefined | null) =>
  formula?.replaceAll(/[{}]/g, "") ?? "";

const resolveFormula = (
  variable: Variable | undefined,
  variablesMap: Record<string, Variable>,
): number => {
  if (!variable) {
    return 0;
  }

  if (shouldBeResolved(variable)) {
    const { evaluate } = compileEvalFn(sanitizeFormula(variable.formula));
    const subFormulas: Record<string, number> = {};
    for (const id of variable.dependencies) {
      const lookup = variablesMap[id]!;
      subFormulas[lookup.name] = resolveFormula(variablesMap[id], variablesMap);
      console.log({ subFormulas });
    }
    return evaluate(subFormulas);
  }

  return Number(variable.value);
};

export const resolveVariableFormulas = (variables: Variable[]): Variable[] => {
  // doing this in two loops is probably pretty inefficient, but it does avoid the cost of setting up many, many smaller iterations
  // by mapping out all the variables in a structure for convenient lookup and resolution
  const variablesMap: Record<string, Variable> = {};
  for (const variable of variables) {
    variablesMap[variable.id] = variable;
  }
  console.log(variablesMap);

  for (const variable of variables) {
    // TODO: clean all the if checks up to make it easier to determine on the frontend if a variable should be displaying a formula or a value
    // maybe introduce a frontend version of Variable with a 'displayValue' field
    variable.formula = resolveFormula(
      variablesMap[variable.id],
      variablesMap,
    ).toString();
  }
  return variables;
};
