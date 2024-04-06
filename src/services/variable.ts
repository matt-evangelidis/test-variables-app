import { parse } from "mathjs";
import { type Variable } from "@prisma/client";

type EvalFn = (v: Record<string, number>) => number;
const compileEvalFn = (expr: string): { evaluate: EvalFn } => {
  return parse(expr).compile();
};

const shouldBeResolved = (variable: Variable): boolean =>
  variable.expression !== "" && variable.dependencies.length > 0;

const sanitizeExpression = (expression: string) =>
  expression.replaceAll(/[{}]/g, "");

const resolveExpression = (
  variable: Variable | undefined,
  variablesMap: Record<string, Variable>,
): number => {
  if (!variable) {
    return 0;
  }

  if (shouldBeResolved(variable)) {
    const { evaluate } = compileEvalFn(sanitizeExpression(variable.expression));
    const subExpressions: Record<string, number> = {};
    for (const id of variable.dependencies) {
      const lookup = variablesMap[id]!;
      subExpressions[lookup.name] = resolveExpression(
        variablesMap[id],
        variablesMap,
      );
    }
    return evaluate(subExpressions);
  }

  return Number(variable.expression);
};

export type ResolvedVariable = ReturnType<
  typeof resolveVariableFormulas
>[number];
export const resolveVariableFormulas = (
  variables: Variable[],
): Array<Variable & { display: string }> => {
  // doing this in two loops is probably pretty inefficient, but it does avoid the cost of setting up many, many smaller iterations
  // by mapping out all the variables in a structure for convenient lookup and resolution
  const variablesMap: Record<string, Variable> = {};
  for (const variable of variables) {
    variablesMap[variable.id] = variable;
  }

  // TODO: how do we handle a missing dependency?
  // probably need to display some error message and then point or link the user to change the variable with the missing dependency
  // E.g. if I delete a strengthScore, my strengthModifier suddenly breaks because it has no variable to apply against
  // this will likely expand the FE-version of a Variable (or perhaps a VariablePayload type) to include errors and ways to link the user to
  // a location to fix the issue
  return variables.map((variable) => ({
    ...variable,
    display: resolveExpression(variable, variablesMap).toString(),
  }));
};
