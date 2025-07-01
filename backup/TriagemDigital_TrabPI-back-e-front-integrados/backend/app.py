from flask import Flask, Response, request, jsonify
from flask_cors import CORS
import sqlite3
import json 

app = Flask(__name__)
app.config['JSON_SORT_KEYS'] = False
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
    return 'SISTEMA DE TRIAGEM ON'

@app.route('/pacientes', methods=['GET'])
def listar_pacientes():
    try:
        conn = conectar_banco()
        cursor = conn.cursor()

        cursor.execute("SELECT cpf, nome, nascimento, sexo, fone, cep FROM pacientes")
        lista_de_pacientes_tuplas = cursor.fetchall()
        
        resultado_final = []

        for paciente_atual in lista_de_pacientes_tuplas:
            
            cpf_do_paciente = paciente_atual[0] 

            cursor.execute(
                "SELECT sintomas, data FROM historico_sintomas WHERE cpf = ? ORDER BY data DESC",
                (cpf_do_paciente,)
            )
            historico_tuplas = cursor.fetchall()
            
            historico_formatado = []
            for registro in historico_tuplas:
                historico_formatado.append({
                    'data_do_registro': registro[1],
                    'sintomas_registrados': json.loads(registro[0])
                })

            paciente_dicionario = {
                'cpf': cpf_do_paciente,
                'nome': paciente_atual[1],
                'nascimento': paciente_atual[2],
                'sexo': paciente_atual[3],
                'telefone': paciente_atual[4], 
                'cep': paciente_atual[5],
                'historico_sintomas': historico_formatado 
            }

            resultado_final.append(paciente_dicionario)

        conn.close()

        json_string = json.dumps(
            resultado_final, 
            ensure_ascii=False, 
            indent=2            
        )
        
        return Response(json_string, mimetype='application/json; charset=utf-8'), 200

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
        sintomas = dados.get('sintomas', []) 

        if not all([cpf, nome, nascimento, cep, telefone, sexo]):
            return jsonify({'erro': 'Todos os campos de paciente são obrigatórios'}), 400

        conn = conectar_banco()
        cursor = conn.cursor()

        cursor.execute("SELECT * FROM pacientes WHERE cpf = ?", (cpf,))
        if not cursor.fetchone():
            cursor.execute("""
                INSERT INTO pacientes (cpf, nome, nascimento, cep, fone, sexo)
                VALUES (?, ?, ?, ?, ?, ?)
            """, (cpf, nome, nascimento, cep, telefone, sexo))

        if sintomas:
            sintomas_em_texto = json.dumps(sintomas, ensure_ascii=False)
            cursor.execute("""
                INSERT INTO historico_sintomas (cpf, sintomas)
                VALUES (?, ?)
            """, (cpf, sintomas_em_texto))

        conn.commit()
        conn.close()

        return jsonify({'mensagem': 'Operação realizada com sucesso!'}), 201

    except Exception as err:
        return jsonify({'erro': str(err)}), 500

@app.route('/paciente/<cpf>', methods=['GET'])
def buscar_paciente_cpf(cpf):
    try:
        conn = conectar_banco()
        cursor = conn.cursor()

        cursor.execute("SELECT cpf, nome, nascimento, cep, fone, sexo FROM pacientes WHERE cpf = ?", (cpf,))
        paciente = cursor.fetchone()
        conn.close()

        if not paciente:
            return jsonify({'erro': 'Paciente não encontrado'}), 404

        return jsonify({
            'cpf': paciente[0],
            'nome': paciente[1],
            'nascimento': paciente[2],
            'cep': paciente[3],
            'telefone': paciente[4],
            'sexo': paciente[5]
        }), 200

    except Exception as err:
        return jsonify({'erro': str(err)}), 500


if __name__ == '__main__':
    criar_tabela()
    app.run(debug=True)