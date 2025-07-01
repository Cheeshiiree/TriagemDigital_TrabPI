from flask import Flask, Response, request, jsonify
from flask_cors import CORS
import sqlite3
import json 
from sistema_especialista import classificar_prioridade

app = Flask(__name__)
app.config['JSON_SORT_KEYS'] = False
CORS(app)

def conectar_banco():
    return sqlite3.connect('banco.db', check_same_thread=False)

def criar_tabela():
    conn = conectar_banco()
    cursor = conn.cursor()
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS pacientes (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            nome TEXT NOT NULL,
            cpf TEXT NOT NULL UNIQUE,
            nascimento DATE NOT NULL,
            cep TEXT NULL,
            fone TEXT NULL,
            sexo TEXT CHECK (sexo IN ('masculino', 'feminino', 'outro', 'prefiro não informar'))
        );
    ''')
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS cids (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            codigo TEXT NOT NULL UNIQUE,
            descricao TEXT NOT NULL,
            gravidade_padrao INTEGER,
            sintomas_associados TEXT
        );
    ''')
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS sintomas_avulsos (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            nome TEXT NOT NULL UNIQUE,
            categoria TEXT NOT NULL
        );
    ''')
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS triagens (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            cpf TEXT NOT NULL,
            data_registro TEXT DEFAULT CURRENT_TIMESTAMP,
            motivo_consulta TEXT,
            observacoes TEXT,
            temperatura REAL,
            pressao TEXT,
            glicemia REAL,
            spo2 REAL,
            peso REAL,
            altura REAL,
            alergias TEXT,
            medicamentos_uso TEXT,
            diagnostico_cid TEXT,
            sintomas_registrados TEXT,
            classificacao_cor TEXT,
            classificacao_prioridade TEXT,
            classificacao_setor TEXT,
            classificacao_tempo_espera TEXT,
            FOREIGN KEY (cpf) REFERENCES pacientes(cpf)
        );
    ''')
    conn.commit()
    conn.close()

# Drop the old historico_sintomas table if it exists (for development/migration purposes)
# In a production environment, a proper migration strategy would be needed.
def dropar_tabela_antiga():
    conn = conectar_banco()
    cursor = conn.cursor()
    cursor.execute("DROP TABLE IF EXISTS historico_sintomas;")
    conn.commit()
    conn.close()

# Call this function once to drop the old table after creating new ones
dropar_tabela_antiga()


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
                """
                SELECT 
                    data_registro, motivo_consulta, observacoes, temperatura, pressao, glicemia, spo2, peso, altura, alergias, medicamentos_uso, diagnostico_cid, sintomas_registrados, classificacao_cor, classificacao_prioridade, classificacao_setor, classificacao_tempo_espera
                FROM triagens 
                WHERE cpf = ? 
                ORDER BY data_registro DESC
                """,
                (cpf_do_paciente,)
            )
            triagens_tuplas = cursor.fetchall()
            
            historico_triagens_formatado = []
            for triagem_registro in triagens_tuplas:
                historico_triagens_formatado.append({
                    'data_do_registro': triagem_registro[0],
                    'motivo_consulta': triagem_registro[1],
                    'observacoes': triagem_registro[2],
                    'sinais_vitais': {
                        'temperatura': triagem_registro[3],
                        'pressao': triagem_registro[4],
                        'glicemia': triagem_registro[5],
                        'spo2': triagem_registro[6],
                        'peso': triagem_registro[7],
                        'altura': triagem_registro[8]
                    },
                    'informacoes_adicionais': {
                        'alergias': triagem_registro[9],
                        'medicamentos_uso': triagem_registro[10]
                    },
                    'diagnostico_cid': triagem_registro[11],
                    'sintomas_registrados': json.loads(triagem_registro[12]),
                    'classificacao': {
                        'cor': triagem_registro[13],
                        'prioridade': triagem_registro[14],
                        'setor': triagem_registro[15],
                        'tempo_espera': triagem_registro[16]
                    }
                })

            paciente_dicionario = {
                'cpf': cpf_do_paciente,
                'nome': paciente_atual[1],
                'nascimento': paciente_atual[2],
                'sexo': paciente_atual[3],
                'telefone': paciente_atual[4], 
                'cep': paciente_atual[5],
                'historico_triagens': historico_triagens_formatado 
            }
            resultado_final.append(paciente_dicionario)

        conn.close()
        json_string = json.dumps(resultado_final, ensure_ascii=False, indent=2)
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

        if not all([cpf, nome, nascimento]):
            return jsonify({'erro': 'CPF, nome e data de nascimento do paciente são obrigatórios'}), 400

        conn = conectar_banco()
        cursor = conn.cursor()

        cursor.execute("SELECT * FROM pacientes WHERE cpf = ?", (cpf,))
        if cursor.fetchone():
            return jsonify({'erro': 'Paciente com este CPF já cadastrado.'}), 409 # Conflict
            
        cursor.execute("""
            INSERT INTO pacientes (cpf, nome, nascimento, cep, fone, sexo)
            VALUES (?, ?, ?, ?, ?, ?)
        """, (cpf, nome, nascimento, cep, telefone, sexo))

        conn.commit()
        conn.close()

        resposta_completa = {
            'mensagem': 'Paciente cadastrado com sucesso!',
            'dados_paciente': dados
        }
        
        return jsonify(resposta_completa), 201
    except Exception as err:
        return jsonify({'erro': str(err)}), 500

