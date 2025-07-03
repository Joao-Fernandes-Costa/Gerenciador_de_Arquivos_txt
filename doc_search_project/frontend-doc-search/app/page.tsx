// app/page.tsx
import Link from 'next/link';

export default function HomePage() {
  return (
    <div className="text-center mt-20">
      <h1 className="text-4xl font-bold mb-4">Bem-vindo ao Gerenciador de Notas</h1>
      <p className="text-lg text-gray-600 mb-8">
        Use o menu acima ou os links abaixo para começar.
      </p>
      <div className="flex justify-center gap-4">
        <Link 
          href="/browse" 
          className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold text-lg hover:bg-blue-700 transition-transform transform hover:scale-105"
        >
          Ver Todas as Notas
        </Link>
        <Link 
          href="/create" 
          className="bg-green-600 text-white px-6 py-3 rounded-lg font-semibold text-lg hover:bg-green-700 transition-transform transform hover:scale-105"
        >
          Criar Nova Nota
        </Link>
      </div>
    </div>
  );
}