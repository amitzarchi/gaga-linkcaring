import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { db } from "@/lib/db";
import authSchema, { accessRequest } from "@/db/auth-schema";
import { APIError } from "better-auth/api";
import { eq } from "drizzle-orm";

export const auth = betterAuth({
  database: drizzleAdapter(db, {
    provider: "pg",
    schema: authSchema,
  }),
  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    },
  },
  databaseHooks: {
    user: {
      create: {
        before: async (user, ctx) => {
          const isAllowed = await isAllowedToSignUp(user.email);
          if (!isAllowed) {
            throw new APIError("BAD_REQUEST", {
              message: "access-denied&email=" + user.email + "&name=" + user.name,
            });
          }
          return true;
        },
      },
    },
  },
});

const isAllowedToSignUp = async (email: string) => {
  const req = await db
    .select()
    .from(accessRequest)
    .where(eq(accessRequest.email, email));
  if (req.length > 0) {
    return req[0].status === "APPROVED";
  }
  return false;
};
