from flask import Flask, request, jsonify
import sqlite3

app = Flask(__name__)

# fazer funcao para conectar com sqlite
def conectar_banco():
    return sqlite3.connect('banco.db') 

# fazer funcao para criar tabela

# TABELA APENAS PARA TESTAR A API!!! 
def criar_tabela():
    conn = conectar_banco()
    cursor = conn.cursor()

    cursor.execute('''
        CREATE TABLE IF NOT EXISTS pacientes (
            cpf TEXT PRIMATY KEY,
            nome TEXT NOT NULL,
            nascimento TEXT NO NULL,
            cep TEXT NOT NULL
        )
    ''')

    conn.commit()
    conn.close()

# rotas
@app.route('/')
def home():
    return 'testando api em python flask'

# listar pacientes -> acessar isso apenas em um testador de api
@app.route('/pacientes', methods=['GET'])
def listar_pacientes():
    try:
        conn = conectar_banco()
        cursor = conn.cursor()

        cursor.execute("SELECT cpf, nome, nascimento, cep FROM pacientes")
        pacientes = cursor.fetchall()
        conn.close()

        lista_pacientes = []
        for paciente in pacientes:
            lista_pacientes.append({
                'cpf': paciente[0],
                'nome': paciente[1],
                'nascimento': paciente[2],
                'cep': paciente[3]
            })
        return jsonify(lista_pacientes)

    except Exception as err:
        return jsonify({'erro':str(err)}), 500

# endpoint /paciente -> cadastro de um paciente novo
@app.route('/paciente', methods=['POST'])
def cadastrar_paciente():
    try: 
        dados = request.json
        cpf = dados.get('cpf')
        nome = dados.get('nome')
        nascimento = dados.get('nascimento')
        cep = dados.get('cep')
        # sintomas = dados.get('sintomas')

        conn = conectar_banco()
        cursor = conn.cursor()

        cursor.execute("SELECT * FROM pacientes WHERE cpf = ?", (cpf,))
        if cursor.fetchone():
            conn.close()
            return jsonify({'mensagem': 'paciente já cadastrado.'}), 400
        
        cursor.execute("""
                INSERT INTO pacientes (cpf, nome, nascimento, cep)
                VALUES (?, ?, ?, ?)
        """, (cpf, nome, nascimento, cep))

        # gravidade = sistema_especialista(sintomas) -> manda os sintomas para o S.E

        # ver se vai colocar os sintomas no banco de dados

        conn.commit()
        conn.close()

        return jsonify({'message': 'paciente cadastrado com sucesso'})
        # precisa retornar a gravidade tambem {'gravidade': gravidade}

    except Exception as err:
        return jsonify({'erro': str(err)}), 500


# endpoint /paciente/<cpf> -> busca do paciente pelo cpf 
@app.route('/paciente/<cpf>', methods=['GET'])
def buscar_pacinte_cpf(cpf):
    try:
        conn = conectar_banco()
        cursor = conn.cursor()

        cursor.execute("SELECT cpf, nome, nascimento, cep FROM pacientes WHERE cpf = ?", (cpf,))
        paciente = cursor.fetchall()
        conn.close()

        if paciente:
            return jsonify({
                'cpf': paciente[0],
                'nome': paciente[1],
                'nascimento': paciente[2],
                'cep': paciente[3]
            })
        else:
            return jsonify({'erro': 'paciente não encontrado'}), 404

    except Exception as err:
        return jsonify({'erro': str(err)}), 500

# endpoint /sintomas -> pacientes ja cadastrados, apenas enviar os sintomas
@app.route('/sintomas', methods=['POST'])
def registrar_sintomas():
    try:
        dados = request.json
        cpf = dados.get('cpf')
        sintomas = dados.get('sintomas')

        if not cpf or not sintomas:
            return jsonify({'erro': 'cpf e sintomas são obrigatórios'}), 400

        conn = conectar_banco()
        cursor = conn.cursor()

        cursor.execute("SELECT * FROM pacientes WHERE cpf = ?", (cpf,))
        paciente = cursor.fetchone()

        if not paciente:
            return jsonify({'erro': 'paciente com esse cpf não cadastrado'}), 404

        # gravidade = sistema_especialista(sintomas)

        # salvas os novos sintomas no historico do paciente conforme vermos oq fazer no db

        conn.commit()
        conn.close()

        return jsonify({
            'message': 'sintomas registrados com sucesso',
            # 'gravidade': gravidade
        })
    
    except Exception as err:
        return jsonify({'error': str(err)}), 500


if __name__ == '__main__':
    criar_tabela()
    app.run(debug=True)