@app.route('/triagem', methods=['POST'])
def registrar_triagem():
    try:
        dados = request.json
        
        cpf = dados['paciente']['cpf']
        motivo_consulta = dados.get('motivoConsulta')
        observacoes = dados.get('observacoes')
        diagnostico_cid = dados.get('diagnosticoInicialCID')
        sintomas_registrados = json.dumps(dados.get('sintomas', []), ensure_ascii=False)
        data_registro = dados.get('dataHoraTriagem') # Captura a data e hora da triagem do frontend
        
        sinais_vitais = dados.get('sinaisVitais', {})
        temperatura = sinais_vitais.get('temperatura')
        pressao = sinais_vitais.get('pressao')
        glicemia = sinais_vitais.get('glicemia')
        spo2 = sinais_vitais.get('spo2')
        peso = sinais_vitais.get('peso')
        altura = sinais_vitais.get('altura')

        informacoes_adicionais = dados.get('informacoesAdicionais', {})
        alergias = informacoes_adicionais.get('alergias')
        medicamentos_uso = informacoes_adicionais.get('medicamentosUso')

        classificacao = classificar_prioridade(dados.get('paciente', {}), dados.get('sintomas', []), motivo_consulta)
        classificacao_cor = classificacao.get('cor')
        classificacao_prioridade = classificacao.get('prioridade')
        classificacao_setor = classificacao.get('setor')
        classificacao_tempo_espera = classificacao.get('tempo_espera')

        conn = conectar_banco()
        cursor = conn.cursor()

        # Verifica se o paciente já existe
        cursor.execute("SELECT cpf FROM pacientes WHERE cpf = ?", (cpf,))
        paciente_existente = cursor.fetchone()

        if not paciente_existente:
            # Se o paciente não existe, cadastra-o com os dados fornecidos na triagem
            nome = dados['paciente']['nome']
            nascimento = dados['paciente']['nascimento']
            sexo = dados['paciente']['sexo']
            cep = dados['paciente'].get('cep')
            telefone = dados['paciente'].get('telefone')
            peso = dados['paciente'].get('peso')
            altura = dados['paciente'].get('altura')

            cursor.execute("""
                INSERT INTO pacientes (cpf, nome, nascimento, sexo, cep, fone)
                VALUES (?, ?, ?, ?, ?, ?)
            """, (cpf, nome, nascimento, sexo, cep, telefone))
            conn.commit()

        cursor.execute("""
            INSERT INTO triagens (
                cpf, data_registro, motivo_consulta, observacoes, temperatura, pressao, glicemia, spo2, peso, altura,
                alergias, medicamentos_uso, diagnostico_cid, sintomas_registrados,
                classificacao_cor, classificacao_prioridade, classificacao_setor, classificacao_tempo_espera
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        """, (
            cpf, data_registro, motivo_consulta, observacoes, temperatura, pressao, glicemia, spo2, peso, altura,
            alergias, medicamentos_uso, diagnostico_cid, sintomas_registrados,
            classificacao_cor, classificacao_prioridade, classificacao_setor, classificacao_tempo_espera
        ))
        conn.commit()
        conn.close()

        return jsonify({'mensagem': 'Triagem registrada com sucesso!'}), 201
    except Exception as err:
        return jsonify({'erro': str(err)}), 500

@app.route('/cids', methods=['GET'])
def get_cids():
    try:
        conn = conectar_banco()
        cursor = conn.cursor()
        cursor.execute("SELECT id, codigo, descricao, gravidade_padrao, sintomas_associados FROM cids")
        cids = cursor.fetchall()
        conn.close()
        
        cids_list = []
        for cid in cids:
            sintomas = json.loads(cid[4]) if cid[4] else []
            cids_list.append({
                'id': cid[0],
                'codigo': cid[1],
                'descricao': cid[2],
                'gravidade_padrao': cid[3],
                'sintomas_associados': sintomas
            })
        return jsonify(cids_list), 200
    except Exception as err:
        return jsonify({'erro': str(err)}), 500

@app.route('/cids', methods=['POST'])
def add_cid():
    try:
        dados = request.json
        codigo = dados.get('codigo')
        descricao = dados.get('descricao')
        gravidade_padrao = dados.get('gravidade_padrao')
        sintomas_associados = json.dumps(dados.get('sintomas_associados', []), ensure_ascii=False)

        if not all([codigo, descricao]):
            return jsonify({'erro': 'Código e descrição do CID são obrigatórios.'}), 400

        conn = conectar_banco()
        cursor = conn.cursor()
        cursor.execute("INSERT INTO cids (codigo, descricao, gravidade_padrao, sintomas_associados) VALUES (?, ?, ?, ?)",
                       (codigo, descricao, gravidade_padrao, sintomas_associados))
        conn.commit()
        conn.close()
        return jsonify({'mensagem': 'CID adicionado com sucesso!'}), 201
    except sqlite3.IntegrityError:
        return jsonify({'erro': 'CID com este código já existe.'}), 409
    except Exception as err:
        return jsonify({'erro': str(err)}), 500

