@echo off
title Painel de Controle dos Servidores

echo.
echo ======================================================
echo    INICIANDO PROJETO GERENCIADOR DE NOTAS
echo ======================================================
echo.

REM --- PASSO 1: ATUALIZAR O INDICE DE BUSCA ---
echo [1/3] Reconstruindo o indice de busca... Por favor, aguarde.
cd backend_doc_api
python index_builder.py
cd ..
echo      INDICE ATUALIZADO!
echo.

REM --- PASSO 2: INICIAR O SERVIDOR BACKEND ---
echo [2/3] Iniciando servidor Backend (Python/Flask)...
start "Servidor Backend" cmd /k "cd backend_doc_api && python app.py"
echo.

REM --- PASSO 3: INICIAR O SERVIDOR FRONTEND ---
echo [3/3] Iniciando servidor Frontend (Next.js)...
timeout /t 3 > nul
start "Servidor Frontend" cmd /k "cd frontend-doc-search && npm run dev"

echo.
echo ======================================================
echo      TODOS OS SERVICOS FORAM INICIADOS!
echo ======================================================
echo.
echo Esta janela pode ser fechada.
pause