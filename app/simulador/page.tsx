'use client';
import { useState, useEffect } from 'react';
import { AnalyticsEngine } from '../../lib/AnalyticsEngine';
import { ReportGenerator } from '../../lib/ReportGenerator';
import { evaluarRespuesta } from '../../lib/evaluador';
import DashboardButton from '../../components/DashboardButton';

// 🔹 IMPORTACIÓN ÚNICA (Consolidada)
import { QuizEngine } from '../oece/components/QuizEngine';
import { ResultAudit } from '../oece/components/ResultAudit';
import { procesarResultadosNEXUM } from '../oece/lib/audit';
import { PreguntaOECE, TipoError } from '../oece/types';
import preguntasNEXUM from '../oece/preguntas.json';

// 🔹 ADAPTADOR MAESTRO NEXUM
const preguntasOECE: PreguntaOECE[] = (preguntasNEXUM as any).map((p: any, i: number) => ({
  id: i,
  temaId: parseInt(p.competencia_id) || 1,
  competencia: p.tema_ref || "General",
  enunciado: p.pregunta,
  opciones: [
    { id: 'a', texto: p.alternativas.a, tipoError: (p.id_error_mapa.a) as TipoError },
    { id: 'b', texto: p.alternativas.b, tipoError: (p.id_error_mapa.b) as TipoError },
    { id: 'c', texto: p.alternativas.c, tipoError: (p.id_error_mapa.c) as TipoError },
    { id: 'd', texto: p.alternativas.d, tipoError: (p.id_error_mapa.d) as TipoError }
  ],
  respuestaCorrectaId: p.respuesta_correcta.toLowerCase()
}));

const preguntasBase = preguntasOECE;

