import Stripe from 'stripe';
import { NextRequest, NextResponse } from 'next/server';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

// Pays LATAM — prix adapté 1,99 USD
const LATAM_COUNTRIES = [
  'MX','CO','AR','CL','PE','VE','EC','BO','PY','UY',
  'GT','HN','SV','NI','CR','PA','CU','DO','PR'
];

export async function POST(request: NextRequest) {
  const { nombre, fechaNacimiento, email, question } = await request.json();

  if (!nombre || !fechaNacimiento) {
    return NextResponse.json(
      { error: 'Nombre y fecha de nacimiento requeridos' },
      { status: 400 }
    );
  }

  // Détection pays via header Vercel (gratuit, automatique)
  const country = request.headers.get('x-vercel-ip-country') || '';
  const isLatam = LATAM_COUNTRIES.includes(country);

  const priceId = isLatam && process.env.STRIPE_PRICE_ID_LATAM
    ? process.env.STRIPE_PRICE_ID_LATAM
    : process.env.STRIPE_PRICE_ID!;

  const session = await stripe.checkout.sessions.create({
    payment_method_types: ['card'],
    line_items: [
      {
        price: priceId,
        quantity: 1,
      },
    ],
    mode: 'payment',
    metadata: {
      prenom: nombre,
      dateNaissance: fechaNacimiento,
      email: email || '',
      question: question || '',
      country,
      priceType: isLatam ? 'latam' : 'standard',
    },
    success_url: `${process.env.NEXT_PUBLIC_URL}/success?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${process.env.NEXT_PUBLIC_URL}/`,
  });

  return NextResponse.json({ url: session.url });
}
