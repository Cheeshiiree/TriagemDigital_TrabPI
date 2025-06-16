from flask import Flask, request, jsonify
import sqlite3
from sistema_especialista import avaliar_sintomas

app = Flask(__name__)

def conectar_banco():
    return sqlite3.connect('banco.db', timeout=10) 

def criar_tabela():
    conn = conectar_banco()
    cursor = conn.cursor()

    cursor.execute('''
        CREATE TABLE IF NOT EXISTS pacientes (
            cpf TEXT PRIMARY KEY,
            nome TEXT NOT NULL,
            nascimento TEXT NOT NULL,
            cep TEXT NOT NULL
        )
    ''')

    cursor.execute('''
        CREATE TABLE IF NOT EXISTS historico_sintomas (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            cpf TEXT NOT NULL,
            sintomas TEXT NOT NULL,
            data TEXT DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (cpf) REFERENCES pacientes(cpf)
        )
    ''')

    conn.commit()
    conn.close()

@app.route('/')
def home():
    return 'API do Sistema de Triagem está funcionando!'

@app.route('/pacientes', methods=['GET'])
def listar_pacientes():
    try:
        conn = conectar_banco()
        cursor = conn.cursor()
        cursor.execute("SELECT cpf, nome, nascimento, cep FROM pacientes")
        pacientes = cursor.fetchall()
        conn.close()

        lista_pacientes = [
            {'cpf': p[0], 'nome': p[1], 'nascimento': p[2], 'cep': p[3]}
            for p in pacientes
        ]
        return jsonify(lista_pacientes)

    except Exception as err:
        return jsonify({'erro': str(err)}), 500

@app.route('/paciente', methods=['POST'])
def cadastrar_paciente():
    try: 
        dados = request.json
        cpf = dados.get('cpf')
        nome = dados.get('nome')
        nascimento = dados.get('nascimento')
        cep = dados.get('cep')

        if not all([cpf, nome, nascimento, cep]):
            return jsonify({'erro': 'Todos os campos (cpf, nome, nascimento, cep) são obrigatórios'}), 400

        conn = conectar_banco()
        cursor = conn.cursor()

        cursor.execute("SELECT * FROM pacientes WHERE cpf = ?", (cpf,))
        if cursor.fetchone():
            conn.close()
            return jsonify({'mensagem': 'Paciente com este CPF já está cadastrado.'}), 409

        cursor.execute("""
            INSERT INTO pacientes (cpf, nome, nascimento, cep)
            VALUES (?, ?, ?, ?)
        """, (cpf, nome, nascimento, cep))

        conn.commit()
        conn.close()

        return jsonify({'mensagem': 'Paciente cadastrado com sucesso'}), 201

    except Exception as err:
        return jsonify({'erro': str(err)}), 500

@app.route('/paciente/<string:cpf>', methods=['GET'])
def buscar_paciente_cpf(cpf):
    try:
        conn = conectar_banco()
        cursor = conn.cursor()

        cursor.execute("SELECT cpf, nome, nascimento, cep FROM pacientes WHERE cpf = ?", (cpf,))
        paciente = cursor.fetchone()

        if not paciente:
            conn.close()
            return jsonify({'erro': 'Paciente não encontrado'}), 404

        cursor.execute("""
            SELECT sintomas, data FROM historico_sintomas
            WHERE cpf = ? ORDER BY data DESC
        """, (cpf,))
        sintomas_historico = cursor.fetchall()
        conn.close()

        lista_sintomas = [
            {"sintomas": s[0], "data": s[1]} for s in sintomas_historico
        ]

        return jsonify({
            'cpf': paciente[0],
            'nome': paciente[1],
            'nascimento': paciente[2],
            'cep': paciente[3],
            'historico': lista_sintomas
        })

    except Exception as err:
        return jsonify({'erro': str(err)}), 500

@app.route('/sintomas', methods=['POST'])
def registrar_sintomas():
    try:
        dados = request.json
        cpf = dados.get('cpf')
        sintomas = dados.get('sintomas')
        print(f"DEBUG [API Rota /sintomas]: Recebido CPF={cpf}, Sintomas='{sintomas}'")

        if not cpf or not sintomas:
            return jsonify({'erro': 'Os campos "cpf" e "sintomas" são obrigatórios'}), 400

        conn = conectar_banco()
        cursor = conn.cursor()

        cursor.execute("SELECT * FROM pacientes WHERE cpf = ?", (cpf,))
        if not cursor.fetchone():
            conn.close()
            return jsonify({'erro': 'Paciente com este CPF não está cadastrado'}), 404
        
        resultado_triagem = avaliar_sintomas(sintomas)

        cursor.execute("INSERT INTO historico_sintomas (cpf, sintomas) VALUES (?, ?)", (cpf, sintomas))
        conn.commit()
        conn.close()

        return jsonify({
            'mensagem': 'Sintomas registrados com sucesso',
            'resultado_triagem': resultado_triagem
        })
    
    except Exception as err:
        return jsonify({'erro': str(err)}), 500


if __name__ == '__main__':
    criar_tabela()
    app.run(debug=True, port=5000)