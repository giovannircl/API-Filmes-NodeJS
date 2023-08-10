const axios = require('axios');
const insert_data = require('./insert_data.js');

global.token = ''; //Aqui irá o token de autenticação da API TMDB

async function getFilmesDeComedia(numPagina) {
  try {
    const response = await axios.get(`https://api.themoviedb.org/3/discover/movie?include_adult=true&include_video=false&language=en-US&page=${numPagina}&sort_by=popularity.desc&with_genres=comedy`,{
    headers: {
        Authorization: `Bearer ${global.token}`
    }})
    const filmes = response.data.results;
    
    for (const filme of filmes) {
      const idDiretor = await getDiretorByIdFilme(filme.id);
      // Insira o filme com o ID do diretor na tabela de filmes
      const exists = await checkFilmeIdExists(filme.id);
      if (!exists) {
        insert_data.insertDataIntoFilmes(filme, idDiretor);
      } 
      
    }

  } catch (error) {
    console.error(error);
  }
}


async function getDiretorByIdFilme(id) {
  try {
    const response = await axios.get(`https://api.themoviedb.org/3/movie/${id}/credits`, {
      headers: {
        Authorization: `Bearer ${global.token}`
      }
    });
    const elenco = response.data;
    let diretorId = null;

    for (const ator of elenco.cast) {
      const exists = await checkElencoIdExists(id, ator.id);
      if (!exists) {
        insert_data.insertDataIntoElenco(id, ator);
      } 

      if (ator.known_for_department === 'Directing') {
        diretorId = ator.id;
        getAtorByIdPessoa(diretorId, true);
        return diretorId;
      }else{
        getAtorByIdPessoa(ator.id, false);
      }
      
    }

    for (const ator of elenco.crew) {
      if (ator.known_for_department === 'Directing') {
        diretorId = ator.id;
        getAtorByIdPessoa(diretorId, true);
        return diretorId;
      }
    }
  } catch (error) {
    console.error(error);
    return null;
  }
}


async function getAtorByIdPessoa(idPessoa, diretor) {
  try {
    const response = await axios.get(`https://api.themoviedb.org/3/person/${idPessoa}`,{
    headers: {
        Authorization: `Bearer ${global.token}`
    }})
    
    const ator = response.data;
    // Insere o dado de cada ator ou diretor
    if (diretor === true) {
      const exists = await checkDiretorIdExists(idPessoa);
      if (!exists) {
        insert_data.insertDataIntoDiretor(ator);
      } 

    }  else{
      const exists = await checkAtorIdExists(idPessoa);
      if (!exists) {
        insert_data.insertDataIntoAtor(ator);
      } 
      
    }

  } catch (error) {
    console.error(error);
  }
}

async function checkAtorIdExists(idAtor) {
  try {
    const connection = require('./connection');

    const query = 'SELECT COUNT(*) AS count FROM ator WHERE idAtor = ?';
    const values = [idAtor];

    const result = await new Promise((resolve, reject) => {
      connection.query(query, values, (err, rows) => {
        if (err) {
          reject(err);
          return;
        }
        resolve(rows[0].count > 0);
      });
    });

    return result;
  } catch (error) {
    console.error(error);
    return false;
  }
}

async function checkElencoIdExists(idFilme, idAtor) {
  try {
    const connection = require('./connection');

    const query = 'SELECT COUNT(*) AS count FROM elenco WHERE idFilme = ? AND idAtor = ?';
    const values = [idFilme, idAtor];

    const result = await new Promise((resolve, reject) => {
      connection.query(query, values, (err, rows) => {
        if (err) {
          reject(err);
          return;
        }
        resolve(rows[0].count > 0);
      });
    });

    return result;
  } catch (error) {
    console.error(error);
    return false;
  }
}

async function checkFilmeIdExists(idFilme) {
  try {
    const connection = require('./connection');

    const query = 'SELECT COUNT(*) AS count FROM filmes WHERE idFilme = ?';
    const values = [idFilme];

    const result = await new Promise((resolve, reject) => {
      connection.query(query, values, (err, rows) => {
        if (err) {
          reject(err);
          return;
        }
        resolve(rows[0].count > 0);
      });
    });

    return result;
  } catch (error) {
    console.error(error);
    return false;
  }
}

async function checkDiretorIdExists(idDiretor) {
  try {
    const connection = require('./connection');

    const query = 'SELECT COUNT(*) AS count FROM diretor WHERE idDiretor = ?';
    const values = [idDiretor];

    const result = await new Promise((resolve, reject) => {
      connection.query(query, values, (err, rows) => {
        if (err) {
          reject(err);
          return;
        }
        resolve(rows[0].count > 0);
      });
    });

    return result;
  } catch (error) {
    console.error(error);
    return false;
  }
}

async function processarFilmesDeComedia() {
  for (let i = 1; i < 8; i++) {
    await getFilmesDeComedia(i);
  }
  console.log("Deu tudo certo!!");
}

processarFilmesDeComedia();