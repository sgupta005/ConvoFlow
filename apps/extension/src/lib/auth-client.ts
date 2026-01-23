import { createAuthClient } from "better-auth/react"

export const authClient = createAuthClient({
  baseURL: process.env.PLASMO_PUBLIC_BACKEND_URL /* Base URL of your Better Auth backend. */,
  plugins: []
})

export type Session = typeof authClient.$Infer.Session;