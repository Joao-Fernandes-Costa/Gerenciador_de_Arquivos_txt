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
    results = []
    if query:
        conn = get_db_connection()
        search_word = re.sub(r'[^\w]', '', query).lower()
        cursor = conn.execute("SELECT DISTINCT filepath FROM inverted_index WHERE word = ?", (search_word,))
        results = sorted([row['filepath'] for row in cursor.fetchall()])
        conn.close()

    return jsonify({"query": query, "results": results})

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

if __name__ == '__main__':
    # Rodando na porta 5000
    app.run(host='0.0.0.0', port=5000, debug=True)