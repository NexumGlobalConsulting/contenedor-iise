// oece/components/ResultAudit.tsx
import React from 'react';

export const ResultAudit = ({ data }: { data: any }) => {
  const { puntajeTotal, logroPorCompetencia, mapaErrores, nivel } = data;

  return (
    <div className="max-w-3xl mx-auto my-10 bg-white p-8 rounded-2xl shadow-xl border border-gray-100">
      {/* VÉRTICE: Estatus de Certificación */}
      <div className="text-center mb-8 border-b pb-6">
        <h2 className="text-sm font-black text-blue-500 uppercase tracking-widest mb-2">Resultado Oficial SICAN Mirror</h2>
        <div className="text-5xl font-black text-slate-900 mb-1">{puntajeTotal} <span className="text-xl text-slate-400">/ 72</span></div>
        <div className={`inline-block px-4 py-1 rounded-full text-sm font-bold ${nivel === 'NO APTO' ? 'bg-red-100 text-red-700' : 'bg-emerald-100 text-emerald-700'}`}>
          NIVEL ALCANZADO: {nivel}
        </div>
        <p className="text-[10px] text-gray-400 mt-4 uppercase">* Los resultados del examen son inapelables </p>
      </div>

      {/* CUERPO: Logro por Subcompetencia (Requerimiento OECE)  */}
      <div className="space-y-6 mb-10">
        <h3 className="font-bold text-slate-700 flex justify-between items-center">
          ANÁLISIS POR COMPETENCIAS
          <span className="text-xs font-normal text-slate-400">Basado en Temario 2026</span>
        </h3>
        
        {[
          { id: 'C1', label: 'Actuaciones Preparatorias', val: logroPorCompetencia.C1, max: 25 },
          { id: 'C2', label: 'Métodos de Selección', val: logroPorCompetencia.C2, max: 22 },
          { id: 'C3', label: 'Ejecución Contractual', val: logroPorCompetencia.C3, max: 25 }
        ].map(comp => (
          <div key={comp.id} className="group">
            <div className="flex justify-between text-sm mb-2">
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
          {/* Teaser de Arraigo (E2) */}
          {mapaErrores.E2 > 2 && (
            <div className="border-l-2 border-amber-500 pl-4 py-1">
              <p className="text-sm font-bold text-amber-500">Alerta de Arraigo Normativo (E2)</p>
              <p className="text-xs text-slate-400">Tu lógica persiste en conceptos de la Ley 30225. Esto invalidaría tus procesos ante el SEACE.</p>
            </div>
          )}

          {/* Teaser Estratégico (E4) */}
          {mapaErrores.E4 > 0 && (
            <div className="border-l-2 border-red-500 pl-4 py-1">
              <p className="text-sm font-bold text-red-500">Riesgo de Responsabilidad (E4)</p>
              <p className="text-xs text-slate-400">Se detectaron errores que generan nulidad de oficio. Solo el informe ÉLITE detalla la mitigación legal.</p>
            </div>
          )}
        </div>

        <button className="w-full mt-6 bg-blue-600 hover:bg-blue-500 py-3 rounded-lg font-black text-sm transition-colors shadow-lg">
          DESBLOQUEAR ANÁLISIS ESTRATÉGICO ÉLITE
        </button>
      </div>
    </div>
  );
};