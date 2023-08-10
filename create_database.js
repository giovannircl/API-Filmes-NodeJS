const connection = require('./connection');

connection.connect((err) => {
  if (err) throw err;
  console.log('Conectado ao banco de dados MySQL!');
});

// Criação da tabela 'diretor'
const createDiretorTableQuery = `
  CREATE TABLE diretor (
    idDiretor INT PRIMARY KEY,
    nome VARCHAR(255),
    sexo ENUM('M', 'F'),
    nacionalidade VARCHAR(255)
  )
`;

connection.query(createDiretorTableQuery, (err, result) => {
  if (err) throw err;
  console.log('Tabela "diretor" criada com sucesso!');
});

// Criação da tabela 'filmes'
const createFilmesTableQuery = `
  CREATE TABLE filmes (
    idFilme INT PRIMARY KEY,
    idDiretor INT,
    titulo VARCHAR(255),
    dtDistribuicao DATE,
    adulto BOOLEAN,
    linguaOrigem VARCHAR(10),
    sinopse TEXT
  )
`;

connection.query(createFilmesTableQuery, (err, result) => {
  if (err) throw err;
  console.log('Tabela "filmes" criada com sucesso!');
});

// Criação da tabela 'ator'
const createAtorTableQuery = `
  CREATE TABLE ator (
    idAtor INT PRIMARY KEY,
    nome VARCHAR(255),
    sexo ENUM('M', 'F'),
    nasc DATE,
    falec DATE,
    localNascimento VARCHAR(255)
  )
`;

connection.query(createAtorTableQuery, (err, result) => {
  if (err) throw err;
  console.log('Tabela "ator" criada com sucesso!');
});

// Criação da tabela 'elenco'
const createElencoTableQuery = `
  CREATE TABLE elenco (
    idFilme INT,
    idAtor INT,
    PRIMARY KEY (idFilme, idAtor)
  )
`;

connection.query(createElencoTableQuery, (err, result) => {
  if (err) throw err;
  console.log('Tabela "elenco" criada com sucesso!');
});

connection.end();