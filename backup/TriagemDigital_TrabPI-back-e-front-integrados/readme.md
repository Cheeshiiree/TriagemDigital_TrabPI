# ALTERAÇÕES DESSA BRANCH

primeiro, varias branchs estão sendo criadas para salvar progressos graduais no codigo, e não embolar tudo nada main
além de que se der alguma bosta em alguma versão, pode voltar para main (versão mais estável e pronta) ou para outra branch de produção

# O QUE FOI FEITO NESSA BRANCH?

resumidamente, o front end que o enfermeiro(a) visualiza foi integrado com a api, agora conseguimos:

-   cadastrar pacientes
-   cadastrar sintomas dos pacientes
-   autocompletar os dados do paciente caso o cpf esteja cadastrado no sistema
-   listar todos os pacientes registrados + seus sintomas (apenas via postman / insomnia, para fins de teste de desenvolvimento)

# CASO ALGUEM QUEIRA TESTA

primeiro, voce tem o repositorio clonado na sua maquina? se sim, rode no seu terminal dentro da pasta do repositório
```
git fetch origin
git checkout back-e-front-integrados
```

caso contrário (não tem o repositório baixado: 
```
git clone https://github.com/Cheeshiiree/TriagemDigital_TrabPI.git
cd TriagemDigital_TrabPI
git checkout back-e-front-integrados
```

agora, para rodar tudo certinho (lembre-se de estar dentro da pasta do projeto):

### 1 - crie o ambiente virtual
dentro da pasta do projeto, entre na pasta "backend" -> `cd backend/`, depois:

NO WINDOWS
```
python -m venv venv
.\venv\Scripts\activate
```

NO LINUX / MACOS
```
python3 -m venv venv
source venv/bin/activate
```

### 2 - instale as dependências da api em python
```
pip install -r requirements.txt
```

### 3 - rode a api
```
python app.py
```

### 4 - depois disso, apenas abra o html no seu navegador com alguma extensão tipo live share, live preview ou qualquer outra extensão de front assim
