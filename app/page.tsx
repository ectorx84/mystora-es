'use client';
import { useState, useRef, useEffect, useCallback } from 'react';

// ===== TRACKING =====
function trackEvent(event: string, data?: Record<string, string | number | boolean>) {
  fetch('/api/track', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ event, data: data || {} }),
  }).catch(() => {});
}

const LOADING_MESSAGES = [
  "Conexión con los astros...",
  "Lectura de su tema astral...",
  "Análisis de sus energías...",
  "Cálculo de sus vibraciones...",
  "Un mensaje se revela..."
];

// ===== STARS DATA =====
const STARS = [
  { top: '5%', left: '10%', size: 4, duration: 3 },
  { top: '12%', left: '85%', size: 6, duration: 4.5 },
  { top: '20%', left: '45%', size: 5, duration: 3.8 },
  { top: '8%', left: '60%', size: 4, duration: 5 },
  { top: '30%', left: '20%', size: 7, duration: 4 },
  { top: '25%', left: '75%', size: 5, duration: 3.2 },
  { top: '40%', left: '5%', size: 6, duration: 4.8 },
  { top: '35%', left: '90%', size: 4, duration: 3.5 },
  { top: '50%', left: '30%', size: 8, duration: 5.5 },
  { top: '45%', left: '65%', size: 5, duration: 3.7 },
  { top: '55%', left: '15%', size: 4, duration: 4.2 },
  { top: '60%', left: '80%', size: 6, duration: 3.3 },
  { top: '65%', left: '50%', size: 5, duration: 4.6 },
  { top: '70%', left: '35%', size: 7, duration: 5.2 },
  { top: '75%', left: '70%', size: 4, duration: 3.9 },
  { top: '80%', left: '10%', size: 6, duration: 4.4 },
  { top: '85%', left: '55%', size: 5, duration: 3.6 },
  { top: '90%', left: '25%', size: 4, duration: 5.1 },
  { top: '92%', left: '85%', size: 7, duration: 4.3 },
  { top: '15%', left: '30%', size: 5, duration: 3.4 },
  { top: '38%', left: '55%', size: 4, duration: 4.7 },
  { top: '48%', left: '8%', size: 6, duration: 3.1 },
  { top: '58%', left: '92%', size: 5, duration: 5.3 },
  { top: '72%', left: '48%', size: 4, duration: 4.1 },
  { top: '88%', left: '40%', size: 6, duration: 3.8 },
];

const PARTICLES = [
  { bottom: '0%', left: '10%', size: 8, duration: 12 },
  { bottom: '0%', left: '25%', size: 10, duration: 15 },
  { bottom: '0%', left: '40%', size: 7, duration: 11 },
  { bottom: '0%', left: '55%', size: 12, duration: 14 },
  { bottom: '0%', left: '70%', size: 9, duration: 13 },
  { bottom: '0%', left: '85%', size: 8, duration: 16 },
  { bottom: '0%', left: '33%', size: 11, duration: 10 },
  { bottom: '0%', left: '65%', size: 7, duration: 17 },
];

