@echo off
REM Define o título da janela principal do CMD
title Painel de Controle dos Servidores

echo.
echo ======================================================
echo    INICIANDO SERVIDORES DO PROJETO GERENCIADOR
echo ======================================================
echo.

echo Iniciando servidor Backend (Python/Flask)...
REM O comando "start" abre uma nova janela do CMD.
REM O /k faz com que a janela permaneça aberta após o comando.
start "Servidor Backend" cmd /k "cd backend_doc_api && python app.py"

echo.
echo Iniciando servidor Frontend (Next.js)...
REM Espera 5 segundos para dar tempo ao backend de iniciar primeiro.
timeout /t 5 > nul
start "Servidor Frontend" cmd /k "cd frontend-doc-search && npm run dev"

echo.
echo Servidores foram iniciados em novas janelas.
echo Esta janela pode ser fechada.
echo.
pause