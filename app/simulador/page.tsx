'use client';
import { useState } from 'react';
import { AnalyticsEngine } from '../../lib/AnalyticsEngine';
import { ReportGenerator } from '../../lib/ReportGenerator';
import { evaluarRespuesta } from '../../lib/evaluador';
import DashboardButton from '../../components/DashboardButton';
import { QuizEngine } from '../oece/components/QuizEngine';
import { ResultAudit } from '../oece/components/ResultAudit';
import { procesarResultadosNEXUM } from '../oece/lib/audit';
import preguntasNEXUM from '../oece/preguntas.json';
export const dynamic = 'force-dynamic';

const CANTIDAD_MUESTRA = 10;
const isDevelopment = process.env.NODE_ENV === 'development';

const shuffle = (array: any[]) => {
  const newArray = [...array];
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
  }
  return newArray;
};

// VARIABLE MAESTRA ÚNICA
const preguntasOECE = shuffle(
  (preguntasNEXUM as any).map((p: any, i: number) => ({
    id: i,
    temaId: parseInt(p.competencia_id) || 1,
    competencia: p.tema_ref || "General",
    enunciado: p.pregunta,
    opciones: shuffle([
      { id: 'a', texto: p.alternativas.a, tipoError: p.id_error_mapa.a },
      { id: 'b', texto: p.alternativas.b, tipoError: p.id_error_mapa.b },
      { id: 'c', texto: p.alternativas.c, tipoError: p.id_error_mapa.c },
      { id: 'd', texto: p.alternativas.d, tipoError: p.id_error_mapa.d }
    ]),
    respuestaCorrectaId: p.respuesta_correcta.toLowerCase()
  }))
).slice(0, CANTIDAD_MUESTRA);

export default function SimuladorPage() {
  const [etapa, setEtapa] = useState<'TOKEN' | 'EXAMEN' | 'RESULTADO'>('TOKEN');
  const [token, setToken] = useState('');
  const [resultadoOece, setResultadoOece] = useState<any>(null);
  const [resultadoNexum, setResultadoNexum] = useState<any>(null);

  const handleIniciar = () => { if (token.trim().length > 0) setEtapa('EXAMEN'); };

  const handleFinalizarExamen = (payload: any) => {
    try {
      const data = payload.respuestas ? payload.respuestas : payload;
      const resOece = procesarResultadosNEXUM(preguntasOECE, data);
      setResultadoOece(resOece);

      const evaluadas = preguntasOECE.map((p, i) => evaluarRespuesta(p as any, (data[i] || 'a')));
      const diagnostico = AnalyticsEngine.calcularDiagnostico(evaluadas);
      setResultadoNexum(ReportGenerator.generarInforme(diagnostico));

      setEtapa('RESULTADO');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (err) { console.error(err); }
  };

  if (etapa === 'TOKEN') return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-slate-50 p-6">
      <div className="bg-white p-8 rounded-2xl shadow-xl max-w-md w-full border border-slate-100">
        <div className="flex justify-start mb-4">{isDevelopment && <DashboardButton />}</div>
        <div className="text-center mb-8">
          <h2 className="text-2xl font-black text-slate-800 tracking-tight">ACCESO SICAN</h2>
          <p className="text-slate-400 text-xs mt-1 uppercase tracking-widest font-bold">Consultoría de Élite</p>
        </div>
        <input type="text" value={token} onChange={(e) => setToken(e.target.value)} className="w-full p-4 text-center text-3xl font-mono border-2 border-slate-200 rounded-xl mb-6" placeholder="000000" />
        <button onClick={handleIniciar} className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 rounded-xl shadow-lg transform active:scale-95 transition-all">COMENZAR EVALUACIÓN</button>
      </div>
      <div className="max-w-md w-full mt-6 text-[11px] text-slate-500 text-justify">
        <p><span className="text-slate-700 font-bold">AVISO LEGAL:</span> Propiedad de <span className="text-slate-800 font-extrabold">Nexum Global Consulting S.A.C.</span> Prohibida su reproducción. Protegido ante INDECOPI.</p>
      </div>
    </div>
  );

  if (etapa === 'EXAMEN') return (
    <div className="min-h-screen bg-slate-50">
      <QuizEngine preguntas={preguntasOECE} onFinalizar={handleFinalizarExamen} />
      {isDevelopment && <div className="fixed top-4 right-4"><DashboardButton /></div>}
    </div>
  );

  if (etapa === 'RESULTADO') return (
    <div className="min-h-screen bg-white p-6 md:p-12 max-w-4xl mx-auto">
      <header className="flex justify-between items-center mb-10 border-b pb-6">
        {isDevelopment && <DashboardButton />}
        <h1 className="text-2xl font-black text-slate-900 tracking-tighter">RESULTADOS</h1>
      </header>
      <ResultAudit data={resultadoOece} />
      <section className="mt-12 p-8 bg-slate-900 rounded-3xl text-white shadow-2xl relative">
        <div className="absolute top-0 right-0 p-4 bg-blue-600 text-[10px] font-bold">NEXUM ELITE AI</div>
        <div className="grid md:grid-cols-2 gap-8">
          <div><p className="text-slate-400 text-xs uppercase font-bold">Riesgo</p><div className="text-3xl font-black">{resultadoNexum?.nivelRiesgo}</div></div>
          <div className="border-l border-slate-700 pl-8"><p className="text-slate-400 text-xs uppercase font-bold">Prescripción</p><div className="text-sm italic text-slate-300">"{resultadoNexum?.prescripcion}"</div></div>
        </div>
      </section>
      <button onClick={() => window.location.reload()} className="w-full mt-12 py-4 border-2 border-slate-200 text-slate-400 font-bold rounded-xl hover:bg-slate-50">FINALIZAR Y SALIR</button>
    </div>
  );
  return null;
}