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
      console.log({ subExpressions });
    }
    return evaluate(subExpressions);
  }

  return Number(variable.expression);
};

export const resolveVariableFormulas = (
  variables: Variable[],
): Array<Variable & { display: string }> => {
  // doing this in two loops is probably pretty inefficient, but it does avoid the cost of setting up many, many smaller iterations
  // by mapping out all the variables in a structure for convenient lookup and resolution
  const variablesMap: Record<string, Variable> = {};
  for (const variable of variables) {
    variablesMap[variable.id] = variable;
  }
  console.log(variablesMap);

  // for (const variable of variables) {
  //   addValueKey(variable, resolveExpression(variable, variablesMap).toString());
  // }
  return variables.map((variable) => ({
    ...variable,
    display: resolveExpression(variable, variablesMap).toString(),
  }));
};
