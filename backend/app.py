from flask import Flask, request, jsonify
import sqlite3

app = Flask(__name__) # inicializa o flask na variavel app

# fazer funcao para conectar com sqlite
def conectar_banco():
    return sqlite3.connect('banco.db') 

# fazer funcao para criar tabela

# rotas
@app.route('/')
def home():
    return 'testando api em python flask'

# listar pacientes para teste
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
        sintomas = dados.get('sintomas')

        conn = conectar_banco()
        cursor = conn.cursor()

        cursor.execute("SELECT * FROM pacientes WHERE cpf = ?", (cpf,))
        if cursor.fetchone():
            conn.close()
            return jsonify({'mensagem': 'paciente já cadastrado.'}), 400
        
        cursor.execute("""
                INSERT INTO pacientes (cpf, nome, nascimento, cep)
                VALUES (?, ?, ?, ?)""", (cpf, nome, nascimento, cep))

        # gravidade = sistema_especialista(sintomas) -> manda os sintomas para o S.E

        # ver se vai colocar os sintomas no banco de dados

        conn.commit()
        conn.close()

        return jsonify({'message': 'paciente cadastrado com sucesso'})

    except Exception as err:
        return jsonify({'erro': str(err)}), 500


# endpoint /paciente/<cpf> -> busca do paciente pelo cpf 

# endpoint /sintomas -> pacientes ja cadastrados, apenas enviar os sintomas

if __name__ == '__main__':
    app.run(debug=True)