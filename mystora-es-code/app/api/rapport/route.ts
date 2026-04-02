import Anthropic from '@anthropic-ai/sdk';
import { NextRequest, NextResponse } from 'next/server';
import { put } from '@vercel/blob';

const client = new Anthropic();

// ============ CÁLCULOS REALES (mismos que en /api/astro) ============

function getZodiac(day: number, month: number) {
  const signs = [
    { name: 'Capricornio', element: 'Tierra', modalidad: 'Cardinal', planeta: 'Saturno', start: [12,22], end: [1,19] },
    { name: 'Acuario', element: 'Aire', modalidad: 'Fijo', planeta: 'Urano', start: [1,20], end: [2,18] },
    { name: 'Piscis', element: 'Agua', modalidad: 'Mutable', planeta: 'Neptuno', start: [2,19], end: [3,20] },
    { name: 'Aries', element: 'Fuego', modalidad: 'Cardinal', planeta: 'Marte', start: [3,21], end: [4,19] },
    { name: 'Tauro', element: 'Tierra', modalidad: 'Fijo', planeta: 'Venus', start: [4,20], end: [5,20] },
    { name: 'Géminis', element: 'Aire', modalidad: 'Mutable', planeta: 'Mercurio', start: [5,21], end: [6,20] },
    { name: 'Cáncer', element: 'Agua', modalidad: 'Cardinal', planeta: 'Luna', start: [6,21], end: [7,22] },
    { name: 'Leo', element: 'Fuego', modalidad: 'Fijo', planeta: 'Sol', start: [7,23], end: [8,22] },
    { name: 'Virgo', element: 'Tierra', modalidad: 'Mutable', planeta: 'Mercurio', start: [8,23], end: [9,22] },
    { name: 'Libra', element: 'Aire', modalidad: 'Cardinal', planeta: 'Venus', start: [9,23], end: [10,22] },
    { name: 'Escorpio', element: 'Agua', modalidad: 'Fijo', planeta: 'Plutón', start: [10,23], end: [11,21] },
    { name: 'Sagitario', element: 'Fuego', modalidad: 'Mutable', planeta: 'Júpiter', start: [11,22], end: [12,21] },
  ];
  for (const s of signs) {
    if (s.start[0] === 12 && s.end[0] === 1) {
      if ((month === 12 && day >= 22) || (month === 1 && day <= 19)) return s;
    } else {
      if ((month === s.start[0] && day >= s.start[1]) || (month === s.end[0] && day <= s.end[1])) return s;
    }
  }
  return signs[0];
}

function getDecan(day: number, month: number) {
  const zodiac = getZodiac(day, month);
  const signs = ['Aries','Tauro','Géminis','Cáncer','Leo','Virgo','Libra','Escorpio','Sagitario','Capricornio','Acuario','Piscis'];
  const idx = signs.indexOf(zodiac.name);
  const startDays = [21,20,21,21,23,23,23,23,22,22,20,22];
  const signStart = startDays[idx] || 21;
  const dayInSign = day >= signStart ? day - signStart : day + 10;
  if (dayInSign < 10) return { num: 1, influence: signs[idx] };
  if (dayInSign < 20) return { num: 2, influence: signs[(idx + 4) % 12] };
  return { num: 3, influence: signs[(idx + 8) % 12] };
}

function reduceToSingle(n: number): number {
  while (n > 9 && n !== 11 && n !== 22 && n !== 33) {
    let sum = 0;
    for (const d of String(n)) sum += parseInt(d);
    n = sum;
  }
  return n;
}

function getLifePath(day: number, month: number, year: number): number {
  return reduceToSingle(reduceToSingle(day) + reduceToSingle(month) + reduceToSingle(Array.from(String(year)).reduce((s, c) => s + parseInt(c), 0)));
}

function getExpressionNumber(nombre: string): number {
  const table: Record<string, number> = {a:1,b:2,c:3,d:4,e:5,f:6,g:7,h:8,i:9,j:1,k:2,l:3,m:4,n:5,o:6,p:7,q:8,r:9,s:1,t:2,u:3,v:4,w:5,x:6,y:7,z:8};
  const clean = nombre.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z]/g, '');
  let sum = 0;
  for (const c of clean) sum += table[c] || 0;
  return reduceToSingle(sum);
}

