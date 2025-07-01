-- CREATE TABLE pacientes (id INTEGER PRIMARY KEY AUTOINCREMENT, nome VARCHAR(100) NOT NULL, data_nascimento DATE NOT NULL, sexo CHAR(1) CHECK (sexo IN ('M', 'F','O','N')), cpf VARCHAR(11) UNIQUE NOT NULL, email VARCHAR(100), telefone VARCHAR(15), endereco TEXT);

-- INSERT INTO pacientes (id, nome, data_nascimento, sexo, cpf, email, telefone, endereco) VALUES ('1', 'Ryu', '2006-12-08', 'M', '12345678988', 'ryue@gmail.com', '5535991739680', 'Rua Mario da Silva Penha, 255');

-- SELECT * FROM pacientes;
SELECT nome FROM pacientes WHERE id = '1';
















