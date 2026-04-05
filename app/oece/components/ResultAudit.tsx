'use client'; // CRÍTICO para Next.js

import React from 'react';

// Asegúrate de que diga "export const ResultAudit"
export const ResultAudit = ({ data }: { data: any }) => {
  if (!data) return null;

  const { puntajeTotal, logroPorCompetencia, mapaErrores, nivel } = data;

  return (
    <div className="max-w-3xl mx-auto my-10 bg-white p-8 rounded-2xl shadow-xl border border-gray-100 font-sans">
      {/* VÉRTICE: Estatus de Certificación */}
      <div className="text-center mb-8 border-b pb-6">
        <h2 className="text-sm font-black text-blue-500 uppercase tracking-widest mb-2">Resultado Oficial SICAN Mirror</h2>
        <div className="text-5xl font-black text-slate-900 mb-1">{puntajeTotal} <span className="text-xl text-slate-400">/ 72</span></div>
        <div className={`inline-block px-4 py-1 rounded-full text-sm font-bold ${nivel === 'NO APTO' ? 'bg-red-100 text-red-700' : 'bg-emerald-100 text-emerald-700'}`}>
          NIVEL ALCANZADO: {nivel}
        </div>
        <p className="text-[10px] text-gray-400 mt-4 uppercase">* Los resultados del examen son inapelables</p>
      </div>

      {/* CUERPO: Logro por Subcompetencia */}
      <div className="space-y-6 mb-10">
        <h3 className="font-bold text-slate-700 flex justify-between items-center text-sm">
          ANÁLISIS POR COMPETENCIAS
          <span className="text-[10px] font-normal text-slate-400 uppercase">Basado en Temario 2026</span>
        </h3>
        
        {[
          { id: 'C1', label: 'Actuaciones Preparatorias', val: logroPorCompetencia?.C1 || 0, max: 25 },
          { id: 'C2', label: 'Métodos de Selección', val: logroPorCompetencia?.C2 || 0, max: 22 },
          { id: 'C3', label: 'Ejecución Contractual', val: logroPorCompetencia?.C3 || 0, max: 25 }
        ].map(comp => (
          <div key={comp.id}>
            <div className="flex justify-between text-xs mb-2">
              <span className="font-semibold text-slate-600">{comp.label}</span>
              <span className="font-mono">{Math.round((comp.val / comp.max) * 100)}%</span>
            </div>
            <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
              <div 
                className="h-full bg-blue-600 transition-all duration-1000 ease-out"
                style={{ width: `${(comp.val / comp.max) * 100}%` }}
              />
            </div>
          </div>
        ))}
      </div>

      {/* BASE: Teasers de Riesgo (Up-sell a ÉLITE) */}
      <div className="bg-slate-900 rounded-xl p-6 text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 bg-blue-600 px-3 py-1 text-[10px] font-bold">NEXUM AI DETECTED</div>
        
        <h4 className="text-blue-400 font-bold mb-4 uppercase text-xs tracking-wider">Hallazgos de Riesgo Administrativo</h4>
        
        <div className="space-y-4">
          {mapaErrores?.E2 > 0 && (
            <div className="border-l-2 border-amber-500 pl-4 py-1">
              <p className="text-sm font-bold text-amber-500">Alerta de Arraigo Normativo (E2)</p>
              <p className="text-[11px] text-slate-400">Se detectó lógica basada en la Ley 30225. Riesgo de observación en auditoría.</p>
            </div>
          )}

          {mapaErrores?.E4 > 0 && (
            <div className="border-l-2 border-red-500 pl-4 py-1">
              <p className="text-sm font-bold text-red-500">Riesgo de Responsabilidad (E4)</p>
              <p className="text-[11px] text-slate-400">Errores que generan nulidad de oficio. Requiere mitigación legal inmediata.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};