function getSoulUrge(nombre: string): number {
  const table: Record<string, number> = {a:1,e:5,i:9,o:6,u:3,y:7};
  const clean = nombre.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z]/g, '');
  let sum = 0;
  for (const c of clean) { if (table[c]) sum += table[c]; }
  return reduceToSingle(sum);
}

function getPersonalYear(day: number, month: number): number {
  const currentYear = new Date().getFullYear();
  return reduceToSingle(day + month + reduceToSingle(Array.from(String(currentYear)).reduce((s, c) => s + parseInt(c), 0)));
}

function getPersonalMonth(day: number, month: number): number {
  return reduceToSingle(getPersonalYear(day, month) + new Date().getMonth() + 1);
}

function getCompatibleSigns(signName: string): string[] {
  const compat: Record<string, string[]> = {
    'Aries': ['Leo','Sagitario','Géminis','Acuario'],
    'Tauro': ['Virgo','Capricornio','Cáncer','Piscis'],
    'Géminis': ['Libra','Acuario','Aries','Leo'],
    'Cáncer': ['Escorpio','Piscis','Tauro','Virgo'],
    'Leo': ['Aries','Sagitario','Géminis','Libra'],
    'Virgo': ['Tauro','Capricornio','Cáncer','Escorpio'],
    'Libra': ['Géminis','Acuario','Leo','Sagitario'],
    'Escorpio': ['Cáncer','Piscis','Virgo','Capricornio'],
    'Sagitario': ['Aries','Leo','Libra','Acuario'],
    'Capricornio': ['Tauro','Virgo','Escorpio','Piscis'],
    'Acuario': ['Géminis','Libra','Aries','Sagitario'],
    'Piscis': ['Cáncer','Escorpio','Tauro','Capricornio'],
  };
  return compat[signName] || [];
}

// ============ API ROUTE ============

