import { NextRequest, NextResponse } from 'next/server';

// Daftar origin yang diizinkan
const allowedOrigins = [
  'http://localhost',
  'http://localhost:3000',
  'http://127.0.0.1',
  'http://127.0.0.1:3000',
  // Tambahkan origin game server lokal di sini, misalnya:
  // 'http://localhost:8080',
  // 'http://192.168.x.x:port',
  'http://localhost:50000/',
];

function getCorsHeaders(origin: string | null) {
  // Jika origin ada di daftar yang diizinkan, atau untuk development izinkan semua
  const isAllowed = origin && (allowedOrigins.includes(origin) || origin.match(/^https?:\/\/localhost(:\d+)?$/));

  return {
    'Access-Control-Allow-Origin': isAllowed ? origin : allowedOrigins[0],
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Requested-With',
    'Access-Control-Allow-Credentials': 'true',
    'Access-Control-Max-Age': '86400',
  };
}

export function middleware(request: NextRequest) {
  const origin = request.headers.get('origin');
  const corsHeaders = getCorsHeaders(origin);

  // Handle preflight OPTIONS request
  if (request.method === 'OPTIONS') {
    return new NextResponse(null, {
      status: 204,
      headers: corsHeaders,
    });
  }

  // Untuk request biasa, tambahkan CORS headers ke response
  const response = NextResponse.next();
  Object.entries(corsHeaders).forEach(([key, value]) => {
    response.headers.set(key, value);
  });

  return response;
}

// Hanya jalankan middleware untuk API routes
export const config = {
  matcher: '/api/:path*',
};
