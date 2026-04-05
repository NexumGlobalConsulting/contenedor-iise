// lib/ReportGenerator.ts

export class ReportGenerator {
  /**
   * Genera el Informe NEXUM (Formato Propietario)
   * Traduce el Índice de Riesgo en Impacto y Prescripción Técnica
   */
  static generarInforme(diagnostico: any) {
    const { IR, nivelRiesgo, errorPredominante, brechas } = diagnostico;

    // 1. Definición de Impacto según Nivel de Riesgo
    const impactos: Record<string, string> = {
      'Bajo': "Operación segura. El tomador de decisiones posee control normativo y estratégico.",
      'Medio': "Riesgos operativos identificados. Probabilidad moderada de observaciones administrativas.",
      'Alto': "Vulnerabilidad crítica. Alta probabilidad de responsabilidad administrativa y parálisis de procesos.",
      'Crítico': "Exposición total. Riesgo inminente de sanciones legales y pérdida de recursos públicos."
    };

    // 2. Sistema de Prescripción NEXUM (SPN v1.0)
    // Basado en la Regla Base: Cada error genera una acción correctiva específica.
    const prescripciones: Record<string, string> = {
      'E1': "RECONFIGURACIÓN CONCEPTUAL: Es necesario fortalecer las bases teóricas de la Ley 32069.",
      'E2': "ACTUALIZACIÓN NORMATIVA DIRIGIDA: Revisión inmediata del D.S. 009-2025-EF y directivas de la DEC.",
      'E3': "ENTRENAMIENTO INTERPRETATIVO: Talleres de análisis de casos complejos y criterios de interacción con el mercado.",
      'E4': "SIMULACIÓN DE DECISIONES: Coaching de alta dirección para mitigar el temor a la responsabilidad administrativa."
    };

    return {
      IR,
      nivelRiesgo,
      impacto: impactos[nivelRiesgo] || impactos['Bajo'],
      prescripcion: prescripciones[errorPredominante] || prescripciones['E1'],
      brechas: brechas,
      resumenEjecutivo: `El evaluado presenta un patrón de error tipo ${errorPredominante} en las competencias de ${brechas.join(', ')}.`
    };
  }
}