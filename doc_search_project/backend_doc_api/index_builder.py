import os
import sqlite3
import re

# Caminho para a pasta de dados e para o arquivo do banco de dados
# O script assume que a pasta 'data' está no mesmo nível que ele.
BASE_DIR = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'data')
DB_FILE = 'search_index.db'

def clean_word(word):
    """Limpa a palavra, removendo pontuações e convertendo para minúsculas."""
    return re.sub(r'[^\w]', '', word).lower()

def build_index():
    """Lê todos os arquivos .txt e constrói o índice no banco de dados SQLite."""
    # Conecta ao banco de dados que será criado na mesma pasta do script
    conn = sqlite3.connect(DB_FILE)
    cursor = conn.cursor()

    # (Re)Cria a tabela do índice para garantir que ela esteja sempre atualizada
    cursor.execute("DROP TABLE IF EXISTS inverted_index")
    cursor.execute("""
        CREATE TABLE inverted_index (
            word TEXT NOT NULL,
            filepath TEXT NOT NULL,
            PRIMARY KEY (word, filepath)
        )
    """)
    conn.commit()

    print("Iniciando a indexação de arquivos...")
    indexed_files = 0
    # Percorre recursivamente todas as pastas e arquivos dentro de BASE_DIR
    for root, _, files in os.walk(BASE_DIR):
        for file in files:
            if file.endswith('.txt'):
                filepath = os.path.join(root, file)
                # Cria um caminho relativo para usar no site e na API
                relative_path = os.path.relpath(filepath, BASE_DIR)
                
                try:
                    with open(filepath, 'r', encoding='utf-8', errors='ignore') as f:
                        content = f.read()
                        # Extrai palavras únicas do arquivo para otimizar
                        words = set(clean_word(word) for word in content.split() if clean_word(word))
                        
                        for word in words:
                            cursor.execute(
                                "INSERT OR IGNORE INTO inverted_index (word, filepath) VALUES (?, ?)",
                                (word, relative_path)
                            )
                except Exception as e:
                    print(f"Erro ao ler o arquivo {filepath}: {e}")
                
                indexed_files += 1
                if indexed_files % 100 == 0:
                    print(f"{indexed_files} arquivos indexados...")

    conn.commit()
    conn.close()
    print(f"\nIndexação concluída! {indexed_files} arquivos processados.")
    print(f"Banco de dados '{DB_FILE}' criado com sucesso na pasta do projeto.")

if __name__ == '__main__':
    build_index()