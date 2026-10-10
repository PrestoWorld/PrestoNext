/**
 * Menus API Route
 */

import { NextRequest, NextResponse } from 'next/server';
import { getRevalidationTime } from '@/config';

const PRESTOWORLD_API_URL = process.env.PRESTOWORLD_API_URL || 'http://localhost:8000';
const API_VERSION = 'v1';

async function proxyRequest(
  request: NextRequest,
  params?: Promise<{ slug: string[] }>
): Promise<NextResponse> {
  let path = '';
  if (params) {
    const { slug } = await params;
    path = slug.join('/');
  }
  
  const url = new URL(request.url);
  const searchParams = url.searchParams.toString();
  
  const targetUrl = `${PRESTOWORLD_API_URL}/api/${API_VERSION}/menus${path ? `/${path}` : ''}${searchParams ? `?${searchParams}` : ''}`;
  
  const response = await fetch(targetUrl, {
    method: request.method,
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
      ...Object.fromEntries(request.headers.entries()),
    },
    body: request.method !== 'GET' && request.method !== 'HEAD' ? await request.text() : undefined,
    next: { revalidate: getRevalidationTime(`/api/menus${path ? `/${path}` : ''}`) },
  });

  const data = await response.json();
  
  return NextResponse.json(data, { 
    status: response.status,
    headers: {
      'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=7200',
    },
  });
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string[] }> | undefined }
) {
  return proxyRequest(request, params);
}