from flask import Flask, request, jsonify
from flask_cors import CORS
import sqlite3

app = Flask(__name__)
CORS(app)

def conectar_banco():
    return sqlite3.connect('banco.db') 

def criar_tabela():
    conn = conectar_banco()
    cursor = conn.cursor()

    cursor.execute('''
        CREATE TABLE IF NOT EXISTS pacientes (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            nome TEXT NOT NULL,
            cpf TEXT NOT NULL UNIQUE,
            nascimento DATE NOT NULL,
            cep TEXT NOT NULL,
            fone TEXT NOT NULL,
            sexo TEXT CHECK (sexo IN ('masculino', 'feminino', 'outro', 'prefiro não informar')) NOT NULL
        );
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
    return 'testando api em python flask'

@app.route('/pacientes', methods=['GET'])
def listar_pacientes():
    try:
        conn = conectar_banco()
        cursor = conn.cursor()

        cursor.execute("SELECT cpf, nome, nascimento, cep, fone, sexo FROM pacientes")
        pacientes = cursor.fetchall()
        conn.close()

        lista_pacientes = []
        for paciente in pacientes:
            lista_pacientes.append({
                'cpf': paciente[0],
                'nome': paciente[1],
                'nascimento': paciente[2],
                'cep': paciente[3],
                'telefone': paciente[4],
                'sexo': paciente[5]
            })
        return jsonify(lista_pacientes), 200

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
        telefone = dados.get('telefone')
        sexo = dados.get('sexo')

        if not cpf or not nome or not nascimento or not cep or not telefone or not sexo:
            return jsonify({'erro': 'Todos os campos são obrigatórios'}), 400

        conn = conectar_banco()
        cursor = conn.cursor()

        cursor.execute("SELECT * FROM pacientes WHERE cpf = ?", (cpf,))
        if cursor.fetchone():
            conn.close()
            return jsonify({'mensagem': 'Paciente já cadastrado.'}), 400
        
        cursor.execute("""
            INSERT INTO pacientes (cpf, nome, nascimento, cep, fone, sexo)
            VALUES (?, ?, ?, ?, ?, ?)
        """, (cpf, nome, nascimento, cep, telefone, sexo))

        conn.commit()
        conn.close()

        return jsonify({'mensagem': 'Paciente cadastrado com sucesso'}), 201

    except Exception as err:
        return jsonify({'erro': str(err)}), 500

@app.route('/paciente/<cpf>', methods=['GET'])
def buscar_paciente_cpf(cpf):
    try:
        conn = conectar_banco()
        cursor = conn.cursor()

        cursor.execute("SELECT cpf, nome, nascimento, cep, fone, sexo FROM pacientes WHERE cpf = ?", (cpf,))
        paciente = cursor.fetchone()

        if not paciente:
            conn.close()
            return jsonify({'erro': 'Paciente não encontrado'}), 404

        cursor.execute("""
            SELECT sintomas, data FROM historico_sintomas
            WHERE cpf = ?
            ORDER BY data DESC
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
            'telefone': paciente[4],
            'sexo': paciente[5],
            'sintomas': lista_sintomas
        }), 200

    except Exception as err:
        return jsonify({'erro': str(err)}), 500

@app.route('/sintomas', methods=['POST'])
def registrar_sintomas():
    try:
        dados = request.json
        cpf = dados.get('cpf')
        sintomas = dados.get('sintomas')

        if not cpf or not sintomas:
            return jsonify({'erro': 'CPF e sintomas são obrigatórios'}), 400

        conn = conectar_banco()
        cursor = conn.cursor()

        cursor.execute("SELECT * FROM pacientes WHERE cpf = ?", (cpf,))
        paciente = cursor.fetchone()

        if not paciente:
            conn.close()
            return jsonify({'erro': 'Paciente com esse CPF não cadastrado'}), 404

        cursor.execute("""
            INSERT INTO historico_sintomas (cpf, sintomas)
            VALUES (?, ?)
        """, (cpf, sintomas))

        conn.commit()
        conn.close()

        return jsonify({'mensagem': 'Sintomas registrados com sucesso'}), 201
    
    except Exception as err:
        return jsonify({'erro': str(err)}), 500


if __name__ == '__main__':
    criar_tabela()
    app.run(debug=True)
