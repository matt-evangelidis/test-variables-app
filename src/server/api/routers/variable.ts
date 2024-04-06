import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import { z } from "zod";
import {
  createVariableInputSchema,
  displayVariableArraySchema,
  editVariableInputSchema,
} from "~/schemas";
import { variableSchema } from "$prisma-schemas/variable";
import { resolveVariableFormulas } from "~/services/variable";
import { type Variable } from "@prisma/client";
// Modelling the DB model for variables
// a variable either contains a standalone value (e.g. my character's strength score is 18)
// or it contains a value that is resolved through a formula/expression
// (e.g. my character's strength modifier is +4, which comes from resolving (strengthScore - 10) / 2, floored)
// So it makes sense to model variables either as one table with one of two optional columns always filled
// or as two tables: StaticVariable and DynamicVariable
// modelling as one table with one of two populated columns probably makes more sense
// we then use a static column to differentiate

// another potential column
// going between originalValue and currentValue
// a likely feature is using a character sheet to track some updating value, such as hit points, number of uses remaining of a feature, etc
// to support that value can become originalValue and currentValue
// maximums? Maybe
// this seems best supported as an additional table, not sure the best way of going about adding for trpc/prisma

export const variableRouter = createTRPCRouter({
  getAll: publicProcedure
    .output(displayVariableArraySchema)
    .query(async ({ ctx }) => {
      const variables = await ctx.db.variable.findMany({
        include: { config: true },
        orderBy: { name: "asc" },
      });
      // console.log(variables);
      return resolveVariableFormulas(variables);
    }),
  getStatic: publicProcedure.query(async ({ ctx }) => {
    const staticVariables = await ctx.db.variable.findMany({
      where: { static: true },
    });
    return staticVariables;
  }),
  getById: publicProcedure
    .input(z.string())
    .query(async ({ input: id, ctx }) => {
      const variable = await ctx.db.variable.findUniqueOrThrow({
        where: { id },
        include: { config: true },
      });
      return variable;
    }),
  create: publicProcedure
    .input(createVariableInputSchema)
    .output(variableSchema)
    .mutation(async ({ ctx, input }) => {
      return ctx.db.variable.create({ data: { ...input } });
    }),
  delete: publicProcedure.input(z.string()).mutation(async ({ ctx, input }) => {
    return ctx.db.variable.delete({ where: { id: input } });
  }),
  update: publicProcedure
    .input(editVariableInputSchema)
    .mutation(async ({ ctx, input }) => {
      const existingVariable = await ctx.db.variable.findFirstOrThrow({
        where: { id: input.id },
      });
      console.log({ existingVariable }, { input });

      const updatePayload = isVariableUpdating(existingVariable, input);

      if (!updatePayload) {
        return;
      }

      // cases:
      // 1. a variable with no dependencies has its value updated: no need to update other variables
      // 2. a variable with no dependencies has its name updated: need to query other variables that contain its id, and update their expression to the new name
      // 3. a variable has its formula updated: need to resolve if its dependencies (existing or not) have changed and update accordingly

      if (existingVariable.dependencies.length < 1) {
        return await ctx.db.variable.update({
          where: {
            id: input.id,
          },
          data: {
            name: input.name,
            static: input.static,
            expression: input.expression,
          },
        });
      }

      const hasUpdatedName = existingVariable.name !== input.name;
      if (hasUpdatedName) {
        const dependentVariables = await ctx.db.variable.findMany({
          where: { dependencies: { has: input.id } },
        });
        if (dependentVariables.length > 0) {
          console.log("update dependent variables");
          for (const dependency of dependentVariables) {
            // assuming we want to support other wrapping sets, instances of using `{}` in formulas should be centralised to some other configurable function
            const newExpression = dependency.expression.replaceAll(
              `{${existingVariable.name}}`,
              `{${input.name}}`,
            );
            console.log({ newExpression });
            await ctx.db.variable.update({
              where: { id: dependency.id },
              data: { expression: newExpression },
            });
          }
        }
      }

      console.log(input.dependencies);
      return await ctx.db.variable.update({
        where: { id: input.id },
        data: {
          name: input.name,
          static: input.static,
          expression: input.expression,
          dependencies: input.dependencies,
        },
      });
    }),
});

const isVariableUpdating = (
  existingVariable: Variable,
  updatedVariable: z.infer<typeof editVariableInputSchema>,
) => {
  const updatingName = existingVariable.name !== updatedVariable.name;
  const updatingExpression =
    existingVariable.expression !== updatedVariable.expression;
  const updatingStatic = existingVariable.static !== updatedVariable.static;

  return updatingName || updatingExpression || updatingStatic;
};
