import type { Request, Response, NextFunction } from 'express';
import { prisma } from '@workspace/db';

export async function authMiddleware(req: Request, res: Response, next: NextFunction) {
  try {
    // Extract session token from cookies
    // Better Auth uses 'better-auth.session_token' cookie by default
    const cookieHeader = req.headers.cookie;
    if (!cookieHeader) {
      return res.status(401).json({ error: 'Unauthorized - No session cookie' });
    }

    // Parse cookie to get session token
    const cookies = parseCookies(cookieHeader);
    const sessionToken = cookies['better-auth.session_token']?.split('.')[0];
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
