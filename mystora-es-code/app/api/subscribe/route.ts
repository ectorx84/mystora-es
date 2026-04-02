import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  const { email, nombre } = await request.json();

  try {
    const res = await fetch('https://api.brevo.com/v3/contacts', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'api-key': process.env.BREVO_API_KEY!,
      },
      body: JSON.stringify({
        email,
        attributes: { PRENOM: nombre, NOMBRE: nombre },
        listIds: [parseInt(process.env.BREVO_LIST_ID_ES || '3')],
        updateEnabled: true,
      }),
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Error Brevo' }, { status: 500 });
  }
}
