// lib/evaluador.ts

export const evaluarRespuesta = (pregunta: any, respuestaUsuario: string) => {
  // 1. Usamos la variable mapeada en page.tsx
  const esCorrecta = pregunta.respuestaCorrectaId === respuestaUsuario;

  // 2. Extraemos el tipo de error si el usuario falló
  let tipoError = "Desconocido";
  
  if (!esCorrecta && pregunta.opciones) {
    const opcionElegida = pregunta.opciones.find((opt: any) => opt.id === respuestaUsuario);
    // Si page.tsx logró mapear el error, lo usamos, si no, asignamos uno genérico
    if (opcionElegida && opcionElegida.tipoError) {
      tipoError = opcionElegida.tipoError;
    } else {
      tipoError = "Error de Precisión o Interpretación";
    }
  }

  return {
    preguntaId: pregunta.id || 0,
    esCorrecta,
    tipoError: esCorrecta ? null : tipoError
  };
};