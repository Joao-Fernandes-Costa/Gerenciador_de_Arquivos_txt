# Gerenciador de Notas de Técnicos

Este projeto é um sistema web completo para criar, visualizar, buscar e editar notas de serviço para técnicos de campo. Ele foi desenvolvido para centralizar todas as notas em um único local, com uma busca rápida por conteúdo e uma organização por pastas de técnico.

## Funcionalidades

* **Navegador de Arquivos:** Explore as notas organizadas em pastas por técnico.
* **Criação Inteligente de Notas:** Um formulário dedicado para criar notas padronizadas, diferenciando entre "Equipamentos" e "Ferramental".
* **Busca Rápida:** Encontre notas rapidamente pesquisando por qualquer palavra contida nelas.
* **Edição de Notas:** Modifique o conteúdo das notas existentes diretamente pela interface web.
* **Acesso via Rede Local:** Configure o sistema para ser acessado por outros dispositivos na mesma rede.

## Tecnologias Utilizadas

* **Backend:** Python 3, Flask
* **Frontend:** Next.js, React, TypeScript, Tailwind CSS
* **Banco de Dados (para busca):** SQLite
* **Automação:** Script de Lote do Windows (`.bat`)

## Pré-requisitos

Antes de começar, garanta que você tenha os seguintes softwares instalados na sua máquina:

* [Python (versão 3.8 ou superior)](https://www.python.org/downloads/)
* [Node.js (versão 18 ou superior)](https://nodejs.org/en/) (que já inclui o `npm`)

## Instalação e Configuração

Siga estes passos para configurar o ambiente de desenvolvimento.

### 1. Configuração do Backend (API)

O backend é responsável por toda a lógica de arquivos.

1.  **Navegue até a pasta do backend:**
    ```bash
    cd backend_doc_api
    ```

2.  **Crie o arquivo de dependências (se não existir):**
    Crie um arquivo chamado `requirements.txt` e adicione o seguinte conteúdo a ele:
    ```
    Flask
    Flask-Cors
    ```

3.  **Instale as dependências do Python:**
    ```bash
    pip install -r requirements.txt
    ```

4.  **Adicione seus arquivos:**
    Coloque todos os seus arquivos de texto (`.txt`) e pastas dentro do diretório `backend_doc_api/data/`. O sistema lerá tudo que estiver aqui.

### 2. Configuração do Frontend

O frontend é a interface visual que você acessa no navegador.

1.  **Navegue até a pasta do frontend:**
    (Lembre-se que o projeto foi criado em uma subpasta)
    ```bash
    cd frontend-doc-search\frontend-doc-search
    ```

2.  **Instale as dependências do Node.js:**
    ```bash
    npm install
    ```

### 3. (Opcional) Configuração para Acesso na Rede Local

Se você quiser que outros dispositivos na mesma rede (Wi-Fi) acessem o site, você precisa fazer uma alteração crucial.

1.  **Descubra o IP do seu computador** na sua rede local (ex: `192.168.0.104`).
2.  No projeto do frontend, procure e substitua todas as ocorrências de `http://127.0.0.1:5000` por `http://SEU_IP_DE_REDE:5000`.
3.  Os principais arquivos a serem alterados são:
    * `app/browse/[[...slug]]/page.tsx`
    * `app/create/page.tsx`
    * `app/edit/[[...slug]]/page.tsx`
    * `app/search/page.tsx`

## Como Executar a Aplicação

### Método Recomendado (Script Automático)

A forma mais fácil de iniciar o projeto é usando o script automatizado.

1.  Vá para a pasta raiz do projeto (`doc_search_project`).
2.  Dê um **clique duplo** no arquivo `iniciar_tudo.bat`.

Isso irá automaticamente:
* Reconstruir o índice de busca para garantir que todos os arquivos sejam encontrados.
* Iniciar o servidor do backend em uma janela.
* Iniciar o servidor do frontend em outra janela.

### Método Manual (Dois Terminais)

Se preferir, você pode iniciar cada parte manualmente. Você precisará de **dois terminais**.

* **No Terminal 1 (Backend):**
    ```bash
    cd backend_doc_api
    python app.py
    ```

* **No Terminal 2 (Frontend):**
    ```bash
    cd frontend-doc-search\frontend-doc-search
    npm run dev
    ```

## Como Usar o Site

1.  Após iniciar os servidores, abra seu navegador.
2.  Acesse **`http://localhost:3000`** para ver a página inicial.
3.  Acesse **`http://localhost:3000/browse`** para navegar pelos arquivos e pastas.

## Manutenção

Lembre-se: o script `iniciar_tudo.bat` já atualiza o índice de busca automaticamente a cada inicialização. Se você adicionar, modificar ou deletar arquivos na pasta `data` com o sistema já rodando, a busca pode ficar desatualizada. Para corrigir, você pode simplesmente reiniciar tudo com o script `iniciar_tudo.bat` ou rodar manualmente o comando `python index_builder.py` na pasta do backend.