export async function POST(request: NextRequest) {
  const { sessionId } = await request.json();
  
  if (!sessionId) {
    return NextResponse.json({ error: 'Sesión no encontrada' }, { status: 400 });
  }

  // Vérifier le paiement Stripe
  const stripe = new (await import('stripe')).default(process.env.STRIPE_SECRET_KEY!);
  let session;
  try {
    session = await stripe.checkout.sessions.retrieve(sessionId);
  } catch {
    return NextResponse.json({ error: 'Sesión inválida' }, { status: 400 });
  }

  if (session.payment_status !== 'paid') {
    return NextResponse.json({ error: 'Pago no confirmado' }, { status: 403 });
  }

  // Récupérer les données depuis les metadata Stripe (source de vérité)
  const nombre = session.metadata?.prenom || '';
  const fechaNacimiento = session.metadata?.dateNaissance || '';
  const email = session.metadata?.email || '';
  const question = session.metadata?.question || '';

  if (!nombre || !fechaNacimiento) {
    return NextResponse.json({ error: 'Datos incompletos' }, { status: 400 });
  }

  const parts = fechaNacimiento.split('-');
  const year = parseInt(parts[0]);
  const month = parseInt(parts[1]);
  const day = parseInt(parts[2]);

  const zodiac = getZodiac(day, month);
  const decan = getDecan(day, month);
  const lifePath = getLifePath(day, month, year);
  const expression = getExpressionNumber(nombre);
  const soulUrge = getSoulUrge(nombre);
  const personalYear = getPersonalYear(day, month);
  const personalMonth = getPersonalMonth(day, month);
  const compatible = getCompatibleSigns(zodiac.name);

  const astroData = `DATOS ASTRO-NUMEROLÓGICOS REALES:
- Nombre: ${nombre}
- Fecha de nacimiento: ${day}/${month}/${year}
- Signo solar: ${zodiac.name}
- Elemento: ${zodiac.element}
- Modalidad: ${zodiac.modalidad}
- Planeta dominante: ${zodiac.planeta}
- Decanato: ${decan.num}° decanato (influencia ${decan.influence})
- Camino de vida: ${lifePath}
- Número de expresión (vibración del nombre): ${expression}
- Número íntimo (deseo del alma): ${soulUrge}
- Año personal 2026: ${personalYear}
- Mes personal actual: ${personalMonth}
- Signos más compatibles: ${compatible.join(', ')}`;

  const intentionLabels: Record<string, string> = {
    amor: "la persona desea aclarar su vida amorosa y sus relaciones. Comienza el informe con una sección dedicada al amor, las compatibilidades y las energías relacionales actuales, LUEGO continúa con el perfil completo.",
    carrera: "la persona desea aclarar su carrera y su evolución profesional. Comienza el informe con una sección dedicada a la carrera, las oportunidades y los bloqueos profesionales actuales, LUEGO continúa con el perfil completo.",
    dinero: "la persona desea aclarar su situación financiera. Comienza el informe con una sección dedicada al dinero, los flujos financieros y los períodos favorables para las decisiones financieras, LUEGO continúa con el perfil completo.",
    bloqueo: "la persona siente un bloqueo personal y busca liberarse. Comienza el informe con una sección dedicada a los bloqueos identificados en su tema, sus orígenes y las claves para superarlos, LUEGO continúa con el perfil completo.",
  };

  const questionContext = question && intentionLabels[question]
    ? `\n\nIMPORTANTE: ${intentionLabels[question]}`
    : question
      ? `\n\nIMPORTANTE: La persona ha hecho esta pregunta: "${question}". Comienza el informe respondiendo directamente a esta pregunta usando los datos astro-numerológicos reales, LUEGO continúa con el perfil completo.`
      : '';

  const message = await client.messages.create({
    model: 'claude-sonnet-4-6',
    max_tokens: 2000,
    system: `Eres un astrólogo y numerólogo experto. Generas informes basados en DATOS REALES astro-numerológicos con fines de entretenimiento.

REGLAS:
- Utiliza TODOS los datos reales proporcionados (signo, decanato, camino de vida, números, año personal, etc.)
- Cita los números reales y correspondencias en el informe
- Explica lo que cada número significa concretamente para la persona
- Haz conexiones entre los diferentes datos (ej: "Su camino de vida 7 combinado con su año personal 3 crea...")
- Mantén un tono positivo, alentador y benevolente
- NUNCA hagas predicciones negativas (salud, muerte, accidentes)
- Usa "tendencias", "energías", "potencial" — nunca "predice" o "seguro"
- NUNCA menciones la IA
- Texto plano únicamente, sin markdown, sin **, sin #
- Trata SIEMPRE de usted (nunca tutear). Usa el nombre`,
    messages: [
      {
        role: 'user',
        content: `${astroData}${questionContext}

Genera un informe completo para ${nombre} utilizando TODOS los datos anteriores:

1. Respuesta a la pregunta (si fue hecha) — basada en los datos reales
2. Perfil de personalidad (signo + decanato + elemento + planeta)
3. Numerología: camino de vida ${lifePath}, expresión ${expression}, número íntimo ${soulUrge}
4. Vida amorosa (compatibilidades reales: ${compatible.join(', ')})
5. Carrera y finanzas (basadas en camino de vida y año personal)
6. Año personal ${personalYear} — lo que significa para 2026
7. Mes personal ${personalMonth} — energías del momento
8. Consejo personalizado final

Aproximadamente 800-1000 palabras. Cada sección debe citar los números reales.`
      }
    ]
  });

  const texte = message.content[0].type === 'text' ? message.content[0].text : '';

  const id = Math.random().toString(36).substring(2, 10);
  const dateCreation = new Date().toISOString();

  const blob = await put(`rapports/${id}.json`, JSON.stringify({
    id, nombre, fechaNacimiento, email: email || '', question: question || '', dateCreation, rapport: texte,
  }), { access: 'public' });

  // Envoi email automatique si disponible
  if (email) {
    fetch(`${process.env.NEXT_PUBLIC_URL}/api/send-rapport`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, nombre, rapport: texte }),
    }).catch(() => {});
  }

  // Tracking serveur — vente confirmée
  const priceType = session.metadata?.priceType || 'standard';
  console.log(`[MYSTORA_ES_EVENT] ${JSON.stringify({
    timestamp: new Date().toISOString(),
    event: 'checkout_complete',
    nombre,
    country: session.metadata?.country || 'unknown',
    priceType,
    sessionId,
  })}`);

  return NextResponse.json({ resultat: texte, prenom: nombre, email, partageId: id, partageUrl: blob.url });
}
