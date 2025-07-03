// app/edit/[[...slug]]/page.tsx
'use client';

import { useState, useEffect, Suspense } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';

function EditForm() {
    const params = useParams();
    const router = useRouter(); // Para redirecionar o usuário após salvar

    // O 'slug' vem da URL e forma o caminho do arquivo
    const filepath = Array.isArray(params.slug) ? params.slug.join('/') : '';

    const [content, setContent] = useState('');
    const [status, setStatus] = useState('Carregando...');

    // Efeito para carregar o conteúdo inicial do arquivo
    useEffect(() => {
        if (!filepath) return;

        const fetchContent = async () => {
            try {
                // Usamos a nossa API de visualização para pegar o conteúdo atual
                const response = await fetch(`http://192.168.0.104:5000/api/view/${filepath}`);
                const data = await response.json();
                if (data.error) {
                    throw new Error(data.error);
                }
                setContent(data.content);
                setStatus('');
            } catch (err: any) {
                setStatus(`Erro ao carregar o arquivo: ${err.message}`);
            }
        };

        fetchContent();
    }, [filepath]);

    // Função para salvar as alterações
    const handleSave = async () => {
        setStatus('Salvando...');
        try {
            // Chama a nossa NOVA API de atualização, enviando os dados em formato JSON
            const response = await fetch(`http://192.168.0.104:5000/api/file/update`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ filepath, content }),
            });

            const data = await response.json();
            if (data.error) {
                throw new Error(data.error);
            }
            setStatus('Arquivo salvo com sucesso!');
            // Redireciona de volta para o explorador de arquivos
            setTimeout(() => router.push('/browse'), 1500); 
        } catch (err: any) {
            setStatus(`Erro ao salvar: ${err.message}`);
        }
    };

    if (!filepath) {
        return <p>Arquivo não especificado.</p>;
    }
    
    return (
        <div>
            <h2 className="text-xl font-mono mb-4">{filepath}</h2>
            <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                className="w-full h-96 p-2 border rounded font-mono bg-gray-100 dark:bg-gray-800 text-sm"
                disabled={status === 'Carregando...'}
            />
            <div className="mt-4 flex items-center gap-4">
                <button
                    onClick={handleSave}
                    className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                >
                    Salvar Alterações
                </button>
                <p className="text-sm">{status}</p>
            </div>
        </div>
    );
}


export default function EditPage() {
    return (
        <main className="container mx-auto p-4">
            <h1 className="text-2xl font-bold mb-4">Editar Arquivo</h1>
            <p className="mb-4"><Link href="/browse" className="text-blue-500 hover:underline">&laquo; Voltar ao explorador</Link></p>
            <Suspense fallback={<p>Carregando editor...</p>}>
                <EditForm />
            </Suspense>
        </main>
    )
}