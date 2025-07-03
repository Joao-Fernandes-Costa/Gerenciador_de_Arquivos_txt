// app/components/Navbar.tsx
'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function Navbar() {
  const pathname = usePathname();

  const linkClasses = (path: string) => 
    `px-3 py-2 rounded-md text-sm font-medium transition-colors ${
      pathname.startsWith(path) 
        ? 'bg-gray-900 text-white' 
        : 'text-gray-300 hover:bg-gray-700 hover:text-white'
    }`;

  return (
    <nav className="bg-gray-800 shadow-md">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <Link href="/browse" className="text-white font-bold text-xl">
              Gerenciador de Notas
            </Link>
          </div>
          <div className="flex items-center">
            <div className="flex items-baseline space-x-4">
              <Link href="/browse" className={linkClasses('/browse')}>
                Home (Explorador)
              </Link>
              <Link href="/create" className={linkClasses('/create')}>
                Criar Nota
              </Link>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}