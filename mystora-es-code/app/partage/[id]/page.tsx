'use client';
import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';

export default function Partage() {
  const params = useParams();
  const id = params.id as string;
  const [nombre, setNombre] = useState('');
  const [rapport, setRapport] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    if (id) {
      fetch(`/api/partage/${id}`)
        .then((res) => res.json())
        .then((data) => {
          if (data.rapport) {
            setNombre(data.nombre || data.prenom);
            setRapport(data.rapport);
          } else {
            setError(true);
          }
          setLoading(false);
        })
        .catch(() => {
          setError(true);
          setLoading(false);
        });
    }
  }, [id]);

  const btnStyle = { backgroundColor: '#D4A574', color: '#1E1B4B' };

  return (
    <main className="min-h-screen bg-[#1E1B4B] flex flex-col items-center px-4 py-12">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold text-white mb-2">🔮 Mystora</h1>
        {nombre && <p className="text-[#D4A574] text-lg">El perfil astrológico de {nombre}</p>}
      </div>

      <div className="bg-[#2D2A6E] rounded-2xl p-8 w-full max-w-2xl shadow-xl">
        {loading ? (
          <div className="text-center py-12">
            <p className="text-[#D4A574] text-xl animate-pulse">✨ Cargando perfil...</p>
          </div>
        ) : error ? (
          <p className="text-white text-center">Este perfil ya no existe.</p>
        ) : (
          <div className="text-white leading-relaxed whitespace-pre-wrap">{rapport}</div>
        )}
      </div>

      <div className="mt-8 w-full max-w-2xl bg-[#3D1A6E] rounded-2xl p-8 border border-[#D4A574] text-center">
        <p className="text-[#D4A574] text-2xl font-bold mb-2">🔮 ¿Y usted?</p>
        <p className="text-white mb-6">Descubra lo que los astros dicen de usted gratuitamente</p>
        <a href="/" style={btnStyle} className="font-bold py-4 px-8 rounded-xl text-lg inline-block">
          ✨ Descubrir mi perfil gratuito
        </a>
      </div>

      <p className="text-gray-500 text-sm mt-6">Entretenimiento</p>
    </main>
  );
}