export default function SimuladorPage() {
  const [etapa, setEtapa] = useState<'TOKEN' | 'EXAMEN' | 'RESULTADO'>('TOKEN');
  const [token, setToken] = useState('');
  const [resultadoOece, setResultadoOece] = useState<any>(null);
  const [resultadoNexum, setResultadoNexum] = useState<any>(null);

  // 1. Manejador de Inicio
  const handleIniciar = () => {
    if (token.trim().length > 0) setEtapa('EXAMEN');
  };

// 🔹 CIERRE CON INTEGRIDAD ESTRUCTURAL (PAI 2.0 - ANTI-DAÑO)
const handleFinalizarExamen = (payload: any) => {
  // 1. Verificación de Existencia de Datos
  if (!payload || (Array.isArray(payload) && payload.length === 0)) {
    console.error("PAI: Error de integridad - El payload está vacío.");
    alert("Error: No se han detectado respuestas para procesar.");
    return; 
  }

  // 2. Validación de Completitud (Estándar de Cuestionario Concluido)
  // Comprobamos que el número de respuestas coincida con el banco de preguntas
  const respuestasCount = payload.respuestas 
    ? Object.keys(payload.respuestas).length 
    : Object.keys(payload).length;

  if (respuestasCount < preguntasOECE.length) {
    console.warn("PAI: Intento de cierre prematuro detectado.");
    alert(`Atención: Solo has respondido ${respuestasCount} de ${preguntasOECE.length} preguntas. Debes finalizar el cuestionario correctamente.`);
    return;
  }

  try {
    // 3. Procesamiento bajo Estándares ISO/IEC de Datos
    const dataNormalizada = payload.respuestas ? payload.respuestas : payload;
    
    const resOece = procesarResultadosNEXUM(preguntasOECE, dataNormalizada);
    setResultadoOece(resOece);

    const evaluadas = preguntasBase.map((p, i) => {
      const r = (dataNormalizada[i] || 'A') as 'A'|'B'|'C'|'D';
      return evaluarRespuesta(p as any, r);
    });

    const diagnostico = AnalyticsEngine.calcularDiagnostico(evaluadas);
    setResultadoNexum(ReportGenerator.generarInforme(diagnostico));

    // 4. CAMBIO DE ETAPA (Solo si la validación es 100% exitosa)
    setEtapa('RESULTADO');
    window.scrollTo({ top: 0, behavior: 'smooth' });

  } catch (err) {
    console.error("PAI: Fallo en la lógica de procesamiento post-validación:", err);
  }
};

  // RENDERIZADO POR ETAPAS
  if (etapa === 'TOKEN') {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-slate-50 p-6">
        {/* CONTENEDOR PRINCIPAL: ACCIÓN */}
        <div className="bg-white p-8 rounded-2xl shadow-xl max-w-md w-full border border-slate-100 relative z-10">
          <div className="flex justify-start mb-4">
            <DashboardButton />
          </div>
          
          <div className="text-center mb-8">
            <h2 className="text-2xl font-black text-slate-800 tracking-tight">ACCESO SICAN</h2>
            <p className="text-slate-400 text-xs mt-1 uppercase tracking-widest font-bold">Consultoría de Élite</p>
          </div>

          <div className="space-y-6">
            <div>
              <input 
                type="text" 
                value={token} 
                onChange={(e) => setToken(e.target.value)}
                className="w-full p-4 text-center text-3xl font-mono tracking-[0.3em] border-2 border-slate-200 rounded-xl focus:border-blue-500 focus:ring-4 focus:ring-blue-50 transition-all outline-none"
                placeholder="000000"
              />
            </div>
            
            <button 
              onClick={handleIniciar} 
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 rounded-xl shadow-lg shadow-blue-200 transition-all transform active:scale-[0.98]"
            >
              COMENZAR EVALUACIÓN
            </button>
          </div>
        </div>

        {/* CONTENEDOR INFERIOR: BLINDAJE LEGAL INDECOPI */}
        <div className="max-w-md w-full mt-6 px-4">
          <div className="flex items-center gap-2 mb-3">
            <div className="h-[1px] flex-grow bg-slate-200"></div>
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-tighter">Propiedad Intelectual NEXUM</span>
            <div className="h-[1px] flex-grow bg-slate-200"></div>
          </div>
          
          <div className="text-[11px] text-slate-500 leading-relaxed text-justify space-y-2">
            <p>
              <span className="text-slate-700 font-bold">AVISO LEGAL:</span> Este simulador y su banco de preguntas son propiedad exclusiva de 
              <span className="text-slate-800 font-extrabold"> Nexum Global Consulting Group S.A.C.</span>
            </p>
            <p>
              Queda estrictamente <span className="text-red-600 font-bold">PROHIBIDA</span> la reproducción total o parcial, captura de pantalla, 
              o réplica de esta casuística con fines comerciales. Este contenido se encuentra en proceso de registro 
              ante <span className="text-slate-700 font-bold">INDECOPI</span>. Cualquier infracción será procesada bajo la Ley sobre el Derecho de Autor (D.L. 822).
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (etapa === 'EXAMEN') {
    return (
      <div className="flex flex-col min-h-screen bg-slate-100">
        <nav className="bg-white border-b p-4 flex justify-between items-center sticky top-0 z-50">
          <DashboardButton />
          <span className="font-bold text-slate-400 text-xs">EXAMEN EN CURSO</span>
        </nav>
        <main className="p-4 md:p-8 max-w-5xl mx-auto w-full">
          {/* app/simulador/page.tsx - VISTA EXAMEN */}
          <QuizEngine 
            preguntas={preguntasOECE} 
            onFinalizar={(datos: any) => handleFinalizarExamen(datos)} 
          />

        </main>
      </div>
    );
  }

  if (etapa === 'RESULTADO') {
    return (
      <div className="min-h-screen bg-white p-6 md:p-12">
        <div className="max-w-4xl mx-auto">
          <header className="flex justify-between items-center mb-10 border-b pb-6">
            <DashboardButton />
            <h1 className="text-2xl font-black text-slate-900 tracking-tighter">RESULTADOS DE AUDITORÍA</h1>
          </header>
          
          <ResultAudit data={resultadoOece} />

          <section className="mt-12 p-8 bg-slate-900 rounded-3xl text-white relative overflow-hidden shadow-2xl">
            <div className="absolute top-0 right-0 p-4 bg-blue-600 text-[10px] font-bold">NEXUM ELITE AI</div>
            <h3 className="text-blue-400 font-black text-sm uppercase tracking-widest mb-6 text-center md:text-left">Diagnóstico de Riesgo Institucional</h3>
            <div className="grid md:grid-cols-2 gap-8">
              <div className="space-y-4">
                <p className="text-slate-400 text-xs uppercase font-bold">Nivel de Riesgo</p>
                <div className="text-3xl font-black text-white">{resultadoNexum?.nivelRiesgo}</div>
              </div>
              <div className="space-y-4 border-l border-slate-700 pl-8">
                <p className="text-slate-400 text-xs uppercase font-bold">Prescripción Preventiva</p>
                <div className="text-sm leading-relaxed text-slate-300 italic">"{resultadoNexum?.prescripcion}"</div>
              </div>
            </div>
          </section>
          
          <button onClick={() => window.location.reload()} className="w-full mt-12 py-4 border-2 border-slate-200 text-slate-400 font-bold rounded-xl hover:bg-slate-50 transition-all">
            FINALIZAR SESIÓN Y SALIR
          </button>
        </div>
      </div>
    );
  }

  return null;
}