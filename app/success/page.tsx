'use client';
import { Suspense, useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';

function SuccessContent() {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get('session_id') || '';
  const [rapport, setRapport] = useState('');
  const [nombre, setNombre] = useState('');
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [copie, setCopie] = useState(false);
  const [partageId, setPartageId] = useState('');

  useEffect(() => {
    if (!sessionId) {
      setError('Enlace inválido. Por favor, realice el proceso de pago.');
      setLoading(false);
      return;
    }

    fetch('/api/rapport', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ sessionId }),
    })
      .then((res) => {
        if (!res.ok) throw new Error('Pago no verificado');
        return res.json();
      })
      .then((data) => {
        setRapport(data.resultat);
        setNombre(data.prenom || '');
        setEmail(data.email || '');
        setPartageId(data.partageId);
        setLoading(false);
      })
      .catch(() => {
        setError('Imposible verificar su pago. Si ya pagó, contáctenos en contact@mystora.es');
        setLoading(false);
      });
  }, [sessionId]);

  const compartirWhatsApp = () => {
    const enlace = `${window.location.origin}/partage/${partageId}`;
    const mensaje = `Acabo de descubrir mi perfil astrológico completo en Mystora 🔮 Mira lo que dicen los astros de mí... y descubre el tuyo: ${enlace}`;
    window.open(`https://wa.me/?text=${encodeURIComponent(mensaje)}`, '_blank');
  };

  const copiarEnlace = () => {
    const enlace = `${window.location.origin}/partage/${partageId}`;
    navigator.clipboard.writeText(enlace);
    setCopie(true);
    setTimeout(() => setCopie(false), 2000);
  };

  return (
    <main className="min-h-screen bg-[#1E1B4B] flex flex-col items-center px-4 py-12">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold text-white mb-2">🔮 Mystora</h1>
        {nombre && <p className="text-[#D4A574] text-lg">Su informe completo, {nombre}</p>}
      </div>

      <div className="bg-[#2D2A6E] rounded-2xl p-8 w-full max-w-2xl shadow-xl">
        {loading ? (
          <div className="text-center py-12">
            <p className="text-[#D4A574] text-xl animate-pulse">✨ Los astros revelan su destino...</p>
          </div>
        ) : error ? (
          <div className="text-center py-12">
            <p className="text-red-400 text-lg mb-4">⚠️ {error}</p>
            <a href="/" className="text-[#D4A574] underline">Volver al inicio</a>
          </div>
        ) : (
          <>
            <div className="text-white leading-relaxed whitespace-pre-wrap">{rapport}</div>
            {email && (
              <div className="mt-6 p-4 bg-[#1E1B4B] rounded-xl border border-[#6B21A8] text-center">
                <p className="text-[#D4A574] text-sm">📧 Su informe ha sido enviado a {email}</p>
              </div>
            )}
            <div className="mt-6 p-4 bg-[#1E1B4B] rounded-xl border border-[#D4A574] text-center">
              <p className="text-[#D4A574] font-semibold mb-3">✨ Comparta su perfil con sus seres queridos</p>
              <div className="flex gap-3">
                <button
                  onClick={compartirWhatsApp}
                  className="flex-1 bg-green-600 hover:bg-green-500 text-white font-bold py-3 rounded-xl transition-all">
                  💬 Compartir en WhatsApp
                </button>
                <button
                  onClick={copiarEnlace}
                  className="flex-1 bg-[#6B21A8] hover:bg-[#7C3AED] text-white font-bold py-3 rounded-xl transition-all">
                  {copie ? '✅ ¡Copiado!' : '🔗 Copiar enlace'}
                </button>
              </div>
            </div>
          </>
        )}
      </div>

      <p className="text-gray-500 text-sm mt-6">Entretenimiento</p>
    </main>
  );
}

export default function Success() {
  return (
    <Suspense fallback={
      <main className="min-h-screen bg-[#1E1B4B] flex items-center justify-center">
        <p className="text-[#D4A574] text-xl animate-pulse">✨ Cargando...</p>
      </main>
    }>
      <SuccessContent />
    </Suspense>
  );
}
