from flask import Flask, request, jsonify
# import sqlite3

app = Flask(__name__) # inicializa o flask na variavel app

# fazer funcao para conectar com sqlite

# fazer funcao para criar tabela

# rotas
@app.route('/')
def home():
    return 'testando api em python flask'

# endpoint /paciente -> cadastro de um paciente novo

# endpoint /paciente/<cpf> -> busca do paciente pelo cpf 

# endpoint /sintomas -> pacientes ja cadastrados, apenas enviar os sintomas

if __name__ == '__main__':
    app.run(debug=True)