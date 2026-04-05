'use client';
import { useState, useEffect } from 'react';
import { AnalyticsEngine } from '../../lib/AnalyticsEngine';
import { ReportGenerator } from '../../lib/ReportGenerator';
import { evaluarRespuesta } from '../../lib/evaluador';
import DashboardButton from '../../components/DashboardButton';
import { QuizEngine } from '../oece/components/QuizEngine';
import { ResultAudit } from '../oece/components/ResultAudit';
import { procesarResultadosNEXUM } from '../oece/lib/audit';
import preguntasNEXUM from '../oece/preguntas.json';

export const dynamic = 'force-dynamic';

// 1. CONFIGURACIÓN TÉCNICA (PAI)
const TIEMPO_OFICIAL = 7200; // 120 minutos en segundos
const CANTIDAD_MUESTRA = 10;
const isDevelopment = process.env.NODE_ENV === 'development';

// 2. ADAPTADOR DE DATOS CON ETIQUETAS FIJAS (A,B,C,D)
const shuffle = (array: any[]) => {
  const newArray = [...array];
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
  }
  return newArray;
};

const getNombreFase = (id: string) => {
  const fases: Record<string, string> = {
    "1": "Actuaciones Preparatorias",
    "2": "Fase de Selección",
    "3": "Ejecución Contractual"
  };
  return fases[id] || "Gestión de Contrataciones";
};

const preguntasOECE = shuffle(
  (preguntasNEXUM as any).map((p: any, i: number) => ({
    id: i,
    temaId: parseInt(p.competencia_id) || 1,
    competencia: getNombreFase(p.competencia_id),
    enunciado: p.pregunta,
    opciones: shuffle([
      { texto: p.alternativas.a, tipoError: p.id_error_mapa.a },
      { texto: p.alternativas.b, tipoError: p.id_error_mapa.b },
      { texto: p.alternativas.c, tipoError: p.id_error_mapa.c },
      { texto: p.alternativas.d, tipoError: p.id_error_mapa.d }
    ]).map((opt, idx) => ({
      id: ['a', 'b', 'c', 'd'][idx], // Etiqueta fija A, B, C, D
      ...opt
    })),
    respuestaCorrectaId: p.respuesta_correcta.toLowerCase()
  }))
).slice(0, CANTIDAD_MUESTRA);

export default function SimuladorPage() {
  const [etapa, setEtapa] = useState<'TOKEN' | 'EXAMEN' | 'RESULTADO'>('TOKEN');
  const [token, setToken] = useState('');
  const [resultadoOece, setResultadoOece] = useState<any>(null);
  const [resultadoNexum, setResultadoNexum] = useState<any>(null);

  // PERSISTENCIA: Recuperar estado al cargar
  useEffect(() => {
    const savedEtapa = localStorage.getItem('nexum_etapa');
    if (savedEtapa === 'EXAMEN') setEtapa('EXAMEN');
  }, []);

  const handleIniciar = () => {
    if (token.trim().length === 4) { // Validación de 4 dígitos
      localStorage.setItem('nexum_etapa', 'EXAMEN');
      setEtapa('EXAMEN');
    } else {
      alert("El token debe ser de 4 dígitos numéricos.");
    }
  };

  const handleFinalizarExamen = (payload: any) => {
    try {
      const data = payload.respuestas ? payload.respuestas : payload;
      const resOece = procesarResultadosNEXUM(preguntasOECE, data);
      setResultadoOece(resOece);

      const evaluadas = preguntasOECE.map((p, i) => evaluarRespuesta(p as any, (data[i] || 'a')));
      const diagnostico = AnalyticsEngine.calcularDiagnostico(evaluadas);
      setResultadoNexum(ReportGenerator.generarInforme(diagnostico));

      localStorage.removeItem('nexum_etapa'); // Limpiar al finalizar
      setEtapa('RESULTADO');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (err) {
      console.error("Error en procesamiento PAI:", err);
    }
  };

  if (etapa === 'TOKEN') return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-slate-50 p-6">
      <div className="bg-white p-8 rounded-2xl shadow-xl max-w-md w-full border border-slate-100">
        <div className="flex justify-start mb-4">{isDevelopment && <DashboardButton />}</div>
        <div className="text-center mb-8">
          <h2 className="text-2xl font-black text-slate-800 tracking-tight">ACCESO SISTEMA</h2>
          <p className="text-slate-400 text-[10px] mt-1 uppercase tracking-[0.2em] font-bold">Plataforma de Evaluación</p>
        </div>
        <input 
          type="text" 
          maxLength={4}
          value={token} 
          onChange={(e) => setToken(e.target.value.replace(/\D/g, ''))} 
          className="w-full p-4 text-center text-3xl font-mono border-2 border-slate-200 rounded-xl mb-6 outline-none focus:border-blue-500" 
          placeholder="0000" 
        />
        <button onClick={handleIniciar} className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 rounded-xl shadow-lg transform active:scale-95 transition-all">COMENZAR EVALUACIÓN</button>
      </div>
      <div className="max-w-md w-full mt-8 p-4 bg-slate-100 rounded-lg border border-slate-200">
        <p className="text-[10px] text-slate-600 leading-relaxed text-justify">
          <span className="font-bold text-slate-800">AVISO LEGAL:</span> Este entorno es propiedad exclusiva de <span className="font-bold">Nexum Global Consulting S.A.C.</span> Queda prohibida la reproducción parcial o total, captura de datos o ingeniería inversa bajo sanción penal según el D.L. 822 (Ley sobre el Derecho de Autor).
        </p>
      </div>
    </div>
  );

  if (etapa === 'EXAMEN') return (
    <div className="min-h-screen bg-slate-50">
      <QuizEngine 
        preguntas={preguntasOECE} 
        onFinalizar={handleFinalizarExamen}
        tiempoInicial={TIEMPO_OFICIAL} 
      />
      {isDevelopment && <div className="fixed top-4 right-4"><DashboardButton /></div>}
    </div>
  );

  if (etapa === 'RESULTADO') return (
    <div className="min-h-screen bg-white p-6 md:p-12 max-w-4xl mx-auto">
      <header className="flex justify-between items-center mb-10 border-b pb-6">
        {isDevelopment && <DashboardButton />}
        <h1 className="text-2xl font-black text-slate-900 tracking-tighter">RESULTADOS DE AUDITORÍA</h1>
      </header>
      <ResultAudit data={resultadoOece} />
      <section className="mt-12 p-8 bg-slate-900 rounded-3xl text-white shadow-2xl relative">
        <div className="absolute top-0 right-0 p-4 bg-blue-600 text-[10px] font-bold">NEXUM ELITE AI</div>
        <div className="grid md:grid-cols-2 gap-8">
          <div>
            <p className="text-slate-400 text-xs uppercase font-bold">Nivel de Riesgo</p>
            <div className="text-3xl font-black">{resultadoNexum?.nivelRiesgo || 'No Calculado'}</div>
          </div>
          <div className="border-l border-slate-700 pl-8">
            <p className="text-slate-400 text-xs uppercase font-bold">Prescripción Preventiva</p>
            <div className="text-sm italic text-slate-300">"{resultadoNexum?.prescripcion || 'En proceso...'}"</div>
          </div>
        </div>
      </section>
      <button onClick={() => { localStorage.clear(); window.location.reload(); }} className="w-full mt-12 py-4 border-2 border-slate-200 text-slate-400 font-bold rounded-xl hover:bg-slate-50">FINALIZAR SESIÓN Y SALIR</button>
    </div>
  );

  return null;
}