# Patch para compatibilidade com Python 3.10+
import collections
import collections.abc
collections.Mapping = collections.abc.Mapping

# Importação da biblioteca experta
from experta import *

print("\n>>> CARREGANDO sistema_especialista.py (VERSÃO FINAL DEFINTIVA COM FIELD) <<<\n")


# ==============================================================================
# DEFINIÇÃO DOS FATOS (COM CORREÇÃO CRÍTICA)
# ==============================================================================

class Sintoma(Fact):
    """
    Fato que representa a presença de um sintoma no paciente.
    O campo 'nome' é explicitamente definido para garantir a correspondência correta.
    """
    nome = Field(str, mandatory=True)

class TriagemResultado(Fact):
    """Fato que armazena o resultado final da triagem."""
    pass


# ==============================================================================
# MOTOR DE INFERÊNCIA (REGRAS DO SISTEMA)
# ==============================================================================

class MotorTriagem(KnowledgeEngine):
    """
    Motor de regras para classificação de risco de pacientes.
    """
    
    @Rule(OR(Sintoma(nome='parada respiratória'), Sintoma(nome='parada cardíaca'), Sintoma(nome='choque')), salience=10)
    def nivel_vermelho(self): self.declare(TriagemResultado(nivel='Vermelho', classificacao='Emergência', tempo_atendimento='Imediato'))

    @Rule(OR(Sintoma(nome='convulsão'), Sintoma(nome='sinais de avc'), Sintoma(nome='hemorragia grave')), salience=8)
    def nivel_laranja(self): self.declare(TriagemResultado(nivel='Laranja', classificacao='Muito Urgente', tempo_atendimento='Até 10 minutos'))

    @Rule(AND(Sintoma(nome='dor no peito'), Sintoma(nome='falta de ar')), salience=6)
    def nivel_amarelo(self): self.declare(TriagemResultado(nivel='Amarelo', classificacao='Urgente', tempo_atendimento='Até 60 minutos'))

    @Rule(OR(Sintoma(nome='febre'), Sintoma(nome='dor de cabeça')), salience=4)
    def nivel_verde(self): self.declare(TriagemResultado(nivel='Verde', classificacao='Pouco Urgente', tempo_atendimento='Até 120 minutos'))

    @Rule(NOT(TriagemResultado()), salience=-1)
    def nivel_azul(self): self.declare(TriagemResultado(nivel='Azul', classificacao='Não Urgente', tempo_atendimento='Até 240 minutos'))


# ==============================================================================
# FUNÇÃO PRINCIPAL DE AVALIAÇÃO (EXPORTADA)
# ==============================================================================

def avaliar_sintomas(sintomas_str: str):
    """Função principal que executa o motor de inferência."""
    print(f"DEBUG [Sistema Especialista]: Recebido para avaliação -> '{sintomas_str}'")
    
    sintomas = [s.strip().lower() for s in sintomas_str.split(',')]
    
    engine = MotorTriagem()
    engine.reset()
    
    for s in sintomas:
        engine.declare(Sintoma(nome=s))
    
    engine.run()
    
    resultado_final = None
    for fato in engine.facts:
        if isinstance(fato, TriagemResultado):
            resultado_final = {
                'nivel': fato['nivel'],
                'classificacao': fato['classificacao'],
                'tempo_atendimento': fato['tempo_atendimento']
            }
            break

    if not resultado_final:
        return {
            'nivel': 'Azul',
            'classificacao': 'Não Urgente',
            'tempo_atendimento': 'Até 240 minutos'
        }
    
    return resultado_final