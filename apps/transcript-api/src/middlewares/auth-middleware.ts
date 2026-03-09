import type { Request, Response, NextFunction } from 'express';
import { prisma } from '@workspace/db';

export async function authMiddleware(req: Request, res: Response, next: NextFunction) {
  try {
    // Accept token from query parameter (for cross-origin SSE) or from cookies
    const sessionToken = extractSessionToken(req);
    if (!sessionToken) {
      return res.status(401).json({ error: 'Unauthorized - No session token' });
    }

    // Verify session with database
    const session = await prisma.session.findUnique({
      where: { token: sessionToken },
      include: { user: true },
    });
    if (!session || !session.user) {
      return res.status(401).json({ error: 'Unauthorized - Invalid session' });
    }

    // Check if session is expired
    if (session.expiresAt && new Date(session.expiresAt) < new Date()) {
      return res.status(401).json({ error: 'Unauthorized - Session expired' });
    }

    // Attach user info to request
    req.headers['x-user-id'] = session.user.id;
    req.headers['x-user-email'] = session.user.email;

    next();
  } catch (error) {
    console.error('Auth middleware error:', error);
    return res.status(500).json({ error: 'Internal authentication error' });
  }
}

function extractSessionToken(req: Request): string | undefined {
  const queryToken = req.query.token as string | undefined;
  if (queryToken) return queryToken;

  const cookieHeader = req.headers.cookie;
  if (!cookieHeader) return undefined;

  const cookies = parseCookies(cookieHeader);
  return (
    cookies['better-auth.session_token']?.split('.')[0] ||
    cookies['__Secure-better-auth.session_token']?.split('.')[0]
  );
}

function parseCookies(cookieHeader: string): Record<string, string> {
  const cookies: Record<string, string> = {};

  cookieHeader.split(';').forEach((cookie) => {
    const [name, ...rest] = cookie.split('=');
    const trimmedName = name?.trim();
    const value = rest.join('=').trim();

    if (trimmedName) {
      cookies[trimmedName] = value;
    }
  });

  return cookies;
}
