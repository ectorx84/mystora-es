import { NextRequest, NextResponse } from 'next/server';

const LATAM_COUNTRIES = [
  'MX','CO','AR','CL','PE','VE','EC','BO','PY','UY',
  'GT','HN','SV','NI','CR','PA','CU','DO','PR'
];

export async function GET(request: NextRequest) {
  const country = request.headers.get('x-vercel-ip-country') || '';
  const isLatam = LATAM_COUNTRIES.includes(country);
  // TEST PRIX 1,99$ POUR TOUS — temporaire 48-72h (à reverter après 11-12 avril)
  return NextResponse.json({
    country,
    price: '1,99$',
    isLatam,
  });
}
