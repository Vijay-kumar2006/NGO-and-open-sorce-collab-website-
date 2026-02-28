import { NextResponse } from 'next/server';

const allowedOrigins = new Set([
  process.env.FRONTEND_URL || 'http://localhost:3000',
  'http://127.0.0.1:3000'
]);

export function middleware(request) {
  const response = NextResponse.next();

  const origin = request.headers.get('origin');
  // In development allow requests from the dev frontend origin (dynamic)
  if (origin) {
    if (process.env.NODE_ENV !== 'production') {
      response.headers.set('Access-Control-Allow-Origin', origin);
    } else if (allowedOrigins.has(origin)) {
      response.headers.set('Access-Control-Allow-Origin', origin);
    }
  }
  response.headers.set('Access-Control-Allow-Credentials', 'true');
  response.headers.set(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept, Authorization'
  );
  response.headers.set('Access-Control-Allow-Methods', 'GET, POST, PATCH, PUT, DELETE, OPTIONS');

  if (request.method === 'OPTIONS') {
    return new NextResponse(null, {
      status: 204,
      headers: response.headers
    });
  }

  return response;
}

export const config = {
  matcher: ['/api/:path*']
};
