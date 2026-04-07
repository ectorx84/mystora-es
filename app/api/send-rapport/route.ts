import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  const { email, nombre, rapport, partageId } = await request.json();

  const partageUrl = partageId ? `https://www.mystora.es/partage/${partageId}` : '';
  const whatsappMsg = encodeURIComponent(`Acabo de descubrir mi perfil astrológico en Mystora 🔮 Descubre el tuyo: ${partageUrl}`);
  const whatsappUrl = `https://wa.me/?text=${whatsappMsg}`;

  try {
    const res = await fetch('https://api.brevo.com/v3/smtp/email', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'api-key': process.env.BREVO_API_KEY!,
      },
      body: JSON.stringify({
        sender: { name: 'Mystora', email: 'contact@mystora.es' },
        to: [{ email, name: nombre }],
        subject: `✦ ${nombre}, aquí tiene su mensaje completo`,
        htmlContent: `
          <div style="background:#080613;padding:0;font-family:Arial,Helvetica,sans-serif;color:#E5E5E5;max-width:600px;margin:0 auto;">
            <!-- Header -->
            <div style="text-align:center;padding:40px 20px 20px;">
              <div style="font-size:28px;margin-bottom:4px;">✦</div>
              <h1 style="color:#D4A574;font-size:24px;margin:0;font-weight:bold;">Mystora</h1>
              <p style="color:#E5E5E5;font-size:16px;margin-top:8px;">Su mensaje completo, ${nombre}</p>
            </div>

            <!-- Rapport -->
            <div style="background:#1A1747;padding:28px;border-radius:16px;margin:0 20px;line-height:1.8;font-size:14px;color:#E5E5E5;border:1px solid rgba(139,92,246,0.1);">
              ${rapport.replace(/\n/g, '<br/>')}
            </div>

            ${partageUrl ? `
            <!-- Partage -->
            <div style="background:#1A1747;padding:24px;border-radius:16px;margin:20px;text-align:center;border:1px solid rgba(212,165,116,0.2);">
              <p style="color:#D4A574;font-weight:bold;font-size:15px;margin:0 0 16px;">✨ Comparta su perfil con sus seres queridos</p>
              <p style="color:#9CA3AF;font-size:12px;margin:0 0 16px;">${partageUrl}</p>
              <a href="${whatsappUrl}" target="_blank" style="display:inline-block;background:#22C55E;color:white;text-decoration:none;padding:12px 32px;border-radius:12px;font-weight:bold;font-size:14px;">💬 Compartir en WhatsApp</a>
            </div>
            ` : ''}

            <!-- CTA retour -->
            <div style="text-align:center;padding:20px;">
              <a href="https://www.mystora.es" target="_blank" style="display:inline-block;background:linear-gradient(135deg,#7C3AED,#6D28D9);color:white;text-decoration:none;padding:14px 36px;border-radius:12px;font-weight:bold;font-size:14px;">🔮 Descubrir un nuevo mensaje</a>
            </div>

            <!-- Footer -->
            <div style="text-align:center;padding:20px;border-top:1px solid rgba(139,92,246,0.1);margin:0 20px;">
              <p style="color:#6B7280;font-size:11px;margin:0;">Contenido de entretenimiento — mystora.es</p>
            </div>
          </div>
        `,
      }),
    });

    const data = await res.json();
    console.log('Brevo response:', JSON.stringify(data));

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error Brevo:', error);
    return NextResponse.json({ error: 'Error envío email' }, { status: 500 });
  }
}