@app.route('/cids/<int:cid_id>', methods=['PUT'])
def update_cid(cid_id):
    try:
        dados = request.json
        codigo = dados.get('codigo')
        descricao = dados.get('descricao')
        gravidade_padrao = dados.get('gravidade_padrao')
        sintomas_associados = json.dumps(dados.get('sintomas_associados', []), ensure_ascii=False)

        if not all([codigo, descricao]):
            return jsonify({'erro': 'Código e descrição do CID são obrigatórios.'}), 400

        conn = conectar_banco()
        cursor = conn.cursor()
        cursor.execute("UPDATE cids SET codigo = ?, descricao = ?, gravidade_padrao = ?, sintomas_associados = ? WHERE id = ?",
                       (codigo, descricao, gravidade_padrao, sintomas_associados, cid_id))
        conn.commit()
        conn.close()
        if cursor.rowcount == 0:
            return jsonify({'erro': 'CID não encontrado.'}), 404
        return jsonify({'mensagem': 'CID atualizado com sucesso!'}), 200
    except sqlite3.IntegrityError:
        return jsonify({'erro': 'CID com este código já existe.'}), 409
    except Exception as err:
        return jsonify({'erro': str(err)}), 500

@app.route('/cids/<int:cid_id>', methods=['DELETE'])
def delete_cid(cid_id):
    try:
        conn = conectar_banco()
        cursor = conn.cursor()
        cursor.execute("DELETE FROM cids WHERE id = ?", (cid_id,))
        conn.commit()
        conn.close()
        if cursor.rowcount == 0:
            return jsonify({'erro': 'CID não encontrado.'}), 404
        return jsonify({'mensagem': 'CID excluído com sucesso!'}), 200
    except Exception as err:
        return jsonify({'erro': str(err)}), 500

@app.route('/sintomas', methods=['GET'])
def get_sintomas():
    try:
        conn = conectar_banco()
        cursor = conn.cursor()
        cursor.execute("SELECT id, nome, categoria FROM sintomas_avulsos")
        sintomas = cursor.fetchall()
        conn.close()
        
        sintomas_list = []
        for sintoma in sintomas:
            sintomas_list.append({
                'id': sintoma[0],
                'nome': sintoma[1],
                'categoria': sintoma[2]
            })
        return jsonify(sintomas_list), 200
    except Exception as err:
        return jsonify({'erro': str(err)}), 500

@app.route('/sintomas', methods=['POST'])
def add_sintoma():
    try:
        dados = request.json
        nome = dados.get('nome')
        categoria = dados.get('categoria')

        if not all([nome, categoria]):
            return jsonify({'erro': 'Nome e categoria do sintoma são obrigatórios.'}), 400

        conn = conectar_banco()
        cursor = conn.cursor()
        cursor.execute("INSERT INTO sintomas_avulsos (nome, categoria) VALUES (?, ?)",
                       (nome, categoria))
        conn.commit()
        conn.close()
        return jsonify({'mensagem': 'Sintoma adicionado com sucesso!'}), 201
    except sqlite3.IntegrityError:
        return jsonify({'erro': 'Sintoma com este nome já existe.'}), 409
    except Exception as err:
        return jsonify({'erro': str(err)}), 500

@app.route('/sintomas/<int:sintoma_id>', methods=['PUT'])
def update_sintoma(sintoma_id):
    try:
        dados = request.json
        nome = dados.get('nome')
        categoria = dados.get('categoria')

        if not all([nome, categoria]):
            return jsonify({'erro': 'Nome e categoria do sintoma são obrigatórios.'}), 400

        conn = conectar_banco()
        cursor = conn.cursor()
        cursor.execute("UPDATE sintomas_avulsos SET nome = ?, categoria = ? WHERE id = ?",
                       (nome, categoria, sintoma_id))
        conn.commit()
        conn.close()
        if cursor.rowcount == 0:
            return jsonify({'erro': 'Sintoma não encontrado.'}), 404
        return jsonify({'mensagem': 'Sintoma atualizado com sucesso!'}), 200
    except sqlite3.IntegrityError:
        return jsonify({'erro': 'Sintoma com este nome já existe.'}), 409
    except Exception as err:
        return jsonify({'erro': str(err)}), 500

@app.route('/sintomas/<int:sintoma_id>', methods=['DELETE'])
def delete_sintoma(sintoma_id):
    try:
        conn = conectar_banco()
        cursor = conn.cursor()
        cursor.execute("DELETE FROM sintomas_avulsos WHERE id = ?", (sintoma_id,))
        conn.commit()
        conn.close()
        if cursor.rowcount == 0:
            return jsonify({'erro': 'Sintoma não encontrado.'}), 404
        return jsonify({'mensagem': 'Sintoma excluído com sucesso!'}), 200
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
    dropar_tabela_antiga()
    criar_tabela()
    app.run(debug=True)