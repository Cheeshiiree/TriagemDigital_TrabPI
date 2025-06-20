# Triagem Digital - Sistema de Otimização para UBS

![alt text](https://img.shields.io/badge/status-ongoing-orange)

![alt text](https://img.shields.io/badge/Python-3.x%2B-blue.svg)

![alt text](https://img.shields.io/badge/Flask-3.1.1-black.svg)

O Triagem Digital é um projeto acadêmico que apresenta um sistema para otimizar, agilizar e padronizar o processo de triagem de pacientes em Unidades Básicas de Saúde (UBS).
## Problema

O processo de triagem em muitas Unidades Básicas de Saúde (UBS) ainda é realizado de forma manual. Observamos que este método frequentemente resulta em:

- **Demora no atendimento**: Longas filas e tempo de espera elevado para a primeira avaliação.
- **Ineficiência**: Dificuldade em gerenciar o fluxo de pacientes e priorizar casos urgentes de forma padronizada.
- **Confusão**: Falta de clareza para os pacientes sobre a ordem de atendimento e o nível de prioridade.
- **Perda de Histórico**: Dificuldade em acessar rapidamente o histórico de sintomas de um paciente em visitas anteriores.
## Solução

Para solucionar este problema, desenvolvemos o Triagem Digital, um sistema web que digitaliza e automatiza a classificação de risco dos pacientes. A enfermeira ou profissional de saúde insere os dados e sintomas do paciente em uma interface simples, e nosso sistema especialista, baseado no Protocolo de Manchester (MTS), determina o grau de prioridade do atendimento de forma instantânea.
## Funcionalidades

- **Cadastro de Pacientes:** Registro rápido de novos pacientes.
- **Autopreenchimento por CPF:** Ao informar o CPF de um paciente já cadastrado, o sistema preenche automaticamente seus dados, agilizando o processo.
- **Registro de Sintomas:** Interface clara para registrar os sintomas atuais do paciente.
- **Classificação Automática com Protocolo MTS:** Um sistema especialista em Python analisa os sintomas e retorna o nível de prioridade (vermelho, laranja, amarelo, verde ou azul).
- **Histórico de Pacientes:** Todos os atendimentos e sintomas são armazenados no banco de dados para consulta futura.
## Fluxo do Sistema

- Frontend (Interface da Enfermeira): A enfermeira acessa a página web (index.html).

- Entrada de Dados: Ela preenche o formulário com os dados e sintomas do paciente.

- Requisição à API: Ao clicar em "Cadastrar", o JavaScript envia os dados para a nossa API em Flask.

**Processamento no Backend:**

- A API Flask recebe a requisição.

- Os dados do paciente e seus sintomas são salvos no banco de dados SQLite.

- A API envia os sintomas para o Sistema Especialista.

**Classificação de Risco:**

- O Sistema Especialista (Python) aplica as regras do Protocolo de Manchester e determina o nível de prioridade.
- Ele retorna o resultado da classificação para a API.

**Resposta ao Frontend:**

- A API Flask atualiza o registro do paciente no banco com o nível de prioridade.

- A API retorna o resultado (nível de prioridade) para a interface da enfermeira, que exibe a classificação na tela.
## Stack utilizada

- **Frontend:** HTML5, CSS3, JavaScript
- **Backend (API):** Python 3, Flask
- **Banco de Dados:** SQLite3
- **Sistema Especialista:** Lógica em Python puro, implementando o Protocolo de Manchester (MTS).


## Autores

- [@Ana Paula]()
- [@Anna Beatriz](https://github.com/Cheeshiiree)
- [@Clara]()
- [@Lucas](https://github.com/lucas-jurgensen)
- [@Pietro]()
- [@Ryu](https://github.com/Ryumiwa)
- [@Samara](https://github.com/SamaraFeitosa)
- [@Samuel]()

