import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { event, data } = await request.json();
    
    const country = request.headers.get('x-vercel-ip-country') || 'unknown';
    const ua = request.headers.get('user-agent') || '';
    const isMobile = /mobile|android|iphone/i.test(ua);
    
    const logEntry = {
      timestamp: new Date().toISOString(),
      event,
      country,
      device: isMobile ? 'mobile' : 'desktop',
      ...data,
    };

    // Log structuré — visible dans Vercel Function Logs
    console.log(`[MYSTORA_ES_EVENT] ${JSON.stringify(logEntry)}`);

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ ok: false }, { status: 400 });
  }
}
