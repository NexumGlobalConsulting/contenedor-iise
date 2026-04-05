'use client';

import { useRouter } from 'next/navigation';

export default function DashboardButton() {
  const router = useRouter();

  return (
    <button
      onClick={() => router.push('/dashboard')}
      style={{
        position: 'fixed',
        top: 20,
        right: 20,
        zIndex: 9999,
        background: '#000',
        color: '#fff',
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