export default function Home() {
  const [nombre, setNombre] = useState('');
  const [email, setEmail] = useState('');
  const [dia, setDia] = useState('');
  const [mes, setMes] = useState('');
  const [anio, setAnio] = useState('');
  const [intencion, setIntencion] = useState('');
  const [resultado, setResultado] = useState('');
  const [signoInfo, setSignoInfo] = useState('');
  const [step, setStep] = useState<'form' | 'loading' | 'result'>('form');
  const [loadingIdx, setLoadingIdx] = useState(0);
  const [payLoading, setPayLoading] = useState(false);
  const [blocked, setBlocked] = useState(false);
  const [timeLeft, setTimeLeft] = useState('');
  const [emailSent, setEmailSent] = useState(false);
  const [displayPrice, setDisplayPrice] = useState('4,90€');
  const [anchorPrice, setAnchorPrice] = useState('14,90€');

  useEffect(() => {
    fetch('/api/geo').then(r => r.json()).then(d => {
      if (d.price) setDisplayPrice(d.price);
      if (d.isLatam) setAnchorPrice('9,90$');
    }).catch(() => {});
    const params = new URLSearchParams(window.location.search);
    const nombreParam = params.get('nombre');
    if (nombreParam) setNombre(nombreParam);
    trackEvent('landing_view', { source: nombreParam ? 'manychat_or_brevo' : 'direct' });
  }, []);

  useEffect(() => {
    const lastTest = localStorage.getItem('mystora_es_last_test');
    if (lastTest) {
      const elapsed = Date.now() - parseInt(lastTest);
      const limit = 24 * 60 * 60 * 1000;
      if (elapsed < limit) {
        setBlocked(true);
        const remaining = limit - elapsed;
        const h = Math.floor(remaining / 3600000);
        const m = Math.floor((remaining % 3600000) / 60000);
        setTimeLeft(`${h}h${m.toString().padStart(2, '0')}`);
        const savedResult = localStorage.getItem('mystora_es_last_result');
        const savedNombre = localStorage.getItem('mystora_es_last_nombre');
        const savedDate = localStorage.getItem('mystora_es_last_date');
        const savedSigno = localStorage.getItem('mystora_es_last_signo');
        if (savedResult && savedNombre) {
          setResultado(savedResult);
          setNombre(savedNombre);
          if (savedSigno) setSignoInfo(savedSigno);
          if (savedDate) {
            const parts = savedDate.split('-');
            if (parts.length === 3) {
              setAnio(parts[0]);
              setMes(parts[1]);
              setDia(parts[2]);
            }
          }
          setStep('result');
        }
      } else {
        localStorage.removeItem('mystora_es_last_result');
        localStorage.removeItem('mystora_es_last_nombre');
        localStorage.removeItem('mystora_es_last_date');
        localStorage.removeItem('mystora_es_last_signo');
      }
    }
  }, []);

  const mesRef = useRef<HTMLInputElement>(null);
  const anioRef = useRef<HTMLInputElement>(null);
  const resultRef = useRef<HTMLDivElement>(null);

  const fechaNacimiento = anio.length === 4 && mes.length === 2 && dia.length === 2
    ? `${anio}-${mes}-${dia}` : '';

  const handleDia = (val: string) => {
    const clean = val.replace(/\D/g, '').slice(0, 2);
    setDia(clean);
    if (clean.length === 2) mesRef.current?.focus();
  };
  const handleMes = (val: string) => {
    const clean = val.replace(/\D/g, '').slice(0, 2);
    setMes(clean);
    if (clean.length === 2) anioRef.current?.focus();
  };
  const handleAnio = (val: string) => {
    setAnio(val.replace(/\D/g, '').slice(0, 4));
  };

  useEffect(() => {
    if (step !== 'loading') return;
    const iv = setInterval(() => setLoadingIdx(i => (i + 1) % LOADING_MESSAGES.length), 1800);
    return () => clearInterval(iv);
  }, [step]);

  useEffect(() => {
    if (step === 'result' && resultRef.current) {
      resultRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [step]);

  const handleSubmit = async () => {
    if (!nombre || !fechaNacimiento || blocked) return;
    const nombreCap = nombre.trim().split(/\s+/).map(w => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase()).join(' ');
    setNombre(nombreCap);
    trackEvent('form_submit', { nombre_length: nombreCap.length, intencion: intencion || 'none' });
    setStep('loading');
    setLoadingIdx(0);
    setResultado('');
    try {
      const res = await fetch('/api/astro', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nombre: nombreCap, fechaNacimiento, intencion }),
      });
      const data = await res.json();
      setResultado(data.resultado);
      setSignoInfo(data.signo || '');
      setStep('result');
      trackEvent('teaser_view', { signo: data.signo || 'unknown' });
      localStorage.setItem('mystora_es_last_test', Date.now().toString());
      localStorage.setItem('mystora_es_last_result', data.resultado);
      localStorage.setItem('mystora_es_last_nombre', nombreCap);
      localStorage.setItem('mystora_es_last_date', fechaNacimiento);
      localStorage.setItem('mystora_es_last_signo', data.signo || '');
      setBlocked(true);
    } catch {
      setStep('form');
    }
  };

  const handleEmailSubmit = async () => {
    if (!email.trim()) return;
    trackEvent('email_submit');
    setEmailSent(true);
    try {
      await fetch('/api/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim(), nombre }),
      });
    } catch {}
  };

  const handlePaiement = async () => {
    trackEvent('cta_click', { price: displayPrice });
    setPayLoading(true);
    try {
      const res = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nombre, fechaNacimiento, email: email.trim(), question: intencion }),
      });
      const data = await res.json();
      trackEvent('checkout_start');
      window.location.href = data.url;
    } catch {
      setPayLoading(false);
    }
  };

  const REPORT_SECTIONS = [
    { icon: '✦', label: 'Quién es usted realmente', detail: 'Su naturaleza profunda revelada' },
    { icon: '❤️', label: 'Amor y relaciones', detail: 'Lo que no se atreve a ver' },
    { icon: '💼', label: 'Carrera y dinero', detail: 'El bloqueo oculto por resolver' },
    { icon: '🔮', label: 'Sus fuerzas secretas', detail: 'Lo que su nombre revela' },
    { icon: '📅', label: 'Lo que le espera', detail: 'Los meses clave a vigilar' },
    { icon: '🔑', label: 'Su guía', detail: 'El consejo que estaba esperando' },
  ];

  return (
    <main className="min-h-screen bg-[#080613] relative overflow-hidden">
      {/* ===== FOND COSMIQUE ANIMÉ ===== */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Nébuleuses */}
        <div className="nebula nebula-1" />
        <div className="nebula nebula-2" />
        <div className="nebula nebula-3" />

        {/* Étoiles */}
        {STARS.map((s, i) => (
          <div
            key={`star-${i}`}
            className="star"
            style={{
              top: s.top,
              left: s.left,
              width: `${s.size}px`,
              height: `${s.size}px`,
              animationDuration: `${s.duration}s`,
              animationDelay: `${i * 0.3}s`,
              boxShadow: `0 0 ${s.size * 2}px ${s.size / 2}px rgba(255, 255, 255, 0.3)`,
            }}
          />
        ))}

        {/* Particules dorées */}
        {PARTICLES.map((p, i) => (
          <div
            key={`particle-${i}`}
            className="particle"
            style={{
              bottom: p.bottom,
              left: p.left,
              width: `${p.size}px`,
              height: `${p.size}px`,
              animationDuration: `${p.duration}s`,
              animationDelay: `${i * 2}s`,
            }}
          />
        ))}
      </div>

      <div className="relative z-10 flex flex-col items-center px-4 py-8 min-h-screen justify-center">

        {/* ===== FORM ===== */}
        {step === 'form' && (
          <>
            <div className="text-center mb-6">
              <p className="text-amber-400/80 text-lg mb-2">✦</p>
              <h1 className="text-4xl font-bold text-white tracking-tight">Un mensaje le espera</h1>
              <p className="text-shimmer text-base mt-2 font-medium">Descúbralo en 30 segundos</p>
            </div>

            <div className="bg-[#1A1747]/80 backdrop-blur-sm rounded-3xl p-7 w-full max-w-sm shadow-2xl border border-purple-500/10">
              <h2 className="text-white text-xl font-semibold text-center mb-1">Su perfil gratuito</h2>
              <p className="text-gray-400 text-sm text-center mb-5">Ingrese su nombre y fecha de nacimiento</p>
              <div className="flex flex-col gap-4">
                <input
                  type="text"
                  placeholder="Su nombre"
                  value={nombre}
                  onChange={(e) => setNombre(e.target.value)}
                  className="bg-[#0F0D2E] text-white placeholder-gray-400 rounded-xl px-4 py-3.5 outline-none border border-purple-700/40 focus:border-[#D4A574] transition-colors text-lg"
                  autoComplete="given-name"
                  autoFocus
                />
                <div className="flex flex-col gap-1">
                  <label className="text-gray-400 text-sm px-1">Fecha de nacimiento</label>
                  <div className="flex gap-2">
                    <input type="tel" inputMode="numeric" placeholder="DD" value={dia}
                      onChange={(e) => handleDia(e.target.value)}
                      className="bg-[#0F0D2E] text-white placeholder-gray-600 rounded-xl px-3 py-3.5 outline-none border border-purple-700/40 focus:border-[#D4A574] w-1/4 text-center text-lg font-semibold transition-colors" />
                    <input ref={mesRef} type="tel" inputMode="numeric" placeholder="MM" value={mes}
                      onChange={(e) => handleMes(e.target.value)}
                      className="bg-[#0F0D2E] text-white placeholder-gray-600 rounded-xl px-3 py-3.5 outline-none border border-purple-700/40 focus:border-[#D4A574] w-1/4 text-center text-lg font-semibold transition-colors" />
                    <input ref={anioRef} type="tel" inputMode="numeric" placeholder="AAAA" value={anio}
                      onChange={(e) => handleAnio(e.target.value)}
                      className="bg-[#0F0D2E] text-white placeholder-gray-600 rounded-xl px-3 py-3.5 outline-none border border-purple-700/40 focus:border-[#D4A574] w-2/4 text-center text-lg font-semibold transition-colors" />
                  </div>
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-gray-400 text-sm px-1">¿Qué le gustaría aclarar?</label>
                  <div className="grid grid-cols-2 gap-2">
                    {[
                      { value: 'amor', icon: '❤️', label: 'Amor' },
                      { value: 'carrera', icon: '💼', label: 'Carrera' },
                      { value: 'dinero', icon: '💰', label: 'Dinero' },
                      { value: 'bloqueo', icon: '🔓', label: 'Bloqueo' },
                    ].map((opt) => (
                      <button key={opt.value} type="button"
                        onClick={() => setIntencion(intencion === opt.value ? '' : opt.value)}
                        className={`flex items-center justify-center gap-1.5 py-2.5 rounded-xl text-sm font-medium transition-all border ${
                          intencion === opt.value
                            ? 'bg-purple-700/40 border-[#D4A574] text-white'
                            : 'bg-[#0F0D2E] border-purple-700/40 text-gray-400 hover:border-purple-500/60'
                        }`}>
                        <span>{opt.icon}</span>
                        <span>{opt.label}</span>
                      </button>
                    ))}
                  </div>
                  <p className="text-gray-500 text-xs px-1 mt-0.5">Opcional — personaliza su lectura</p>
                </div>
                <button onClick={handleSubmit}
                  disabled={!nombre || !fechaNacimiento || blocked}
                  className="btn-glow bg-gradient-to-r from-purple-700 to-purple-600 hover:from-purple-600 hover:to-purple-500 text-white font-bold py-4 rounded-xl transition-all duration-300 mt-1 disabled:opacity-60 text-lg shadow-lg shadow-purple-900/30">
                  {blocked ? '🔒 Lectura gratuita utilizada' : '✨ Revelar mi mensaje'}
                </button>
              </div>
            </div>

            {/* CTA payant quand test déjà utilisé */}
            {blocked && (
              <div className="bg-gradient-to-br from-purple-900/60 to-[#1A1747]/80 rounded-3xl p-6 border border-amber-400/20 mt-4 w-full max-w-sm">
                <h3 className="text-white text-center font-semibold text-lg mb-1">✨ Su mensaje completo está listo</h3>
                <p className="text-gray-300 text-sm text-center mb-4">
                  Quién es usted • Amor • Carrera • Fuerzas secretas • Lo que le espera • Su guía
                </p>
                <div className="text-center mb-3">
                  <span className="text-gray-400 line-through text-sm">{anchorPrice}</span>
                  <span className="text-amber-400 font-bold text-xl ml-2">{displayPrice}</span>
                  <span className="text-amber-300/70 text-xs ml-2">oferta de lanzamiento</span>
                </div>
                <button onClick={handlePaiement} disabled={payLoading || !nombre || !fechaNacimiento}
                  className="btn-amber-glow block w-full bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-black font-bold py-4 rounded-xl text-center text-lg transition-all duration-300 shadow-lg shadow-amber-900/30 disabled:opacity-50">
                  {payLoading ? '⏳ Redirigiendo...' : `Leer mi mensaje completo — ${displayPrice}`}
                </button>
                {(!nombre || !fechaNacimiento) && (
                  <p className="text-gray-400 text-xs text-center mt-2">Ingrese su nombre y fecha arriba</p>
                )}
                <div className="flex items-center justify-center gap-4 mt-3 text-gray-400 text-xs">
                  <span>🔒 Pago seguro</span>
                  <span>⚡ Resultado instantáneo</span>
                </div>
              </div>
            )}

            {/* Mini preuve sociale */}
            <div className="mt-6 flex items-center gap-2 text-gray-400 text-sm">
              <div className="flex -space-x-2">
                <div className="w-7 h-7 rounded-full bg-purple-700 flex items-center justify-center text-xs text-white border-2 border-[#080613]">S</div>
                <div className="w-7 h-7 rounded-full bg-amber-600 flex items-center justify-center text-xs text-white border-2 border-[#080613]">K</div>
                <div className="w-7 h-7 rounded-full bg-purple-500 flex items-center justify-center text-xs text-white border-2 border-[#080613]">F</div>
              </div>
              <span>+2.400 perfiles generados este mes</span>
            </div>
          </>
        )}

        {/* ===== LOADING ===== */}
        {step === 'loading' && (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="relative mb-8">
              <div className="w-24 h-24 rounded-full bg-gradient-to-br from-purple-500 to-amber-400 opacity-20 animate-ping absolute inset-0" />
              <div className="w-24 h-24 rounded-full bg-gradient-to-br from-purple-600 to-amber-500 opacity-40 animate-pulse relative flex items-center justify-center">
                <span className="text-4xl">🔮</span>
              </div>
            </div>
            <p className="text-purple-200 text-lg font-medium animate-pulse">{LOADING_MESSAGES[loadingIdx]}</p>
            <p className="text-gray-500 text-sm mt-2">{nombre}, los astros se alinean para usted...</p>
            <div className="flex gap-2 mt-6">
              {[0,1,2,3,4].map(i => (
                <div key={i} className={`w-2 h-2 rounded-full transition-all duration-500 ${i <= loadingIdx ? 'bg-amber-400' : 'bg-gray-700'}`} />
              ))}
            </div>
          </div>
        )}

        {/* ===== RESULT ===== */}
        {step === 'result' && (
          <div ref={resultRef} className="w-full max-w-md">
            <div className="text-center mb-5">
              <p className="text-amber-400/80 text-lg mb-1">✦</p>
              <h1 className="text-3xl font-bold text-white">Mystora</h1>
            </div>

            {/* Resultado gratuito */}
            <div className="bg-[#1A1747]/80 backdrop-blur-sm rounded-3xl p-6 shadow-2xl border border-purple-500/10 mb-4">
              <div className="flex items-center gap-2 mb-3">
                <span className="text-xl">✨</span>
                <h2 className="text-white text-lg font-semibold">{nombre}, este es su mensaje</h2>
              </div>
              <div className="text-gray-200 text-[15px] leading-relaxed whitespace-pre-line">{resultado}</div>

              {/* Blurred content */}
              <div className="relative mt-4">
                <div className="text-gray-300 text-[15px] leading-relaxed blur-[6px] select-none pointer-events-none" aria-hidden="true">
                  <p className="mb-2">{nombre}, su perfil astral revela un período de transformación profunda que va a impactar sus relaciones y su carrera de manera inesperada. {signoInfo ? `Como ${signoInfo}, l` : 'L'}as alineaciones planetarias indican un giro importante en las próximas semanas.</p>
                  <p className="mb-2">En el amor, un encuentro o una toma de conciencia va a revolucionar su visión de las cosas. Su potencial inexplorado en materia financiera está a punto de manifestarse.</p>
                  <p>Este ciclo de renovación revela las fechas clave que debe vigilar absolutamente...</p>
                </div>
                <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#1A1747]/50 to-[#1A1747] flex items-end justify-center pb-2">
                  <p className="text-amber-200/80 text-sm font-medium">⬇️ El resto de su mensaje le espera</p>
                </div>
              </div>
            </div>

            {/* CTA Card */}
            <div className="bg-gradient-to-br from-purple-900/60 to-[#1A1747]/80 rounded-3xl p-6 border border-amber-400/20 mb-4">
              <h3 className="text-white text-center font-semibold text-lg mb-3">El resto de su mensaje contiene:</h3>
              
              <div className="grid grid-cols-2 gap-2 mb-4">
                {REPORT_SECTIONS.map((s, i) => (
                  <div key={i} className="bg-[#0F0D2E]/60 rounded-xl px-3 py-2.5 border border-purple-700/20">
                    <div className="flex items-center gap-1.5">
                      <span className="text-base">{s.icon}</span>
                      <span className="text-white text-sm font-medium">{s.label}</span>
                    </div>
                    <p className="text-gray-400 text-xs mt-0.5 pl-6">{s.detail}</p>
                  </div>
                ))}
              </div>

              <div className="text-center mb-3">
                <span className="text-gray-400 line-through text-sm">{anchorPrice}</span>
                <span className="text-amber-400 font-bold text-xl ml-2">{displayPrice}</span>
                <span className="text-amber-300/70 text-xs ml-2">oferta de lanzamiento</span>
              </div>

              <button onClick={handlePaiement} disabled={payLoading}
                className="btn-amber-glow block w-full bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-black font-bold py-4 rounded-xl text-center text-lg transition-all duration-300 shadow-lg shadow-amber-900/30 disabled:opacity-50">
                {payLoading ? '⏳ Redirigiendo...' : `Leer mi mensaje completo — ${displayPrice}`}
              </button>
              <div className="flex items-center justify-center gap-4 mt-3 text-gray-400 text-xs">
                <span>🔒 Pago seguro</span>
                <span>⚡ Resultado instantáneo</span>
                <span>📧 Envío por email</span>
              </div>
            </div>

            {/* Email capture */}
            {!emailSent ? (
              <div className="bg-[#1A1747]/60 rounded-2xl p-4 border border-purple-500/10">
                <p className="text-gray-400 text-sm text-center mb-3">¿Aún no está listo(a)? Reciba su mensaje por email</p>
                <div className="flex gap-2">
                  <input
                    type="email"
                    placeholder="Su email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="flex-1 bg-[#0F0D2E] text-white placeholder-gray-500 rounded-xl px-4 py-3 outline-none border border-purple-700/40 focus:border-[#D4A574] transition-colors text-sm"
                    autoComplete="email"
                  />
                  <button onClick={handleEmailSubmit}
                    disabled={!email.trim()}
                    className="bg-purple-700 hover:bg-purple-600 disabled:bg-gray-700 text-white font-semibold px-4 py-3 rounded-xl transition-colors text-sm disabled:opacity-50">
                    OK
                  </button>
                </div>
              </div>
            ) : (
              <div className="bg-[#1A1747]/60 rounded-2xl p-3 border border-purple-500/10 text-center">
                <p className="text-[#D4A574] text-sm">✅ ¡Anotado! Recibirá su mensaje en {email}</p>
              </div>
            )}

            {/* Avis clients */}
            <div className="mt-4 flex flex-col gap-3">
              <p className="text-gray-400 text-xs text-center">Lo que dicen nuestros usuarios</p>
              <div className="bg-[#1A1747]/60 rounded-2xl p-4 border border-purple-500/10">
                <div className="flex items-center gap-2 mb-1.5">
                  <span className="text-amber-400 text-sm">★★★★★</span>
                  <span className="text-white text-sm font-medium">Sara M.</span>
                </div>
                <p className="text-gray-300 text-sm leading-relaxed">&quot;Sentí escalofríos al leer mi mensaje. Describió exactamente lo que estoy viviendo.&quot;</p>
              </div>
              <div className="bg-[#1A1747]/60 rounded-2xl p-4 border border-purple-500/10">
                <div className="flex items-center gap-2 mb-1.5">
                  <span className="text-amber-400 text-sm">★★★★★</span>
                  <span className="text-white text-sm font-medium">Karim L.</span>
                </div>
                <p className="text-gray-300 text-sm leading-relaxed">&quot;Al principio pensé que era mentira, pero cuando leí la parte sobre mi carrera... todo encaja.&quot;</p>
              </div>
              <div className="bg-[#1A1747]/60 rounded-2xl p-4 border border-purple-500/10">
                <div className="flex items-center gap-2 mb-1.5">
                  <span className="text-amber-400 text-sm">★★★★★</span>
                  <span className="text-white text-sm font-medium">Fatou D.</span>
                </div>
                <p className="text-gray-300 text-sm leading-relaxed">&quot;{displayPrice} por un mensaje tan personal es un regalo. Me han cobrado 50€ por algo menos preciso.&quot;</p>
              </div>
            </div>

            <button onClick={() => { setStep('form'); setResultado(''); }}
              className="w-full text-gray-500 text-sm mt-4 py-2 hover:text-gray-300 transition-colors text-center">
              ← Nuevo mensaje
            </button>
          </div>
        )}

        <p className="text-gray-600 text-xs mt-8">Contenido de entretenimiento — mystora.es · <a href="/legal" className="underline hover:text-gray-400 transition-colors">Aviso legal</a></p>
      </div>
    </main>
  );
}
