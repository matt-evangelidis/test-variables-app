import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import { z } from "zod";
import {
  createVariableInputSchema,
  displayVariableArraySchema,
  displayVariableSchema,
} from "~/schemas";
import { variableSchema } from "$prisma-schemas/variable";
import { resolveVariableFormulas } from "~/services/variable";
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
      console.log(variables);
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
  // update: publicProcedure
  //   .input(/* TODO: add input schema here */)
  //   .mutation(async ({ ctx, input }) => {
  //     // how to handle renaming a variable?
  //     // make it a special operation, grab the variables that depend on it and edit those strings?
  //     // make the user aware expressions will need editing?
  //     return ctx.db.variable.update();
  //   }),
});
