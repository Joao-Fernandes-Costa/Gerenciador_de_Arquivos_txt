// app/browse/[[...slug]]/page.tsx
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import SearchForm from '@/app/components/SearchForm'; // <-- 1. AQUI ESTÁ A IMPORTAÇÃO

// Definindo os tipos dos dados que esperamos da API
interface FileItem {
  name: string;
  is_dir: boolean;
}

interface ApiResponse {
  path: string;
  items: FileItem[];
}

export default function BrowsePage({ params }: { params: { slug?: string[] } }) {
  const [data, setData] = useState<ApiResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  const currentPath = params.slug?.join('/') || '';

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`http://127.0.0.1:5000/api/browse/${currentPath}`);
        if (!response.ok) {
          throw new Error('Falha ao buscar dados da API');
        }
        const result: ApiResponse = await response.json();
        setData(result);
      } catch (err: any) {
        setError(err.message);
      }
    };

    fetchData();
  }, [currentPath]);

  if (error) return <p>Erro: {error}</p>;
  if (!data) return <p>Carregando...</p>;

  const parentPath = currentPath.includes('/') ? `/browse/${currentPath.substring(0, currentPath.lastIndexOf('/'))}` : '/browse';

  return (
    <main className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Explorador de Arquivos</h1>
      
      <SearchForm /> {/* <-- 2. AQUI ESTAMOS USANDO O COMPONENTE */}
      
      <hr className="my-4" />

      <p className="mb-4 text-gray-600">Local: /{data.path}</p>
      
      <ul className="list-none p-0">
        {currentPath && (
          <li>
            <Link href={parentPath} className="text-blue-500 hover:underline">
              ../ (Voltar)
            </Link>
          </li>
        )}
        {data.items.map((item) => (
          <li key={item.name} className={item.is_dir ? 'font-bold' : ''}>
            <Link 
              href={item.is_dir ? `/browse/${data.path ? `${data.path}/` : ''}${item.name}` : `http://127.0.0.1:5000/api/view/${data.path ? `${data.path}/` : ''}${item.name}`}
              target={item.is_dir ? '_self' : '_blank'}
              rel="noopener noreferrer"
              className="text-blue-500 hover:underline"
            >
              {item.name}{item.is_dir ? '/' : ''}
            </Link>
          </li>
        ))}
      </ul>
    </main>
  );
}