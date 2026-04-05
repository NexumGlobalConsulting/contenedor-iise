// lib/PersistenceManager.ts

export const PersistenceManager = {

  guardarSesion: (data: any) => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('NEXUM_SESSION', JSON.stringify({
        ...data,
        fecha: new Date().toISOString()
      }));
    }
  },

  obtenerSesion: () => {
    if (typeof window !== 'undefined') {
      const raw = localStorage.getItem('NEXUM_SESSION');
      return raw ? JSON.parse(raw) : null;
    }
    return null;
  },

  guardarHistorial: (registro: any) => {
    if (typeof window !== 'undefined') {
      const raw = localStorage.getItem('NEXUM_HISTORY');
      const historial = raw ? JSON.parse(raw) : [];

      historial.push(registro);

      localStorage.setItem('NEXUM_HISTORY', JSON.stringify(historial));
    }
  }

};