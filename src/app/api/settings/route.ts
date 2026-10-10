/**
 * Settings API Route
 */

import { NextRequest, NextResponse } from 'next/server';
import { getRevalidationTime } from '@/config';

const PRESTOWORLD_API_URL = process.env.PRESTOWORLD_API_URL || 'http://localhost:8000';
const API_VERSION = 'v1';

export async function GET(request: NextRequest) {
  const url = new URL(request.url);
  const searchParams = url.searchParams.toString();
  
  const targetUrl = `${PRESTOWORLD_API_URL}/api/${API_VERSION}/settings${searchParams ? `?${searchParams}` : ''}`;
  
  const response = await fetch(targetUrl, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
      ...Object.fromEntries(request.headers.entries()),
    },
    next: { revalidate: getRevalidationTime('/api/settings') },
  });

  const data = await response.json();
  
  return NextResponse.json(data, { 
    status: response.status,
    headers: {
      'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=7200',
    },
  });
}