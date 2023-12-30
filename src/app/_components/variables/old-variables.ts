// import { parse } from "mathjs";
//
// // TODO: for the most part, when a Value/Expression is just a single value, it doesn't need a variables field
// // need to account for hierarchy of expressions
// export type Expression = {
//   name: string;
//   expr: string;
//   dependencies?: Record<string, Expression>;
// };
// export const resolveExpression = (expression: Expression): number => {
//   const { evaluate } = compileEvalFn(expression.expr);
//   if (expression.dependencies) {
//     const subExpressions: Record<string, number> = {};
//     for (const name in expression.dependencies) {
//       subExpressions[name] = resolveExpression(expression.dependencies[name]);
//     }
//
//     return evaluate(subExpressions);
//   }
//
//   return Number(expression.expr);
// };
//
// type EvalFn = (v: Record<string, number>) => number;
// const compileEvalFn = (expr: string): { evaluate: EvalFn } => {
//   return parse(expr).compile();
// };
//
// type VariableOptions = {
//   showPositiveNegative?: boolean;
// };
// export const handleVariableText = (
//   text: string,
//   variables: Record<string, number>,
//   options: VariableOptions = {
//     showPositiveNegative: true,
//   },
// ): string => {
//   // variables should either arrive at this function as fleshed out expressions, or there should be some kind of fetch done to calculate or retrieve cached expressions
//   // will likely need some decent mechanism to memoise the variable list and correctly detect changes in value (marking a cached value as dirty, etc)
//   // going to assume variables are already calculated beforehand for this demo
//   let resultString = text;
//   for (const name in variables) {
//     resultString = resultString.replaceAll(
//       `{${name}}`,
//       applyVariableOptions(variables[name], options),
//     );
//   }
//   return resultString;
// };
// const applyVariableOptions = (
//   variable: number,
//   options: VariableOptions,
// ): string => {
//   if (options.showPositiveNegative) {
//     return prependNumberWithPositiveSign(variable);
//   }
//
//   return variable.toString();
// };
// const prependNumberWithPositiveSign = (x: number): string => {
//   return x > 0 ? `+${x.toString()}` : x.toString();
// };
