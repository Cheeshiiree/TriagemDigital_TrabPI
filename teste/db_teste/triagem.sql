CREATE TABLE triagem (id_triagem INTEGER PRIMARY KEY AUTOINCREMENT, nome VARCHAR(100), cpf VARCHAR(11)FOREIGN KEY NOT NULL, data_nascimento DATE NOT NULL, sexo CHAR(1) CHECK(sexo IN('M','F','O')), telefone VARCHAR(15), motivo_consulta TEXT NOT NULL, doencas VARCHAR(3) CHECK(doencas IN('J11','K29','R51','I10'));

CREATE TABLE sintomas (id_sintoma INTEGER PRIMARY KEY AUTOINCREMENT, sintomas_gerais  