import sqlite3
import json
from datetime import datetime, timedelta

def conectar_banco():
    return sqlite3.connect('banco.db', check_same_thread=False)

def popular_banco_de_dados():
    conn = conectar_banco()
    cursor = conn.cursor()

    # Limpar tabelas existentes para garantir um estado limpo para os testes
    cursor.execute("DELETE FROM triagens;")
    cursor.execute("DELETE FROM cids;")
    cursor.execute("DELETE FROM sintomas_avulsos;")
    cursor.execute("DROP TABLE IF EXISTS pacientes;") # Garante que a tabela pacientes seja recriada com o esquema atualizado
    conn.commit()

    # Recriar tabelas (necessário após DROP TABLE)
    from app import criar_tabela
    criar_tabela()

    print("Tabelas limpas e recriadas.")

    print("Tabelas limpas.")

    # Inserir pacientes de exemplo
    pacientes_data = [
        ("11122233344", "Maria Silva", "1985-03-15", "12345-678", "11987654321", "feminino"),
        ("55566677788", "João Santos", "1990-07-20", "87654-321", "21998765432", "masculino"),
        ("99988877766", "Ana Souza", "2000-01-01", "54321-098", "31987651234", "feminino"),
        ("12345678900", "Paciente Emergencia", "2000-01-01", None, None, None) # Paciente para teste de emergência
    ]
    cursor.executemany("INSERT INTO pacientes (cpf, nome, nascimento, cep, fone, sexo) VALUES (?, ?, ?, ?, ?, ?)", pacientes_data)
    conn.commit()
    print("Pacientes de exemplo inseridos.")

    # Inserir CIDs de exemplo
    cids_data = [
        ("J11", "Gripe (Influenza)", 5, ["Tosse", "Febre", "Dor de Garganta"]),
        ("K29", "Gastrite", 6, ["Dor Abdominal", "Náusea", "Vômito"]),
        ("R51", "Cefaleia (Dor de Cabeça)", 7, ["Dor de Cabeça", "Tontura"]),
        ("I10", "Hipertensão Essencial", 4, ["Dor de Cabeça", "Tontura", "Palpitações"]),
        ("A09", "Diarreia e gastroenterite de origem infecciosa presumível", 6, ["Diarreia", "Dor Abdominal", "Febre"]),
        ("J02.9", "Faringite aguda não especificada", 4, ["Dor de Garganta", "Dificuldade para Engolir", "Febre"]),
        ("M79.1", "Mialgia", 3, ["Dor Muscular", "Cansaço", "Mal-estar Geral"]),
        ("N39.0", "Infecção do trato urinário, de localização não especificada", 5, ["Dor ao Urinar", "Aumento da Frequência Urinária", "Febre"]),
        ("L20", "Dermatite atópica", 2, ["Coceira", "Irritação na Pele", "Manchas na Pele"]),
        ("G43", "Enxaqueca", 8, ["Dor de Cabeça Intensa", "Náusea", "Sensibilidade à Luz"])
    ]
    for cid in cids_data:
        cursor.execute("INSERT INTO cids (codigo, descricao, gravidade_padrao, sintomas_associados) VALUES (?, ?, ?, ?)",
                       (cid[0], cid[1], cid[2], json.dumps(cid[3])))
    conn.commit()
    print("CIDs de exemplo inseridos.")

    # Inserir sintomas avulsos de exemplo
    sintomas_avulsos_data = [
        ("Dor no Peito", "Dor"),
        ("Falta de Ar", "Respiratório"),
        ("Hemorragia", "Outros"),
        ("Fraturas", "Outros"),
        ("Perda de Consciência", "Neurológico"),
        ("Parada Cardíaca", "Outros")
    ]
    cursor.executemany("INSERT INTO sintomas_avulsos (nome, categoria) VALUES (?, ?)", sintomas_avulsos_data)
    conn.commit()
    print("Sintomas avulsos de exemplo inseridos.")

    # Inserir triagens de exemplo
    # Triagem para Maria Silva (Amarelo - Urgente)
    data_registro_maria = (datetime.now() - timedelta(days=1)).isoformat()
    triagem_maria = {
        "paciente": {"cpf": "11122233344"},
        "motivoConsulta": "Dor de cabeça forte e febre",
        "observacoes": "Paciente relatou sensibilidade à luz.",
        "diagnosticoInicialCID": "R51 - Cefaleia (Dor de Cabeça)",
        "sintomas": [
            {"nome": "Dor de Cabeça", "gravidade": 8},
            {"nome": "Febre", "gravidade": 7},
            {"nome": "Sensibilidade à Luz", "gravidade": 6}
        ],
        "sinaisVitais": {"temperatura": 38.5, "pressao": "130/85", "glicemia": 95, "spo2": 98, "peso": 65, "altura": 160},
        "informacoesAdicionais": {"alergias": "Dipirona", "medicamentosUso": "Nenhum"},
        "dataHoraTriagem": data_registro_maria
    }
    # A classificação será feita pelo backend agora
    from sistema_especialista import classificar_prioridade
    classificacao_maria = classificar_prioridade(triagem_maria["paciente"], triagem_maria["sintomas"], triagem_maria["motivoConsulta"])

    cursor.execute("""
        INSERT INTO triagens (
            cpf, data_registro, motivo_consulta, observacoes, temperatura, pressao, glicemia, spo2, peso, altura,
            alergias, medicamentos_uso, diagnostico_cid, sintomas_registrados,
            classificacao_cor, classificacao_prioridade, classificacao_setor, classificacao_tempo_espera
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    """, (
        triagem_maria["paciente"]["cpf"], triagem_maria["dataHoraTriagem"], triagem_maria["motivoConsulta"], triagem_maria["observacoes"],
        triagem_maria["sinaisVitais"]["temperatura"], triagem_maria["sinaisVitais"]["pressao"], triagem_maria["sinaisVitais"]["glicemia"],
        triagem_maria["sinaisVitais"]["spo2"], triagem_maria["sinaisVitais"]["peso"], triagem_maria["sinaisVitais"]["altura"],
        triagem_maria["informacoesAdicionais"]["alergias"], triagem_maria["informacoesAdicionais"]["medicamentosUso"],
        triagem_maria["diagnosticoInicialCID"], json.dumps(triagem_maria["sintomas"]),
        classificacao_maria["cor"], classificacao_maria["prioridade"], classificacao_maria["setor"], classificacao_maria["tempo_espera"]
    ))

    # Triagem para João Santos (Verde - Pouco Urgente)
    data_registro_joao = (datetime.now() - timedelta(hours=5)).isoformat()
    triagem_joao = {
        "paciente": {"cpf": "55566677788"},
        "motivoConsulta": "Tosse persistente e cansaço leve.",
        "observacoes": "Fumante há 10 anos.",
        "diagnosticoInicialCID": "J11 - Gripe (Influenza)",
        "sintomas": [
            {"nome": "Tosse", "gravidade": 6},
            {"nome": "Cansaço", "gravidade": 5}
        ],
        "sinaisVitais": {"temperatura": 37.2, "pressao": "120/80", "glicemia": 100, "spo2": 99, "peso": 80, "altura": 175},
        "informacoesAdicionais": {"alergias": "Nenhuma", "medicamentosUso": "Nenhum"},
        "dataHoraTriagem": data_registro_joao
    }
    classificacao_joao = classificar_prioridade(triagem_joao["paciente"], triagem_joao["sintomas"], triagem_joao["motivoConsulta"])

    cursor.execute("""
        INSERT INTO triagens (
            cpf, data_registro, motivo_consulta, observacoes, temperatura, pressao, glicemia, spo2, peso, altura,
            alergias, medicamentos_uso, diagnostico_cid, sintomas_registrados,
            classificacao_cor, classificacao_prioridade, classificacao_setor, classificacao_tempo_espera
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    """, (
        triagem_joao["paciente"]["cpf"], triagem_joao["dataHoraTriagem"], triagem_joao["motivoConsulta"], triagem_joao["observacoes"],
        triagem_joao["sinaisVitais"]["temperatura"], triagem_joao["sinaisVitais"]["pressao"], triagem_joao["sinaisVitais"]["glicemia"],
        triagem_joao["sinaisVitais"]["spo2"], triagem_joao["sinaisVitais"]["peso"], triagem_joao["sinaisVitais"]["altura"],
        triagem_joao["informacoesAdicionais"]["alergias"], triagem_joao["informacoesAdicionais"]["medicamentosUso"],
        triagem_joao["diagnosticoInicialCID"], json.dumps(triagem_joao["sintomas"]),
        classificacao_joao["cor"], classificacao_joao["prioridade"], classificacao_joao["setor"], classificacao_joao["tempo_espera"]
    ))

    # Triagem para Paciente Emergencia (Vermelho - Imediato)
    data_registro_emergencia = datetime.now().isoformat()
    triagem_emergencia = {
        "paciente": {"cpf": "12345678900", "nome": "Paciente Emergencia", "nascimento": None, "sexo": None},
        "motivoConsulta": "Perda de consciência súbita.",
        "observacoes": "Encontrado inconsciente no chão.",
        "diagnosticoInicialCID": None,
        "sintomas": [
            {"nome": "Perda de Consciência", "gravidade": 10}
        ],
        "sinaisVitais": {"temperatura": None, "pressao": None, "glicemia": None, "spo2": None, "peso": None, "altura": None},
        "informacoesAdicionais": {"alergias": None, "medicamentosUso": None},
        "dataHoraTriagem": data_registro_emergencia
    }
    classificacao_emergencia = classificar_prioridade(triagem_emergencia["paciente"], triagem_emergencia["sintomas"], triagem_emergencia["motivoConsulta"])

    cursor.execute("""
        INSERT INTO triagens (
            cpf, data_registro, motivo_consulta, observacoes, temperatura, pressao, glicemia, spo2, peso, altura,
            alergias, medicamentos_uso, diagnostico_cid, sintomas_registrados,
            classificacao_cor, classificacao_prioridade, classificacao_setor, classificacao_tempo_espera
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    """, (
        triagem_emergencia["paciente"]["cpf"], triagem_emergencia["dataHoraTriagem"], triagem_emergencia["motivoConsulta"], triagem_emergencia["observacoes"],
        triagem_emergencia["sinaisVitais"]["temperatura"], triagem_emergencia["sinaisVitais"]["pressao"], triagem_emergencia["sinaisVitais"]["glicemia"],
        triagem_emergencia["sinaisVitais"]["spo2"], triagem_emergencia["sinaisVitais"]["peso"], triagem_emergencia["sinaisVitais"]["altura"],
        triagem_emergencia["informacoesAdicionais"]["alergias"], triagem_emergencia["informacoesAdicionais"]["medicamentosUso"],
        triagem_emergencia["diagnosticoInicialCID"], json.dumps(triagem_emergencia["sintomas"]),
        classificacao_emergencia["cor"], classificacao_emergencia["prioridade"], classificacao_emergencia["setor"], classificacao_emergencia["tempo_espera"]
    ))

    conn.commit()
    conn.close()
    print("Triagens de exemplo inseridas.")

if __name__ == "__main__":
    popular_banco_de_dados()
