'use client';

import { useRouter } from 'next/navigation';

export default function AuditorButton() {

  const router = useRouter();

  // 🔒 SOLO VISIBLE EN DESARROLLO
  if (process.env.NODE_ENV !== 'development') return null;

  return (
    <button
      onClick={() => router.push('/dashboard')}
      style={{
        position: 'fixed',
        top: 20,
        right: 20,
        zIndex: 9999,
        background: 'red',
        color: 'white',
        padding: '10px 14px',
        fontSize: 12,
        fontWeight: 'bold',
        border: 'none',
        cursor: 'pointer'
      }}
    >
      ⬅ Dashboard
    </button>
  );
}