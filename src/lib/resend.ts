// export const SENDER_EMAIL_ADDRESSES = [
//   "authentication@auth.test-posts.app",
// ] as const;

import { Resend } from "resend";
import { env } from "~/env.mjs";

// export type SenderEmailAddress = (typeof SENDER_EMAIL_ADDRESSES)[number];

export const resend = new Resend(env.RESEND_API_KEY);
