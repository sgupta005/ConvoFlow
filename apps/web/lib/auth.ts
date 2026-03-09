import { betterAuth } from 'better-auth';
import { prismaAdapter } from 'better-auth/adapters/prisma';
import { prisma } from '@workspace/db';

export const auth = betterAuth({
  emailAndPassword: {
    enabled: true,
    requireEmailVerification: false,
  },
  trustedOrigins: [process.env.EXTENSION_URL!, process.env.WEB_APP_URL!],
  database: prismaAdapter(prisma, {
    provider: 'postgresql',
  }),
  socialProviders: {
    google: {
      clientId: process.env.AUTH_GOOGLE_ID!,
      clientSecret: process.env.AUTH_GOOGLE_SECRET!,
    },
  },
});
