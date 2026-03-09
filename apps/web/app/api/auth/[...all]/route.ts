import { auth } from '@/lib/auth';
import { toNextJsHandler } from 'better-auth/next-js';

export const { POST, GET } = toNextJsHandler(auth);

export async function OPTIONS(request: Request) {
  const origin = request.headers.get('origin') ?? '';
  const trustedOrigins = [
    process.env.EXTENSION_URL!,
    process.env.WEB_APP_URL!,
  ];

  if (!trustedOrigins.includes(origin)) {
    return new Response(null, { status: 403 });
  }

  return new Response(null, {
    status: 204,
    headers: {
      'Access-Control-Allow-Origin': origin,
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      'Access-Control-Allow-Credentials': 'true',
    },
  });
}
