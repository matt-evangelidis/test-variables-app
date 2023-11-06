import { TRPCError } from "@trpc/server";
import { env } from "~/env.mjs";
import { userSignInFormSchema, userSignUpFormSchema } from "~/schemas";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import { sendConfirmationEmail, sendSignInEmail } from "~/auth/email";
import { getEmailVerificationTokenForUserWithId } from "~/auth/token";

export const authRouter = createTRPCRouter({
  signUp: publicProcedure
    .input(userSignUpFormSchema)
    .mutation(async ({ ctx, input }) => {
      const existingUser = await ctx.db.user.findUnique({
        where: {
          email: input.email,
        },
      });

      if (existingUser) {
        throw new TRPCError({
          code: "CONFLICT",
          message: "User already exists",
        });
      }

      return ctx.db.$transaction(async (transactionalDb) => {
        const newUser = await transactionalDb.user.create({
          data: input,
        });

        const newToken = await getEmailVerificationTokenForUserWithId(
          newUser.id,
          transactionalDb,
        );
        const verificationLink = `${env.URL}/auth/verify?token=${newToken}`;

        await sendConfirmationEmail({
          to: newUser.email,
          verificationLink,
          username: newUser.username,
        });

        return "ok";
      });
    }),

  signIn: publicProcedure
    .input(userSignInFormSchema)
    .mutation(async ({ ctx, input }) => {
      const user = await ctx.db.user.findUnique({
        where: {
          email: input.email,
        },
        select: {
          email: true,
          id: true,
          username: true,
          email_verified: true,
        },
      });

      if (!user || !user.email_verified) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "User not found",
        });
      }

      const newToken = await getEmailVerificationTokenForUserWithId(user.id);
      const signInLink = `${env.URL}/auth/verify?token=${newToken}`;

      await sendSignInEmail({
        to: user.email,
        signInLink,
        username: user.username,
      });

      return {
        status: "ok",
      };
    }),
});
