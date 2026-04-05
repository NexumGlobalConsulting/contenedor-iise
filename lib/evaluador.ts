import { UEC } from './types';

export const evaluarRespuesta = (pregunta: UEC, respuestaUsuario: string) => {
  const esCorrecta = pregunta.correcta === respuestaUsuario;
  return {
    preguntaId: pregunta.id,
    esCorrecta,
    tipoError: esCorrecta ? null : (pregunta.errorMap[respuestaUsuario] || "Desconocido")
  };
};