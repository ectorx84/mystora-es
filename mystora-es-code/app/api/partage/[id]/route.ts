import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  try {
    // URL du Blob store ES — à configurer dans env vars
    const blobBaseUrl = process.env.BLOB_BASE_URL || '';
    const url = `${blobBaseUrl}/rapports/${id}.json`;
    const res = await fetch(url);
    if (!res.ok) {
      return NextResponse.json({ error: 'Informe no encontrado' }, { status: 404 });
    }
    const data = await res.json();
    return NextResponse.json(data);
  } catch (e) {
    console.error('Error partage:', e);
    return NextResponse.json({ error: 'Error' }, { status: 500 });
  }
}
