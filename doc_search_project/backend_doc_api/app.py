import os
import re
import sqlite3
from flask import Flask, jsonify, request, abort
from flask_cors import CORS # Importar o CORS

app = Flask(__name__)
# Habilita o CORS para permitir requisições do nosso frontend
CORS(app) 

BASE_DIR = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'data')
DB_FILE = 'search_index.db'

def get_db_connection():
    # Garante que o banco de dados está no caminho certo
    db_path = os.path.join(os.path.dirname(os.path.abspath(__file__)), DB_FILE)
    conn = sqlite3.connect(db_path)
    conn.row_factory = sqlite3.Row
    return conn

@app.route('/api/browse/')
@app.route('/api/browse/<path:subpath>')
def api_browse(subpath=''):
    current_path = os.path.join(BASE_DIR, subpath)
    if not os.path.normpath(current_path).startswith(os.path.normpath(BASE_DIR)):
        abort(404)

    if not os.path.exists(current_path) or not os.path.isdir(current_path):
        return jsonify({"error": "Path not found"}), 404

    items = []
    with os.scandir(current_path) as it:
        for entry in it:
            is_dir = entry.is_dir()
            if is_dir or entry.name.endswith('.txt'):
                items.append({'name': entry.name, 'is_dir': is_dir})
    
    items.sort(key=lambda x: (not x['is_dir'], x['name'].lower()))

    # Retorna os dados em formato JSON
    return jsonify({
        "path": subpath,
        "items": items
    })



@app.route('/api/search')
def api_search():
    query = request.args.get('q', '')
    final_results = []
    
    if query:
        conn = get_db_connection()
        
        # 1. Limpa e quebra a pesquisa em palavras individuais
        #    Ex: "JONATAS DA SILVA" -> ['jonatas', 'da', 'silva']
        search_words = [re.sub(r'[^\w]', '', word).lower() for word in query.split() if word]
        
        if search_words:
            # Lista para guardar os conjuntos de arquivos encontrados para cada palavra
            list_of_filepath_sets = []

            for word in search_words:
                cursor = conn.execute("SELECT filepath FROM inverted_index WHERE word = ?", (word,))
                # Guarda os resultados para esta palavra em um "set" para facilitar a intersecção
                filepaths = set(row['filepath'] for row in cursor.fetchall())
                if not filepaths:
                    # Se qualquer uma das palavras não for encontrada, nenhum arquivo pode conter todas elas.
                    # Limpa a lista e para a busca.
                    list_of_filepath_sets = []
                    break
                list_of_filepath_sets.append(filepaths)

            if list_of_filepath_sets:
                # 2. Encontra a intersecção: arquivos que estão em TODOS os sets de resultados
                #    Isso garante que o arquivo contém TODAS as palavras pesquisadas.
                intersected_results = set.intersection(*list_of_filepath_sets)
                final_results = sorted(list(intersected_results))

        conn.close()

    return jsonify({"query": query, "results": final_results})

@app.route('/api/view/<path:filepath>')
def api_view_file(filepath):
    # Esta rota pode continuar retornando texto puro, o que é mais simples
    abs_path = os.path.join(BASE_DIR, filepath)
    if not os.path.normpath(abs_path).startswith(os.path.normpath(BASE_DIR)):
        abort(403)
    
    try:
        with open(abs_path, 'r', encoding='utf-8', errors='ignore') as f:
            content = f.read()
        return jsonify({"filepath": filepath, "content": content})
    except FileNotFoundError:
        return jsonify({"error": "File not found"}), 404
# Adicione esta nova rota ao seu arquivo app.py

@app.route('/api/file/update', methods=['POST'])
def api_update_file():
    # Pega os dados enviados pelo frontend (esperamos um JSON)
    data = request.get_json()
    
    if not data or 'filepath' not in data or 'content' not in data:
        return jsonify({"error": "Dados inválidos. 'filepath' e 'content' são necessários."}), 400

    filepath = data['filepath']
    content = data['content']
    
    # Medida de segurança crucial para evitar que se escreva fora da pasta 'data'
    abs_path = os.path.join(BASE_DIR, filepath)
    if not os.path.normpath(abs_path).startswith(os.path.normpath(BASE_DIR)):
        return jsonify({"error": "Acesso negado."}), 403

    try:
        # Abre o arquivo em modo de escrita ('w'), que sobrescreve o conteúdo antigo
        with open(abs_path, 'w', encoding='utf-8') as f:
            f.write(content)
        
        # IMPORTANTE: Após salvar, o índice de busca fica desatualizado.
        # Por enquanto, vamos apenas notificar o usuário. Mais tarde podemos automatizar isso.
        return jsonify({"success": True, "message": "Arquivo salvo com sucesso. Lembre-se de reindexar para a busca funcionar."})
    except Exception as e:
        return jsonify({"error": f"Não foi possível salvar o arquivo: {str(e)}"}), 500
if __name__ == '__main__':
    # Rodando na porta 5000
    app.run(host='0.0.0.0', port=5000, debug=True)