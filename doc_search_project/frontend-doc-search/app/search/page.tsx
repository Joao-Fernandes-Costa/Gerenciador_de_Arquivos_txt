// app/search/page.tsx
'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import SearchForm from '@/app/components/SearchForm';

interface SearchResponse {
  query: string;
  results: string[];
}

// Componente principal que faz a busca e mostra os resultados
function SearchResults() {
  const searchParams = useSearchParams();
  const query = searchParams.get('q') || '';

  const [results, setResults] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!query) {
      setResults([]);
      return;
    }

    const fetchResults = async () => {
      setIsLoading(true);
      try {
        // Chama a API do backend para obter os resultados da busca
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/search?q=${encodeURIComponent(query)}`);
        const data: SearchResponse = await response.json();
        setResults(data.results);
      } catch (error) {
        console.error("Erro ao buscar resultados:", error);
        setResults([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchResults();
  }, [query]);

  if (isLoading) {
    return <p>Buscando por "{query}"...</p>;
  }

  return (
    <div>
      <h2 className="text-xl">Resultados para: "{query}"</h2>
      {results.length > 0 ? (
        <ul className="list-disc pl-5 mt-2">
          {results.map((filepath) => (
            <li key={filepath}>
              {/* O link aponta para a rota da API que visualiza o conteúdo */}
              <a
                href={`${process.env.NEXT_PUBLIC_API_URL}/api/view/${filepath}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-500 hover:underline"
              >
                {filepath}
              </a>
            </li>
          ))}
        </ul>
      ) : (
        <p>Nenhum resultado encontrado.</p>
      )}
    </div>
  );
}

// A página que será renderizada
export default function SearchPage() {
  return (
    <main className="container mx-auto p-4">
      <h1 className="text-2xl font-bold">Busca de Arquivos</h1>
      <p className="mb-4"><Link href="/browse" className="text-blue-500 hover:underline">&laquo; Voltar ao explorador</Link></p>

      <SearchForm />
      <hr className="my-4" />

      {/* Suspense é um recurso do React para lidar com carregamento de dados */}
      <Suspense fallback={<p>Carregando busca...</p>}>
        <SearchResults />
      </Suspense>
    </main>
  );
}