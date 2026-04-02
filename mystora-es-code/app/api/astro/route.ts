import Anthropic from '@anthropic-ai/sdk';
import { NextRequest, NextResponse } from 'next/server';

const client = new Anthropic();

// ============ CÁLCULOS ASTRO/NUMEROLOGÍA REALES ============

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
    if (s.start[0] === s.end[0]) {
      if (month === s.start[0] && day >= s.start[1] && day <= s.end[1]) return s;
    } else if (s.start[0] === 12 && s.end[0] === 1) {
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
  const d = reduceToSingle(day);
  const m = reduceToSingle(month);
  const y = reduceToSingle(Array.from(String(year)).reduce((s, c) => s + parseInt(c), 0));
  return reduceToSingle(d + m + y);
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
  const currentMonth = new Date().getMonth() + 1;
  return reduceToSingle(getPersonalYear(day, month) + currentMonth);
}

const LIFE_PATH_KEYWORDS: Record<number, string> = {
  1: 'líder nato, independiente, pionero',
  2: 'diplomático, sensible, mediador',
  3: 'creativo, expresivo, comunicador',
  4: 'constructor, estable, metódico',
  5: 'aventurero, libre, adaptable',
  6: 'protector, responsable, armonioso',
  7: 'buscador, espiritual, analítico',
  8: 'ambicioso, poderoso, materialista',
  9: 'humanista, generoso, visionario',
  11: 'intuitivo, inspirador, maestro espiritual',
  22: 'maestro constructor, visionario, realizador',
  33: 'maestro enseñante, sanador, altruista',
};

// ============ API ROUTE ============

export async function POST(request: NextRequest) {
  const { nombre, fechaNacimiento, intencion } = await request.json();
  
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

  const astroData = `DATOS ASTRO-NUMEROLÓGICOS REALES DE ${nombre}:
- Signo solar: ${zodiac.name} (${zodiac.element}, ${zodiac.modalidad})
- Planeta dominante: ${zodiac.planeta}
- Decanato: ${decan.num}° decanato, influencia ${decan.influence}
- Camino de vida: ${lifePath} (${LIFE_PATH_KEYWORDS[lifePath] || 'único'})
- Número de expresión (nombre): ${expression}
- Número íntimo (vocales): ${soulUrge}
- Año personal 2026: ${personalYear}
- Mes personal actual: ${personalMonth}`;

  const intentionLabels: Record<string, string> = {
    amor: 'amor y relaciones',
    carrera: 'carrera y evolución profesional',
    dinero: 'dinero y finanzas',
    bloqueo: 'bloqueos personales y liberación',
  };
  const intentionText = intencion && intentionLabels[intencion]
    ? `\n- Área de preocupación: ${intentionLabels[intencion]}`
    : '';

  const intentionInstruction = intencion && intentionLabels[intencion]
    ? `La persona quiere aclarar: ${intentionLabels[intencion]}. La frase 3 DEBE abordar este tema específicamente.`
    : '';

  const message = await client.messages.create({
    model: 'claude-haiku-4-5-20251001',
    max_tokens: 350,
    system: `Eres un astrólogo para Mystora. Genera una lectura corta e impactante.

REGLAS ABSOLUTAS:
- EXACTAMENTE 5 frases. No 3. No 6. CINCO frases.
- Frase 1 (EL ESPEJO): Ataque directo con el nombre. Cita su signo (${zodiac.name}), su decanato (${decan.num}°) y su camino de vida (${lifePath}). Haz una observación de personalidad tan precisa que el lector piense "¿cómo lo sabe?".
- Frase 2 (LA TENSIÓN): Revela algo perturbador sobre su período actual (año personal ${personalYear}, mes personal ${personalMonth}). Sé concreto: amor, dinero, decisión, bloqueo. Crea una tensión emocional.
- Frase 3 (EL VÍNCULO): ${intentionInstruction || 'Haz un vínculo emocional fuerte con un aspecto concreto de su vida (amor o carrera).'} Utiliza el número de expresión ${expression} para apoyar.
- Frase 4 (LA SEÑAL): Revela una señal específica ligada a la combinación de su camino de vida ${lifePath} y su año personal ${personalYear}. Algo concreto que va a manifestarse.
- Frase 5 (EL CORTE): Comienza a revelar un secreto ligado a su número íntimo ${soulUrge} — luego CORTA EN SECO a mitad de frase. La frase DEBE estar INCOMPLETA. El lector DEBE querer saber más.
- Trata SIEMPRE de usted (nunca tutear). Usa el nombre.
- Texto plano, sin markdown, sin títulos, sin negritas, sin números.
- No menciones nunca la IA.
- El total debe tener entre 90 y 140 palabras.`,
    messages: [
      {
        role: 'user',
        content: `${astroData}${intentionText}\n\nGenera EXACTAMENTE 5 frases para ${nombre}. Ultra-personalizado con los números reales. La 5ª frase DEBE estar cortada a mitad.`
      }
    ]
  });

  const texte = message.content[0].type === 'text' ? message.content[0].text : '';
  
  return NextResponse.json({ resultado: texte, signo: zodiac.name });
}
