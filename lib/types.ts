export type Categoria = 'Riesgos' | 'Normativa' | 'Estrategia' | 'Etica' | 'Eficiencia';
export type ErrorType = 'E1' | 'E2' | 'E3' | 'E4';

export interface UEC {
  id: number;
  categoria: Categoria;
  pregunta: string;

  opciones: {
    A: string;
    B: string;
    C: string;
    D: string;
  };

  correcta: 'A' | 'B' | 'C' | 'D';

  errorMap: {
    A?: ErrorType;
    B?: ErrorType;
    C?: ErrorType;
    D?: ErrorType;
  };
}

export interface RespuestaEvaluada {
  categoria: Categoria;
  correcta: boolean;
  errorTipo?: ErrorType;
}