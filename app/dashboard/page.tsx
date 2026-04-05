'use client';

import React from 'react';
import Link from 'next/link';

export default function Dashboard() {
  const modulos = [
    { title: 'Módulo de Evaluación', desc: 'Acceso a simulaciones y pruebas técnicas.', path: '/simulador', active: true },
    { title: 'Repositorio de Datos', desc: 'Gestión de archivos y documentación.', path: '#', active: false },
    { title: 'Configuración', desc: 'Ajustes del sistema y preferencias.', path: '#', active: false }
  ];

  return (
    <div style={{ backgroundColor: '#f8fafc', minHeight: '100vh', padding: '40px', fontFamily: 'sans-serif' }}>
      <header style={{ maxWidth: '900px', margin: '0 auto 40px', borderBottom: '1px solid #e2e8f0', paddingBottom: '20px' }}>
        <h1 style={{ fontSize: '1.5rem', fontWeight: '800', color: '#0f172a' }}>Plataforma de Gestión</h1>
        <p style={{ fontSize: '0.9rem', color: '#64748b' }}>Entorno de desarrollo local</p>
      </header>

      <main style={{ maxWidth: '900px', margin: '0 auto' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px' }}>
          {modulos.map((m, i) => (
            <Link key={i} href={m.path} style={{ textDecoration: 'none' }}>
              <div style={{ 
                backgroundColor: '#fff', 
                padding: '30px', 
                borderRadius: '16px', 
                border: '1px solid #e2e8f0',
                opacity: m.active ? 1 : 0.5,
                cursor: m.active ? 'pointer' : 'default'
              }}>
                <h3 style={{ margin: '0 0 10px 0', color: '#1e293b' }}>{m.title}</h3>
                <p style={{ margin: 0, color: '#64748b', fontSize: '0.85rem' }}>{m.desc}</p>
              </div>
            </Link>
          ))}
        </div>
      </main>
    </div>
  );
}