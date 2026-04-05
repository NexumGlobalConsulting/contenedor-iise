'use client';
import React, { useState, useEffect } from 'react';
import { PreguntaOECE } from '../types';

interface QuizEngineProps {
  preguntas: PreguntaOECE[];
  onFinalizar: (respuestas: Record<number, string>) => void;
  tiempoInicial: number;
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

  // 🔹 CRONÓMETRO DE AUDITORÍA
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

  // 🔹 PERSISTENCIA DE RESPUESTAS
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

  // 🔹 FORMATO HH:MM:SS
  const formatTime = (seconds: number) => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  // 🔹 MAPEO LEGAL PAI (Elimina códigos numéricos)
  const getNombreFase = (idOrName: string) => {
    const fases: Record<string, string> = {
      "1": "Actuaciones Preparatorias",
      "2": "Fase de Selección",
      "3": "Ejecución Contractual"
    };
    return fases[idOrName] || idOrName; 
  };

  // 🔹 CORRECCIÓN DE SINTAXIS (Evita error 2448)
  const pregunta = preguntas[indiceActual];
  if (!pregunta) return <div className="p-10 text-center font-mono text-slate-500">Cargando Banco de Datos NEXUM...</div>;

  return (
    <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-slate-200">
      {/* HEADER */}
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

      {/* CUERPO DE PREGUNTA */}
      <div className="p-8">
        
        {/* PANEL DE NAVEGACIÓN LIBRE NEXUM */}
        <div className="flex flex-wrap gap-2 mb-8 p-3 bg-slate-50 rounded-xl border border-slate-100">
          {preguntas.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setIndiceActual(idx)}
              className={`w-10 h-10 rounded-lg text-xs font-black transition-all ${
                idx === indiceActual 
                  ? 'bg-blue-600 text-white shadow-md scale-105' 
                  : respuestas[idx] 
                    ? 'bg-slate-800 text-white' 
                    : 'bg-white text-slate-400 border-2 border-slate-200 hover:border-slate-300'
              }`}
            >
              {idx + 1}
            </button>
          ))}
        </div>

        <div className="mb-8">
          <span className="inline-block px-3 py-1 bg-slate-100 text-slate-500 text-[10px] font-bold rounded-md mb-3 uppercase tracking-tighter">
            Competencia: {getNombreFase(pregunta.competencia)}
          </span>
          <h3 className="text-xl font-bold text-slate-800 leading-tight">
            {pregunta.enunciado} {/* 🔹 RESTAURADO: Usamos el estándar de la interfaz */}
          </h3>
        </div>

        <div className="space-y-3">
          {/* 🔹 RESTAURADO: Usamos el array mapeado desde page.tsx */}
          {pregunta.opciones.map((opcion: any) => (
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

      {/* NAVEGACIÓN INFERIOR Y CIERRE DE CICLO */}
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
              // Limpieza estricta PAI y activación de diagnóstico AI
              localStorage.removeItem('nexum_timer');
              localStorage.removeItem('nexum_respuestas');
              localStorage.removeItem('nexum_etapa');
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