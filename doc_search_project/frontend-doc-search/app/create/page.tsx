// app/create/page.tsx
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

// --- Dados que vamos usar nos formulários ---
const tecnicos = ["DANILO", "DIOGO", "GABRIEL.T", "GABRIEL.M","GUSTAVO.B","GUSTAVO.H","GILBERTO","FABIANO","FRANCISCO.A","FELIPE","LUCAS.C","LUCAS.L","MATHEUS.H","MAURICIO","MICHAEL","MILLER","RAFAEL.J","RAFAEL.R","RODRIGO","RICKSON","VINICIUS","WARLEY"];
const conferentes = ["JOAO VITOR", "THALLES"];

// --- Template da nota ATUALIZADO ---
// Adicionamos um placeholder para o TIPO da nota.
const notaTemplate = `
-------------------------------------------
   RELATÓRIO DE SERVIÇO TÉCNICO
-------------------------------------------

TIPO DA NOTA: {{TIPO_NOTA}}
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
    const [tipoNota, setTipoNota] = useState('Equipamentos'); // NOVO ESTADO para o tipo da nota
    const [data, setData] = useState(new Date().toISOString().split('T')[0]);
    const [tecnico, setTecnico] = useState(tecnicos[0]);
    const [relato, setRelato] = useState('');
    const [conferente, setConferente] = useState(conferentes[0]);
    const [status, setStatus] = useState('');

    const handleCreate = async () => {
        if (!tecnico || !data) {
            setStatus('Data e Técnico são campos obrigatórios.');
            return;
        }

        let nomeArquivo;
        if (tipoNota === 'Ferramental') {
            // Se for ferramental, adiciona a palavra "FERRAMENTAL" no nome
            nomeArquivo = `NOTA ${tecnico} EQUIP ${data}.txt`.replace(/\//g, '-');
        } else {
            // Senão, mantém o formato original para equipamentos
            nomeArquivo = `NOTA ${tecnico} ${data}.txt`.replace(/\//g, '-');
        }
        const caminhoArquivo = `${tecnico}/${nomeArquivo}`;

        setStatus('Criando nota...');

        const [ano, mes, dia] = data.split('-');
        const dataFormatada = `${dia}/${mes}/${ano}`;

        // Lógica de montagem do conteúdo ATUALIZADA
        let conteudoFinal = notaTemplate
            .replace('{{TIPO_NOTA}}', tipoNota) // Adiciona o tipo da nota
            .replace('{{DATA}}', dataFormatada)
            .replace('{{TECNICO}}', tecnico)
            .replace('{{RELATO}}', relato || 'Nenhum relato fornecido.')
            .replace('{{CONFERENTE}}', conferente);

        try {
            const response = await fetch('http://192.168.0.104:5000/api/file/create', {
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
                <div className="p-3 bg-gray-100 dark:bg-gray-800 rounded text-center">
                    <h2 className="font-bold">RELATÓRIO DE SERVIÇO TÉCNICO</h2>
                </div>

                {/* 1. NOVO CAMPO DE SELEÇÃO ADICIONADO AQUI */}
                <div>
                    <label className="block text-sm font-medium mb-2">Tipo de Nota</label>
                    <div className="flex gap-4">
                        <label className="flex items-center">
                            <input
                                type="radio"
                                name="tipoNota"
                                value="Equipamentos"
                                checked={tipoNota === 'Equipamentos'}
                                onChange={(e) => setTipoNota(e.target.value)}
                                className="h-4 w-4"
                            />
                            <span className="ml-2">Equipamentos</span>
                        </label>
                        <label className="flex items-center">
                            <input
                                type="radio"
                                name="tipoNota"
                                value="Ferramental"
                                checked={tipoNota === 'Ferramental'}
                                onChange={(e) => setTipoNota(e.target.value)}
                                className="h-4 w-4"
                            />
                            <span className="ml-2">Ferramental</span>
                        </label>
                    </div>
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

                {/* O resto do formulário continua igual... */}
                <div>
                    <label htmlFor="tecnico" className="block text-sm font-medium mb-1">Técnico</label>
                    <select id="tecnico" value={tecnico} onChange={(e) => setTecnico(e.target.value)} className="w-full p-2 border rounded bg-gray-100 dark:bg-gray-800">
                        {tecnicos.map(t => <option key={t} value={t}>{t}</option>)}
                    </select>
                </div>
                <div>
                    <label htmlFor="relato" className="block text-sm font-medium mb-1">Relato do Serviço / Itens</label>
                    <textarea id="relato" value={relato} onChange={(e) => setRelato(e.target.value)} rows={6} className="w-full p-2 border rounded bg-gray-100 dark:bg-gray-800 font-mono text-sm" placeholder="Descreva os equipamentos ou ferramentas..." />
                </div>
                <div>
                    <label htmlFor="conferente" className="block text-sm font-medium mb-1">Conferido Por</label>
                    <select id="conferente" value={conferente} onChange={(e) => setConferente(e.target.value)} className="w-full p-2 border rounded bg-gray-100 dark:bg-gray-800">
                        {conferentes.map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                </div>
                <div>
                    <label htmlFor="retiradoPor" className="block text-sm font-medium mb-1">Retirado Por</label>
                    <input id="retiradoPor" type="text" disabled placeholder="Campo para assinatura manual no papel" className="w-full p-2 border rounded bg-gray-200 dark:bg-gray-700 cursor-not-allowed" />
                </div>

                <div className="flex items-center gap-4 pt-4">
                    <button onClick={handleCreate} className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 text-lg">
                        Gerar e Salvar Nota
                    </button>
                    <p className="text-sm">{status}</p>
                </div>
            </div>
        </main>
    );
}