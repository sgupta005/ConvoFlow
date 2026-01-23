import { betterAuth } from 'better-auth';
import { prismaAdapter } from 'better-auth/adapters/prisma';
import { prisma } from '@workspace/db';

export const auth = betterAuth({
  trustedOrigins: ['chrome-extension://fljdicobpfhohfcpmldbaemhadngokhd', 'http://localhost:3000'],
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
