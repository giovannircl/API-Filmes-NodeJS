const connection = require('./connection');

connection.connect((err) => {
  if (err) throw err;
  console.log('Conectado ao banco de dados MySQL!');
});

module.exports = {
  updateIdDiretorFilme: function(filmeId, diretorId) {
    const updateQuery = `UPDATE filmes SET idDiretor = ${diretorId} WHERE idFilme = ${filmeId}`;
    
    connection.query(updateQuery, (err, result) => {
      if (err) throw err;
      console.log(`ID do diretor atualizado para o filme com ID ${filmeId}`);
    });
  },

  insertDataIntoDiretor: function (diretor) {
    const insertDiretorQuery = `INSERT INTO diretor (idDiretor, nome, sexo, nacionalidade) VALUES (?, ?, ?, ?)`;

    const values = [diretor.id, diretor.name, diretor.gender === 2 ? 'M' : 'F', diretor.place_of_birth];
    
    connection.query(insertDiretorQuery, values, (err, result) => {
      if (err) throw err;
    });
  },

  insertDataIntoFilmes: function (filme, idDiretor) {

    
    const insertFilmesQuery = `INSERT INTO filmes (idFilme, idDiretor, titulo, dtDistribuicao, adulto, linguaOrigem, sinopse) VALUES (?, ?, ?, ?, ?, ?, ?)`;
  
    const values = [
      filme.id,
      idDiretor,
      filme.title,
      filme.release_date,
      filme.adult,
      filme.original_language,
      filme.overview,
    ];
    
    connection.query(insertFilmesQuery, values, (err, result) => {
      if (err) throw err;
    });
  },

  insertDataIntoAtor: function (ator) {
    const insertAtorQuery = `INSERT INTO ator (idAtor, nome, sexo, nasc, falec, localNascimento) VALUES (?, ?, ?, ?, ?, ?)`;
  
    const values = [
      ator.id,
      ator.name,
      ator.gender === 2 ? 'M' : 'F', // Assume M para masculino e F para feminino
      ator.birthday,
      ator.deathday,
      ator.place_of_birth,
    ];
    
    connection.query(insertAtorQuery, values, (err, result) => {
      if (err) throw err;
    });
  },

  insertDataIntoElenco: function (idFilme, ator) {
    const insertElencoQuery = `INSERT INTO elenco (idFilme, idAtor) VALUES (?, ?)`;
  
    const values = [idFilme, ator.id];
    
    connection.query(insertElencoQuery, values, (err, result) => {
      if (err) throw err;
    });
  },
};