/**
 * Posts API Route
 * Proxies requests to PrestoWorld CMS
 */

import { NextRequest, NextResponse } from 'next/server';
import { prestoworldApi } from '@/lib/api/prestoworld-client';
import { getRevalidationTime } from '@/config';

const PRESTOWORLD_API_URL = process.env.PRESTOWORLD_API_URL || 'http://localhost:8000';
const API_VERSION = 'v1';

async function proxyRequest(
  request: NextRequest,
  endpoint: string
): Promise<NextResponse> {
  const url = new URL(request.url);
  const pathname = url.pathname.replace(`/api/posts`, '');
  const searchParams = url.searchParams.toString();
  
  const targetUrl = `${PRESTOWORLD_API_URL}/api/${API_VERSION}/posts${pathname}${searchParams ? `?${searchParams}` : ''}`;
  
  const response = await fetch(targetUrl, {
    method: request.method,
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
      ...Object.fromEntries(request.headers.entries()),
    },
    body: request.method !== 'GET' && request.method !== 'HEAD' ? await request.text() : undefined,
    next: { revalidate: getRevalidationTime(`/api/posts${pathname}`) },
  });

  const data = await response.json();
  
  return NextResponse.json(data, { 
    status: response.status,
    headers: {
      'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=300',
    },
  });
}

export async function GET(request: NextRequest) {
  return proxyRequest(request, '/posts');
}

export async function POST(request: NextRequest) {
  return proxyRequest(request, '/posts');
}