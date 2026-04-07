'use client';

import React, { useState } from 'react';

type Opcion = {
  id: number;
  texto: string;
  esCorrecta: boolean;
};

type Pregunta = {
  id: number;
  pregunta: string;
  opciones: Opcion[];
};

export default function OECEPage() {
  const [respuestas, setRespuestas] = useState<Record<number, number>>({});

  const preguntas: Pregunta[] = [
    {
      id: 1,
      pregunta: "¿Cuál es la respuesta correcta?",
      opciones: [
        { id: 0, texto: "A", esCorrecta: false },
        { id: 1, texto: "B", esCorrecta: true },
        { id: 2, texto: "C", esCorrecta: false },
        { id: 3, texto: "D", esCorrecta: false }
      ]
    }
  ];

  const responder = (pid: number, oid: number) => {
    setRespuestas(prev => ({ ...prev, [pid]: oid }));
  };

  return (
    <div className="p-10">
      <h1 className="text-xl font-bold mb-6">Simulador OECE</h1>

      {preguntas.map(p => (
        <div key={p.id} className="mb-6">
          <p className="mb-2">{p.pregunta}</p>

          {p.opciones.map(op => (
            <button
              key={op.id}
              onClick={() => responder(p.id, op.id)}
              className="block border px-4 py-2 mb-2"
            >
              {op.texto}
            </button>
          ))}
        </div>
      ))}
    </div>
  );
}