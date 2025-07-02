// app/create/page.tsx
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

// --- Dados que vamos usar nos formulários ---

const tecnicos = [
    "TECNICO 1",
    "TECNICO 2",
    "TECNICO 3",
    "OUTRO"
];

const conferentes = [
    "JOAO VITOR",
    "THALLES",
    "LUIZ FELIPE"
];

// --- Template da nota ATUALIZADO ---
// Adicionamos um título fixo e um placeholder para o relato do serviço.
const notaTemplate = `
-------------------------------------------
   RELATÓRIO DE SERVIÇO TÉCNICO
-------------------------------------------

TRANSFERENCIA DE EQUIPAMENTOS
DATA: {{DATA}}

TECNICO: {{TECNICO}}

RELATO DO SERVIÇO:
{{RELATO}}

-------------------------------------------
CONFERIDO POR: {{CONFERENTE}}
RETIRADO POR: _________________________
`;


export default function CreateSmartNotePage() {
    const router = useRouter();

    // --- Estados para cada campo do formulário ---
    const [data, setData] = useState(new Date().toISOString().split('T')[0]);
    const [tecnico, setTecnico] = useState(tecnicos[0]);
    // NOVO ESTADO para o campo de relato
    const [relato, setRelato] = useState('');
    const [conferente, setConferente] = useState(conferentes[0]);
    const [status, setStatus] = useState('');

    const handleCreate = async () => {
        if (!tecnico || !data) {
            setStatus('Data e Técnico são campos obrigatórios.');
            return;
        }

        const nomeArquivo = `NOTA ${tecnico} ${data}.txt`.replace(/\//g, '-');
        const caminhoArquivo = `Notas Criadas/${nomeArquivo}`;

        setStatus('Criando nota...');

        // Montar o conteúdo final da nota com os novos campos
        const [ano, mes, dia] = data.split('-'); // Pega "2025-07-02" e quebra em [ "2025", "07", "02" ]
        const dataFormatada = `${dia}/${mes}/${ano}`; // Monta a string no formato "02/07/2025"

        let conteudoFinal = notaTemplate
            .replace('{{DATA}}', dataFormatada) // Usa a data já formatada corretamente
            .replace('{{TECNICO}}', tecnico)
            .replace('{{RELATO}}', relato || 'Nenhum relato fornecido.')
            .replace('{{CONFERENTE}}', conferente);

        try {
            const response = await fetch('http://127.0.0.1:5000/api/file/create', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ filepath: caminhoArquivo, content: conteudoFinal }),
            });

            const result = await response.json();
            if (result.error) throw new Error(result.error);

            setStatus(result.message);
            setTimeout(() => router.push('/browse'), 2000);

        } catch (err: any) {
            setStatus(`Erro ao criar nota: ${err.message}`);
        }
    };

    return (
        <main className="container mx-auto p-4">
            <h1 className="text-2xl font-bold mb-4">Criar Nova Nota de Técnico</h1>
            <p className="mb-4"><Link href="/browse" className="text-blue-500 hover:underline">&laquo; Voltar ao explorador</Link></p>

            <div className="space-y-4 max-w-lg">
                {/* 1. TEXTO FIXO ADICIONADO AQUI */}
                <div className="p-3 bg-gray-100 dark:bg-gray-800 rounded text-center">
                    <h2 className="font-bold">RELATÓRIO DE SERVIÇO TÉCNICO</h2>
                </div>

                <div>
                    <label htmlFor="data" className="block text-sm font-medium mb-1">Data da Nota</label>
                    <input
                        id="data"
                        type="date"
                        value={data}
                        onChange={(e) => setData(e.target.value)}
                        className="w-full p-2 border rounded bg-gray-100 dark:bg-gray-800"
                    />
                </div>

                <div>
                    <label htmlFor="tecnico" className="block text-sm font-medium mb-1">Técnico</label>
                    <select
                        id="tecnico"
                        value={tecnico}
                        onChange={(e) => setTecnico(e.target.value)}
                        className="w-full p-2 border rounded bg-gray-100 dark:bg-gray-800"
                    >
                        {tecnicos.map(t => <option key={t} value={t}>{t}</option>)}
                    </select>
                </div>

                {/* 2. NOVO CAMPO DE RELATO ADICIONADO AQUI */}
                <div>
                    <label htmlFor="relato" className="block text-sm font-medium mb-1">Relato do Serviço / Equipamentos</label>
                    <textarea
                        id="relato"
                        value={relato}
                        onChange={(e) => setRelato(e.target.value)}
                        rows={6}
                        className="w-full p-2 border rounded bg-gray-100 dark:bg-gray-800 font-mono text-sm"
                        placeholder="Descreva o serviço, equipamentos transferidos, etc."
                    />
                </div>

                <div>
                    <label htmlFor="conferente" className="block text-sm font-medium mb-1">Conferido Por</label>
                    <select
                        id="conferente"
                        value={conferente}
                        onChange={(e) => setConferente(e.target.value)}
                        className="w-full p-2 border rounded bg-gray-100 dark:bg-gray-800"
                    >
                        {conferentes.map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                </div>

                {/* 3. CAMPO "RETIRADO POR" DESABILITADO */}
                <div>
                    <label htmlFor="retiradoPor" className="block text-sm font-medium mb-1">Retirado Por</label>
                    <input
                        id="retiradoPor"
                        type="text"
                        disabled
                        placeholder="Campo para assinatura manual no papel"
                        className="w-full p-2 border rounded bg-gray-200 dark:bg-gray-700 cursor-not-allowed"
                    />
                </div>


                <div className="flex items-center gap-4 pt-4">
                    <button
                        onClick={handleCreate}
                        className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 text-lg"
                    >
                        Gerar e Salvar Nota
                    </button>
                    <p className="text-sm">{status}</p>
                </div>
            </div>
        </main>
    );
}