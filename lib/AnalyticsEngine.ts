// lib/AnalyticsEngine.ts
import { supabase } from './supabaseClient';

// Definición de Pesos según Documento Base v1.1
const PONDERACION_ERRORES: Record<string, number> = {
  'E1': 1.0, // Conceptual
  'E2': 1.2, // Normativo
  'E3': 1.5, // Interpretativo
  'E4': 2.0  // Estratégico
};

export class AnalyticsEngine {
  /**
   * Calcula el Diagnóstico Integral basado en el Motor de Diagnóstico (MDN v1.0)
   */
  static calcularDiagnostico(evaluaciones: any[]) {
    const totalItems = evaluaciones.length;
    const errores = evaluaciones.filter(e => !e.esCorrecta);
    
    // 1. Cálculo del Índice de Riesgo (IR)
    // IR = Σ (Errores ponderados) / Total de ítems
    const sumaPonderada = errores.reduce((acc, curr) => {
      const peso = PONDERACION_ERRORES[curr.tipoError] || 1.0;
      return acc + peso;
    }, 0);

    const IR = totalItems > 0 ? sumaPonderada / totalItems : 0;

    // 2. Clasificación del Nivel de Riesgo
    let nivelRiesgo = 'Bajo';
    if (IR > 2.0) nivelRiesgo = 'Crítico';
    else if (IR >= 1.3) nivelRiesgo = 'Alto';
    else if (IR >= 0.6) nivelRiesgo = 'Medio';

    // 3. Identificación de Brechas (Agrupación por Categoría)
    const brechasSet = new Set<string>(errores.map(e => e.categoria));
    const brechas = Array.from(brechasSet);

    // 4. Determinación del Error Predominante (Patrón de Error Dominante)
    const conteoErrores: Record<string, number> = {};
    errores.forEach(e => {
      conteoErrores[e.tipoError] = (conteoErrores[e.tipoError] || 0) + 1;
    });
    const errorPredominante = Object.keys(conteoErrores).reduce((a, b) => 
      conteoErrores[a] > conteoErrores[b] ? a : b, 'E1'
    );

    return {
      IR,
      nivelRiesgo,
      brechas,
      errorPredominante,
      totalEvaluaciones: totalItems,
      fecha: new Date().toISOString()
    };
  }

  /**
   * Sincronización con la Bóveda NEXUM (Supabase)
   */
  static async guardarEnBoveda(diagnostico: any, prescripcion: string) {
    try {
      const { data, error } = await supabase
        .from('auditorias_nexum')
        .insert([
          {
            indice_riesgo: diagnostico.IR,
            nivel_riesgo: diagnostico.nivelRiesgo,
            brechas: diagnostico.brechas,
            prescripcion: prescripcion,
            respuestas_json: {
              error_predominante: diagnostico.errorPredominante,
              total_items: diagnostico.totalEvaluaciones
            }
          }
        ]);

      if (error) throw error;
      console.log("✅ SIA v1.0: Sincronización exitosa con el Nodo Perú.");
      return { success: true };
    } catch (error) {
      console.error("❌ E2: Fallo en Integración Analítica", error);
      return { success: false, error };
    }
  }
}