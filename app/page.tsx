'use client';

import { useRouter } from 'next/navigation';

export default function DashboardPage() {
  const router = useRouter();

  return (
    <div className="h-screen flex items-center justify-center">
      <button
        onClick={() => router.push('/oece')}
        className="bg-blue-600 text-white px-6 py-3 rounded-lg"
      >
        Iniciar Evaluación
      </button>
    </div>
  );
}