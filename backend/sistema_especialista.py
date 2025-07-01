# sistema_especialista.py

"""
Sistema Especialista para Triagem de Pacientes - Protocolo de Manchester (MTS)

AVISO IMPORTANTE:
Este código é um exemplo didático e uma simulação simplificada do Protocolo de Manchester.
As regras aqui implementadas DEVEM ser revisadas, validadas e ajustadas por
profissionais de saúde qualificados (médicos e enfermeiros) antes de serem
utilizadas em um ambiente clínico real. A segurança do paciente é a maior prioridade.
"""

# Definindo as classificações do Protocolo de Manchester
CLASSIFICACOES = {
    "Vermelho": {"prioridade": "Emergência", "cor": "🔴", "tempo_espera": "0 minutos"},
    "Laranja": {"prioridade": "Muito Urgente", "cor": "🟠", "tempo_espera": "10 minutos"},
    "Amarelo": {"prioridade": "Urgente", "cor": "🟡", "tempo_espera": "30 minutos"},
    "Verde": {"prioridade": "Pouco Urgente", "cor": "🟢", "tempo_espera": "90 minutos"},
    "Azul": {"prioridade": "Não Urgente", "cor": "🔵", "tempo_espera": "120 minutos"},
}

def classificar_prioridade(paciente_data, sintomas, motivo_consulta):
    cor_triagem = "Azul"  # Padrão inicial: Não Urgente
    setor_encaminhamento = "Clínica Geral - Ambulatório"
    tempo_espera = "120 minutos"
    prioridade = "Não Urgente"

    def tem_sintoma(nome_sintoma, gravidade_minima=1):
        for sintoma in sintomas:
            if sintoma['nome'].lower() == nome_sintoma.lower() and sintoma['gravidade'] >= gravidade_minima:
                return True
        return False

    # Calculate age from birthdate
    idade = None
    if paciente_data and 'nascimento' in paciente_data and paciente_data['nascimento']:
        try:
            from datetime import datetime
            nascimento_dt = datetime.strptime(paciente_data['nascimento'], '%Y-%m-%d')
            idade = datetime.now().year - nascimento_dt.year
            if datetime.now().month < nascimento_dt.month or (datetime.now().month == nascimento_dt.month and datetime.now().day < nascimento_dt.day):
                idade -= 1
        except ValueError:
            pass # Handle invalid date format if necessary

    motivo_consulta_lower = motivo_consulta.lower() if motivo_consulta else ""

    # --- REGRAS VERMELHAS (IMEDIATO) ---
    if (tem_sintoma("Dor no Peito", 9) and tem_sintoma("Falta de Ar", 9)) or \
       "perda de consciência" in motivo_consulta_lower or \
       "parada cardíaca" in motivo_consulta_lower:
        cor_triagem = "Vermelho"
        setor_encaminhamento = "Emergência - Reanimação/Cardiologia"
        tempo_espera = "0 minutos"
        prioridade = "Emergência"
        return {"cor": cor_triagem, "setor": setor_encaminhamento, "tempo_espera": tempo_espera, "prioridade": prioridade}

    # --- REGRAS LARANJAS (MUITO URGENTE) ---
    if (tem_sintoma("Dor Abdominal", 9) and tem_sintoma("Vômito", 8)) or \
       tem_sintoma("Dor no Peito", 7) or \
       tem_sintoma("Hemorragia", 8) or \
       (idade is not None and idade < 1 and tem_sintoma("Febre", 8)):
        cor_triagem = "Laranja"
        setor_encaminhamento = "Emergência - Clínica Geral / Cirurgia"
        tempo_espera = "10 minutos"
        prioridade = "Muito Urgente"
        return {"cor": cor_triagem, "setor": setor_encaminhamento, "tempo_espera": tempo_espera, "prioridade": prioridade}

    # --- REGRAS AMARELAS (URGENTE) ---
    if tem_sintoma("Febre", 7) or \
       tem_sintoma("Dor de Cabeça", 8) or \
       tem_sintoma("Fraturas", 6) or \
       tem_sintoma("Dor Abdominal", 7):
        cor_triagem = "Amarelo"
        setor_encaminhamento = "Observação / Traumatologia"
        tempo_espera = "30 minutos"
        prioridade = "Urgente"
        return {"cor": cor_triagem, "setor": setor_encaminhamento, "tempo_espera": tempo_espera, "prioridade": prioridade}

    # --- REGRAS VERDES (POUCO URGENTE) ---
    if tem_sintoma("Tosse", 6) or \
       tem_sintoma("Cansaço", 6) or \
       tem_sintoma("Diarreia", 5):
        cor_triagem = "Verde"
        setor_encaminhamento = "Clínica Geral - Atendimento Básico"
        tempo_espera = "90 minutos"
        prioridade = "Pouco Urgente"
        return {"cor": cor_triagem, "setor": setor_encaminhamento, "tempo_espera": tempo_espera, "prioridade": prioridade}

    # --- REGRAS AZUIS (NÃO URGENTE) ---
    return {"cor": cor_triagem, "setor": setor_encaminhamento, "tempo_espera": tempo_espera, "prioridade": prioridade}