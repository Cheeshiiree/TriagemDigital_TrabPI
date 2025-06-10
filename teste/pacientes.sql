CREATE TABLE pacientes (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nome VARCHAR(100) NOT NULL,
    data_nascimento DATE NOT NULL,
    sexo CHAR(1) CHECK (sexo IN ('M', 'F','O','N')),
    cpf VARCHAR(11) UNIQUE NOT NULL,
    email VARCHAR(100),
    telefone VARCHAR(15),
    endereco TEXT
);

CREATE TABLE medicamentos (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nome VARCHAR(100) NOT NULL,
    dosagem VARCHAR(50) NOT NULL,
    via_administracao VARCHAR(50) NOT NULL,
    paciente_id INT REFERENCES pacientes(id) ON DELETE CASCADE
);

SELECT FROM pacientes WHERE cpf = '12345678901';
INSERT INTO pacientes (nome, data_nascimento, sexo, cpf, email, telefone, endereco)