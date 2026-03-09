import { auth } from '@/lib/auth';
import { toNextJsHandler } from 'better-auth/next-js';

const { GET: authGET, POST: authPOST } = toNextJsHandler(auth);

const allowedOrigins = [
  process.env.EXTENSION_URL!,
  process.env.WEB_APP_URL!,
];

function withCors(response: Response, origin: string): Response {
  const res = new Response(response.body, response);
  res.headers.set('Access-Control-Allow-Origin', origin);
  res.headers.set('Access-Control-Allow-Credentials', 'true');
  return res;
}

export async function GET(request: Request) {
  const origin = request.headers.get('origin') ?? '';
  const response = await authGET(request);
  return allowedOrigins.includes(origin) ? withCors(response, origin) : response;
}

export async function POST(request: Request) {
  const origin = request.headers.get('origin') ?? '';
  const response = await authPOST(request);
  return allowedOrigins.includes(origin) ? withCors(response, origin) : response;
}

export async function OPTIONS(request: Request) {
  const origin = request.headers.get('origin') ?? '';

  if (!allowedOrigins.includes(origin)) {
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
