'use client';
import { Suspense, useEffect, useState, useCallback } from 'react';
import { useSearchParams } from 'next/navigation';

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
  }
}

function gtagEvent(action: string, params?: Record<string, string | number | boolean>) {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', action, params || {});
  }
}

const LOADING_STEPS = [
  { icon: '🔮', text: 'Conexión con su perfil astral...' },
  { icon: '✨', text: 'Análisis de su signo y decanato...' },
  { icon: '🌙', text: 'Cálculo de su camino de vida...' },
  { icon: '🔢', text: 'Estudio de sus números personales...' },
  { icon: '💫', text: 'Lectura de sus ciclos planetarios...' },
  { icon: '❤️', text: 'Análisis de sus compatibilidades...' },
  { icon: '⭐', text: 'Redacción de su orientación personal...' },
  { icon: '🌟', text: 'Verificación de las alineaciones...' },
  { icon: '📜', text: 'Finalización de su informe completo...' },
];

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
  const [currentStep, setCurrentStep] = useState(0);
  const [progress, setProgress] = useState(0);
  const [needsInfo, setNeedsInfo] = useState(false);
  const [fallbackNombre, setFallbackNombre] = useState('');
  const [fallbackDay, setFallbackDay] = useState('');
  const [fallbackMonth, setFallbackMonth] = useState('');
  const [fallbackYear, setFallbackYear] = useState('');
  const [submittingFallback, setSubmittingFallback] = useState(false);

  const fetchRapport = useCallback((extraData?: { prenom: string; dateNaissance: string }) => {
    setLoading(true);
    setError('');
    setCurrentStep(0);
    setProgress(0);

    const stepInterval = setInterval(() => {
      setCurrentStep(prev => {
        if (prev < LOADING_STEPS.length - 1) return prev + 1;
        return prev;
      });
    }, 5000);

    const progressInterval = setInterval(() => {
      setProgress(prev => {
        if (prev < 95) return prev + (95 / 45 / 10);
        return prev;
      });
    }, 100);

    const body: Record<string, string> = { sessionId };
    if (extraData) {
      body.prenom = extraData.prenom;
      body.dateNaissance = extraData.dateNaissance;
    }

    fetch('/api/rapport', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    })
      .then((res) => {
        if (!res.ok) throw new Error('Pago no verificado');
        return res.json();
      })
      .then((data) => {
        clearInterval(stepInterval);
        clearInterval(progressInterval);
        if (data.needsInfo) {
          setNeedsInfo(true);
          setLoading(false);
          return;
        }
        setProgress(100);
        setTimeout(() => {
          setRapport(data.resultat);
          setNombre(data.prenom || '');
          setEmail(data.email || '');
          setPartageId(data.partageId);
          setLoading(false);
          gtagEvent('purchase', {
            transaction_id: sessionId,
            value: 4.90,
            currency: 'EUR',
            item_name: 'Guia Mystora ES',
          });
        }, 500);
      })
      .catch(() => {
        clearInterval(stepInterval);
        clearInterval(progressInterval);
        setError('No se pudo verificar su pago. Si ha pagado, contáctenos en contacto@mystora.es');
        setLoading(false);
      });
  }, [sessionId]);

  useEffect(() => {
    if (!sessionId) {
      setError('Enlace no válido. Por favor, realice el proceso de pago.');
      setLoading(false);
      return;
    }
    fetchRapport();
  }, [sessionId, fetchRapport]);

  const handleFallbackSubmit = () => {
    if (!fallbackNombre.trim() || !fallbackDay || !fallbackMonth || !fallbackYear) return;
    setSubmittingFallback(true);
    const dateNaissance = `${fallbackYear}-${fallbackMonth.padStart(2, '0')}-${fallbackDay.padStart(2, '0')}`;
    setNeedsInfo(false);
    fetchRapport({ prenom: fallbackNombre.trim(), dateNaissance });
  };

  const compartirWhatsApp = () => {
    const enlace = `https://www.mystora.es/partage/${partageId}`;
    const mensaje = `Acabo de descubrir mi perfil astrológico en Mystora 🔮 Descubre el tuyo: ${enlace}`;
    window.open(`https://wa.me/?text=${encodeURIComponent(mensaje)}`, '_blank');
  };

  const copiarEnlace = () => {
    const enlace = `https://www.mystora.es/partage/${partageId}`;
    navigator.clipboard.writeText(enlace);
    setCopie(true);
    setTimeout(() => setCopie(false), 2000);
  };

  if (needsInfo) {
    return (
      <main className="min-h-screen bg-[#080613] flex flex-col items-center px-4 py-12">
        <div className="bg-[#1A1747] rounded-2xl p-8 w-full max-w-md shadow-xl border border-[rgba(139,92,246,0.1)]">
          <div className="text-center mb-6">
            <p className="text-green-400 text-lg font-semibold mb-2">✅ Su pago ha sido confirmado</p>
            <p className="text-gray-300 text-sm">Para generar su informe personalizado, confirme sus datos:</p>
          </div>
          <div className="space-y-4">
            <input
              type="text"
              placeholder="Su nombre"
              value={fallbackNombre}
              onChange={(e) => setFallbackNombre(e.target.value)}
              className="w-full px-4 py-3 rounded-xl bg-[#080613] border border-[rgba(139,92,246,0.2)] text-white placeholder-gray-500 focus:outline-none focus:border-[#D4A574]"
              maxLength={50}
            />
            <div>
              <label className="text-gray-400 text-sm mb-1 block">Fecha de nacimiento</label>
              <div className="flex gap-2">
                <input type="number" placeholder="DD" value={fallbackDay} onChange={e => setFallbackDay(e.target.value)} min="1" max="31" className="w-1/3 px-3 py-3 rounded-xl bg-[#080613] border border-[rgba(139,92,246,0.2)] text-white text-center placeholder-gray-500 focus:outline-none focus:border-[#D4A574]" />
                <input type="number" placeholder="MM" value={fallbackMonth} onChange={e => setFallbackMonth(e.target.value)} min="1" max="12" className="w-1/3 px-3 py-3 rounded-xl bg-[#080613] border border-[rgba(139,92,246,0.2)] text-white text-center placeholder-gray-500 focus:outline-none focus:border-[#D4A574]" />
                <input type="number" placeholder="AAAA" value={fallbackYear} onChange={e => setFallbackYear(e.target.value)} min="1920" max="2010" className="w-1/3 px-3 py-3 rounded-xl bg-[#080613] border border-[rgba(139,92,246,0.2)] text-white text-center placeholder-gray-500 focus:outline-none focus:border-[#D4A574]" />
              </div>
            </div>
            <button
              onClick={handleFallbackSubmit}
              disabled={submittingFallback}
              className="w-full py-3 rounded-xl font-bold text-white bg-gradient-to-r from-[#7C3AED] to-[#6D28D9] hover:from-[#8B5CF6] hover:to-[#7C3AED] transition-all disabled:opacity-50"
            >
              {submittingFallback ? '⏳ Generando...' : '✨ Generar mi informe'}
            </button>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#080613] flex flex-col items-center px-4 py-12">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-white mb-1">✦ <span className="text-[#D4A574]">Mystora</span></h1>
        {!loading && nombre && <p className="text-[#D4A574] text-lg">Su mensaje completo, {nombre}</p>}
      </div>

      <div className="bg-[#1A1747] rounded-2xl p-8 w-full max-w-2xl shadow-xl border border-[rgba(139,92,246,0.1)]">
        {loading ? (
          <div className="py-8">
            <div className="text-center mb-6">
              <p className="text-green-400 text-lg font-semibold mb-1">✅ Pago confirmado</p>
              <p className="text-gray-300 text-sm">Su informe personalizado se está creando</p>
            </div>

            <div className="w-full bg-[#080613] rounded-full h-2 mb-8 overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-[#7C3AED] to-[#D4A574] rounded-full transition-all duration-300"
                style={{ width: `${Math.min(progress, 100)}%` }}
              />
            </div>

            <div className="space-y-3">
              {LOADING_STEPS.map((step, i) => (
                <div key={i} className={`flex items-center gap-3 transition-all duration-500 ${i > currentStep ? 'opacity-20' : 'opacity-100'}`}>
                  <span className="text-lg w-7 text-center">
                    {i < currentStep ? '✅' : (
                      <span className={i === currentStep ? 'animate-pulse' : ''}>{step.icon}</span>
                    )}
                  </span>
                  <span className={`text-sm ${i < currentStep ? 'text-green-400' : i === currentStep ? 'text-[#D4A574] font-semibold' : 'text-gray-500'}`}>
                    {step.text}
                  </span>
                </div>
              ))}
            </div>

            <p className="text-center text-gray-400 text-sm mt-8 animate-pulse">
              ⏳ Su informe se está redactando — no cierre esta página
            </p>
          </div>
        ) : error ? (
          <div className="text-center py-12">
            <p className="text-red-400 text-lg mb-4">⚠️ {error}</p>
            <a href="/" className="text-[#D4A574] underline hover:text-[#E5B88A] transition-colors">← Volver al inicio</a>
          </div>
        ) : (
          <>
            <div className="text-[#E5E5E5] leading-relaxed whitespace-pre-wrap text-[15px]">{rapport}</div>
            {email && (
              <div className="mt-6 p-4 bg-[#080613] rounded-xl border border-[rgba(139,92,246,0.15)] text-center">
                <p className="text-[#D4A574] text-sm">📧 Su informe ha sido enviado a {email}</p>
              </div>
            )}
            <div className="mt-6 p-5 bg-[#080613] rounded-xl border border-[rgba(212,165,116,0.2)] text-center">
              <p className="text-[#D4A574] font-semibold mb-4">✨ Comparta su perfil con sus seres queridos</p>
              <div className="flex gap-3">
                <button
                  onClick={compartirWhatsApp}
                  className="flex-1 bg-[#22C55E] hover:bg-[#16A34A] text-white font-bold py-3 rounded-xl transition-all"
                >
                  💬 WhatsApp
                </button>
                <button
                  onClick={copiarEnlace}
                  className="flex-1 bg-gradient-to-r from-[#7C3AED] to-[#6D28D9] hover:from-[#8B5CF6] hover:to-[#7C3AED] text-white font-bold py-3 rounded-xl transition-all"
                >
                  {copie ? '✅ ¡Copiado!' : '🔗 Copiar enlace'}
                </button>
              </div>
            </div>
            <div className="mt-6 text-center">
              <a href="/" className="text-[#D4A574] text-sm hover:text-[#E5B88A] transition-colors">← Nuevo mensaje</a>
            </div>
          </>
        )}
      </div>

      <p className="text-gray-600 text-xs mt-6">Contenido de entretenimiento — mystora.es · <a href="/legal" className="underline hover:text-gray-400 transition-colors">Aviso legal</a></p>
    </main>
  );
}

export default function Success() {
  return (
    <Suspense fallback={
      <main className="min-h-screen bg-[#080613] flex items-center justify-center">
        <p className="text-[#D4A574] text-xl animate-pulse">✨ Cargando...</p>
      </main>
    }>
      <SuccessContent />
    </Suspense>
  );
}
