'use client';
import React, { useState, useEffect } from 'react';
import { PreguntaOECE } from '../types';

interface QuizEngineProps {
  preguntas: PreguntaOECE[];
  onFinalizar: (respuestas: Record<number, string>) => void;
  tiempoInicial: number; // 🔹 ADMISIÓN PAI: Habilita el control desde el simulador
}

export const QuizEngine: React.FC<QuizEngineProps> = ({ preguntas, onFinalizar, tiempoInicial }) => {
  const [indiceActual, setIndiceActual] = useState(0);
  const [respuestas, setRespuestas] = useState<Record<number, string>>({});
  
  // 🔹 PERSISTENCIA NEXUM: Recuperar tiempo guardado o iniciar con el oficial (7200)
  const [tiempoRestante, setTiempoRestante] = useState(() => {
    if (typeof window !== 'undefined') {
      const guardado = localStorage.getItem('nexum_timer');
      return guardado ? parseInt(guardado) : tiempoInicial;
    }
    return tiempoInicial;
  });

  // 🔹 CRONÓMETRO DE AUDITORÍA CON REGISTRO EN LOCALSTORAGE
  useEffect(() => {
    const timer = setInterval(() => {
      setTiempoRestante((prev) => {
        const nuevoTiempo = prev > 0 ? prev - 1 : 0;
        localStorage.setItem('nexum_timer', nuevoTiempo.toString());
        return nuevoTiempo;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // 🔹 PERSISTENCIA DE RESPUESTAS: Evita perder el avance al refrescar
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const guardado = localStorage.getItem('nexum_respuestas');
      if (guardado) setRespuestas(JSON.parse(guardado));
    }
  }, []);

  const handleSeleccion = (opcionId: string) => {
    const nuevasRespuestas = { ...respuestas, [indiceActual]: opcionId };
    setRespuestas(nuevasRespuestas);
    localStorage.setItem('nexum_respuestas', JSON.stringify(nuevasRespuestas));
  };

  const handleSiguiente = () => {
    if (indiceActual < preguntas.length - 1) setIndiceActual(indiceActual + 1);
  };

  const handleAnterior = () => {
    if (indiceActual > 0) setIndiceActual(indiceActual - 1);
  };

  // 🔹 FORMATO HH:MM:SS (Solicitado en Auditoría)
  const formatTime = (seconds: number) => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

// 🔹 Primero definimos quién es la pregunta actual
const pregunta = preguntas[indiceActual];

// 🔹 Luego verificamos si existe para evitar el crash del render
if (!pregunta) return <div className="p-10 text-center text-slate-500 font-mono">CARGANDO BANCO DE DATOS NEXUM...</div>;

  return (
    <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-slate-200">
      <div className="bg-slate-900 p-6 flex justify-between items-center text-white">
        <div>
          <span className="text-[10px] font-bold text-blue-400 uppercase tracking-widest block">Progreso</span>
          <span className="text-xl font-black">{indiceActual + 1} <span className="text-slate-500 text-sm">/ {preguntas.length}</span></span>
        </div>
        <div className="text-right">
          <span className="text-[10px] font-bold text-red-400 uppercase tracking-widest block">Tiempo Restante</span>
          <span className="text-xl font-mono font-bold">{formatTime(tiempoRestante)}</span>
        </div>
      </div>

      <div className="p-8">
        <div className="mb-8">
          <span className="inline-block px-3 py-1 bg-slate-100 text-slate-500 text-[10px] font-bold rounded-md mb-3 uppercase tracking-tighter">
            Competencia: {pregunta.competencia}
          </span>
          <h3 className="text-xl font-bold text-slate-800 leading-tight">
            {pregunta.enunciado}
          </h3>
        </div>

        <div className="space-y-3">
          {pregunta.opciones.map((opcion) => (
            <button
              key={opcion.id}
              onClick={() => handleSeleccion(opcion.id)}
              className={`w-full p-4 text-left rounded-xl border-2 transition-all flex items-center gap-4 ${
                respuestas[indiceActual] === opcion.id
                  ? 'border-blue-600 bg-blue-50 text-blue-800'
                  : 'border-slate-100 hover:border-slate-300 text-slate-600'
              }`}
            >
              <span className={`w-8 h-8 flex items-center justify-center rounded-full font-bold text-sm uppercase ${
                respuestas[indiceActual] === opcion.id ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-400'
              }`}>
                {opcion.id}
              </span>
              <span className="font-medium">{opcion.texto}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="p-6 bg-slate-50 border-t flex justify-between items-center">
        <button 
          onClick={handleAnterior}
          disabled={indiceActual === 0}
          className="px-6 py-2 text-slate-400 font-bold disabled:opacity-30 uppercase text-xs"
        >
          Anterior
        </button>

        {indiceActual === preguntas.length - 1 ? (
          <button
            onClick={() => {
              localStorage.removeItem('nexum_timer'); // Limpieza Post-Auditoría
              localStorage.removeItem('nexum_respuestas');
              onFinalizar(respuestas);
            }}
            className="bg-green-600 hover:bg-green-700 text-white px-10 py-3 rounded-xl font-black shadow-lg transition-all"
          >
            TERMINAR EXAMEN
          </button>
        ) : (
          <button
            onClick={handleSiguiente}
            className="bg-slate-800 hover:bg-black text-white px-10 py-3 rounded-xl font-bold transition-all uppercase text-xs"
          >
            Siguiente
          </button>
        )}
      </div>
    </div>
  );
};