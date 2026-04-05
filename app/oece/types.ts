// app/oece/types.ts

// 1. Tipos Base
export type TipoError = 'E1' | 'E2' | 'E3' | 'E4';

// 2. Estructura de Opciones
export interface OpcionOECE {
  id: string;
  texto: string;
  tipoError?: TipoError;
}

// 3. Estructura del Banco de Preguntas
export interface PreguntaOECE {
  id: number;
  temaId: number;
  competencia: 'C1' | 'C2' | 'C3' | string;
  enunciado: string;
  opciones: OpcionOECE[];
  respuestaCorrectaId: string;
  referenciaLegal?: string;
}

// 4. Estructura del Diagnóstico Final
export interface ExamenResultado {
  puntajeTotal: number;
  logroPorCompetencia: Record<string, number>;
  mapaErrores: Record<string, number>;
  nivel: string;
  fecha: string;
}