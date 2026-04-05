// lib/StorageAdapter.ts

export const StorageAdapter = {
    // 1. Sincronización Blindada
    async sync(key: string, data: any) {
      if (typeof window !== 'undefined') {
        try {
          const payload = {
            ...data,
            lastUpdate: new Date().toISOString(),
            appVersion: "2.1.0-SECURITY"
          };
          localStorage.setItem(key, JSON.stringify(payload));
          
          // Si hay datos de Lead, los registramos en un historial de "Usuarios Evaluados"
          if (data.email) {
            this.registrarEnHistorial(data.email);
          }
        } catch (e) {
          console.error("ERROR_PERSISTENCIA_NEXUM:", e);
        }
      }
    },
  
    // 2. Recuperación de Datos
    async retrieve(key: string) {
      if (typeof window !== 'undefined') {
        const raw = localStorage.getItem(key);
        return raw ? JSON.parse(raw) : null;
      }
      return null;
    },
  
    // 3. Lógica de Unicidad (Nivel 2 de Blindaje)
    async verificarSiYaFueEvaluado(email: string): Promise<boolean> {
      if (typeof window !== 'undefined') {
        const historialRaw = localStorage.getItem('NEXUM_HISTORIAL_EVALUADOS');
        const historial = historialRaw ? JSON.parse(historialRaw) : [];
        return historial.includes(email.toLowerCase().trim());
      }
      return false;
    },
  
    registrarEnHistorial(email: string) {
      const historialRaw = localStorage.getItem('NEXUM_HISTORIAL_EVALUADOS');
      let historial = historialRaw ? JSON.parse(historialRaw) : [];
      const normalizedEmail = email.toLowerCase().trim();
      
      if (!historial.includes(normalizedEmail)) {
        historial.push(normalizedEmail);
        localStorage.setItem('NEXUM_HISTORIAL_EVALUADOS', JSON.stringify(historial));
      }
    },
  
    // 4. ELIMINACIÓN DE RIESGO: Solo el Administrador puede limpiar datos
    resetTotal() {
      if (typeof window !== 'undefined') {
        localStorage.removeItem('NEXUM_CORE_SESSION');
        // No borramos NEXUM_HISTORIAL_EVALUADOS para mantener la integridad
      }
    }
  };