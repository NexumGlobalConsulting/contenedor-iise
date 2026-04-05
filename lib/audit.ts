export class AnalyticsEngine {
    static calcularDiagnostico(evaluadas: any[]) {
      const total = evaluadas.length;
  
      const errores = evaluadas.filter(e => !e.correcta);
  
      const IR = errores.length / total;
  
      return {
        IR,
        nivelRiesgo: IR > 0.7 ? "Alto" : "Bajo",
        brechas: errores.map(e => e.tipoError),
        impacto: "Riesgo detectado",
        prescripcion: "Reforzar conocimientos"
      };
    }
  }