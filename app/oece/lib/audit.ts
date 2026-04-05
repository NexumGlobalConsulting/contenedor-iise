// app/oece/lib/audit.ts
import { ExamenResultado, PreguntaOECE, TipoError } from '../types';

export function procesarResultadosNEXUM(
  preguntas: PreguntaOECE[],
  respuestas: Record<number, string>
): ExamenResultado {
  let puntajeTotal = 0;
  const logroPorCompetencia: Record<string, number> = { C1: 0, C2: 0, C3: 0 };
  const mapaErrores: Record<string, number> = { E1: 0, E2: 0, E3: 0, E4: 0 };

  preguntas.forEach((p, index) => {
    const resp = respuestas[index];
    
    if (resp === p.respuestaCorrectaId) {
      puntajeTotal++;
      if (p.competencia in logroPorCompetencia) {
        logroPorCompetencia[p.competencia]++;
      }
    } else {
      const opcion = p.opciones.find(o => o.id === resp);
      if (opcion?.tipoError) {
        mapaErrores[opcion.tipoError]++;
      }
    }
  });

  let nivel = 'NO APTO';
  if (puntajeTotal >= 60) nivel = 'AVANZADO';
  else if (puntajeTotal >= 45) nivel = 'INTERMEDIO';
  else if (puntajeTotal >= 30) nivel = 'BÁSICO';

  return { 
    puntajeTotal, 
    logroPorCompetencia, 
    mapaErrores, 
    nivel, 
    fecha: new Date().toISOString() 
  };
}