# sistema_especialista.py

# Definindo as classificações do Protocolo de Manchester
CLASSIFICACOES = {
    "vermelho": {"prioridade": "Emergência", "cor": "🔴", "tempo_espera": "Atendimento imediato"},
    "laranja": {"prioridade": "Muito Urgente", "cor": "🟠", "tempo_espera": "Atendimento em até 10 minutos"},
    "amarelo": {"prioridade": "Urgente", "cor": "🟡", "tempo_espera": "Atendimento em até 60 minutos"},
    "verde": {"prioridade": "Pouco Urgente", "cor": "🟢", "tempo_espera": "Atendimento em até 120 minutos"},
    "azul": {"prioridade": "Não Urgente", "cor": "🔵", "tempo_espera": "Atendimento em até 240 minutos"},
}

def _encontrar_sintoma(nome_sintoma, lista_sintomas):
    """Função auxiliar para encontrar um sintoma na lista de sintomas do paciente."""
    if not lista_sintomas:
        return None
    for sintoma in lista_sintomas:
        if sintoma['nome'].lower() == nome_sintoma.lower():
            return sintoma
    return None

def classificar_prioridade(lista_sintomas):
    """
    Analisa uma lista de sintomas e retorna a classificação de prioridade
    baseada em um conjunto de regras do Protocolo de Manchester.
    A lógica verifica da maior para a menor prioridade. Se uma condição é atendida,
    a função retorna imediatamente a classificação correspondente.
    """
    
    # --- REGRAS PARA CLASSIFICAÇÃO VERMELHA (EMERGÊNCIA) ---
    # Risco iminente de morte. Atendimento imediato.
    
    # Parada cardiorrespiratória, vias aéreas comprometidas.
    if _encontrar_sintoma("Dificuldade para Respirar", lista_sintomas) and _encontrar_sintoma("Dificuldade para Respirar", lista_sintomas)['gravidade'] >= 9:
        return CLASSIFICACOES["vermelho"]
        
    # Dor no peito com características de infarto agudo.
    dor_peito = _encontrar_sintoma("Dor no Peito", lista_sintomas)
    if dor_peito and dor_peito['gravidade'] >= 8:
        return CLASSIFICACOES["vermelho"]

    # Convulsão ativa.
    if _encontrar_sintoma("Convulsão ou Ataque Epilético", lista_sintomas) and _encontrar_sintoma("Convulsão ou Ataque Epilético", lista_sintomas)['gravidade'] >= 9:
        return CLASSIFICACOES["vermelho"]

    # Sangramento de grande volume e incontrolável.
    sangramento = _encontrar_sintoma("Sangramento Excessivo", lista_sintomas)
    if sangramento and sangramento['gravidade'] >= 8:
        return CLASSIFICACOES["vermelho"]
        
    # Alteração de consciência grave, não responsivo.
    alteracao_consciencia = _encontrar_sintoma("Alteração de Consciência", lista_sintomas)
    if alteracao_consciencia and alteracao_consciencia['gravidade'] >= 9:
        return CLASSIFICACOES["vermelho"]

    # --- REGRAS PARA CLASSIFICAÇÃO LARANJA (MUITO URGENTE) ---
    # Risco significativo de morte ou deterioração. Atendimento em até 10 minutos.

    # Dor severa (qualquer tipo). A escala de gravidade é crucial aqui.
    # Usamos `any` para verificar se *qualquer* sintoma tem gravidade >= 8.
    if any(s['gravidade'] >= 8 for s in lista_sintomas):
        return CLASSIFICACOES["laranja"]
        
    # Febre muito alta, especialmente com letargia.
    febre = _encontrar_sintoma("Febre", lista_sintomas)
    if febre and febre['gravidade'] >= 9:
        return CLASSIFICACOES["laranja"]

    # Trauma craniano com alteração de consciência ou vômitos.
    trauma_craniano = _encontrar_sintoma("Trauma na Cabeça", lista_sintomas)
    vomito = _encontrar_sintoma("Vômito", lista_sintomas)
    if trauma_craniano and (alteracao_consciencia or vomito):
        return CLASSIFICACOES["laranja"]

    # Crise asmática ou dificuldade respiratória moderada.
    dificuldade_respirar = _encontrar_sintoma("Dificuldade para Respirar", lista_sintomas)
    if dificuldade_respirar and dificuldade_respirar['gravidade'] >= 6:
        return CLASSIFICACOES["laranja"]

    # --- REGRAS PARA CLASSIFICAÇÃO AMARELA (URGENTE) ---
    # Condição que necessita de avaliação, mas sem risco imediato. Atendimento em até 60 minutos.

    # Dor moderada (qualquer tipo).
    if any(s['gravidade'] >= 6 for s in lista_sintomas):
        return CLASSIFICACOES["amarelo"]
        
    # Vômitos persistentes, sem sinais de desidratação severa.
    if vomito and vomito['gravidade'] >= 5:
        return CLASSIFICACOES["amarelo"]
        
    # Febre moderada a alta.
    if febre and febre['gravidade'] >= 6:
        return CLASSIFICACOES["amarelo"]
        
    # Tontura ou vertigem incapacitante.
    tontura = _encontrar_sintoma("Tontura", lista_sintomas)
    if tontura and tontura['gravidade'] >= 6:
        return CLASSIFICACOES["amarelo"]
        
    # Crise hipertensiva sem sintomas de emergência.
    if _encontrar_sintoma("Pressão Alta", lista_sintomas) and _encontrar_sintoma("Pressão Alta", lista_sintomas)['gravidade'] >= 7:
        return CLASSIFICACOES["amarelo"]

    # --- REGRAS PARA CLASSIFICAÇÃO VERDE (POUCO URGENTE) ---
    # Condições menores que podem aguardar. Atendimento em até 120 minutos.
    
    # Se chegou até aqui, verificamos os casos menos graves.
    # Qualquer sintoma com gravidade >= 4 pode ser classificado como verde.
    if any(s['gravidade'] >= 4 for s in lista_sintomas):
        return CLASSIFICACOES["verde"]
        
    # Sintomas que, por si só, geralmente são de baixa prioridade.
    sintomas_verdes = ["Dor de Garganta", "Dor de Dente", "Cansaço", "Insônia", "Mal-estar Geral", "Dor nas Articulações"]
    for nome_sintoma in sintomas_verdes:
        if _encontrar_sintoma(nome_sintoma, lista_sintomas):
            return CLASSIFICACOES["verde"]
    
    # Se o paciente tem algum sintoma, mas não se encaixou em nada acima, é provavelmente verde.
    if lista_sintomas:
        return CLASSIFICACOES["verde"]

    # --- REGRA PADRÃO: CLASSIFICAÇÃO AZUL (NÃO URGENTE) ---
    # Casos que podem ser agendados, como troca de receitas ou check-ups.
    # No nosso fluxo, isso ocorreria se o paciente não marcasse NENHUM sintoma.
    return CLASSIFICACOES["azul"]
