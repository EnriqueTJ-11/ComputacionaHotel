const SparqlClient = require('sparql-client-2');

// Endpoint para consultas de LECTURA (SELECT, ASK, etc.)
const SPARQL_QUERY_ENDPOINT = 'http://localhost:3030/hotel_data/query';

// Endpoint para consultas de ESCRITURA/ACTUALIZACIÓN (INSERT, DELETE, etc.)
const SPARQL_UPDATE_ENDPOINT = 'http://localhost:3030/hotel_data/update';

// Cliente para consultas de lectura
const queryClient = new SparqlClient(SPARQL_QUERY_ENDPOINT);

// Cliente para consultas de escritura
const updateClient = new SparqlClient(SPARQL_UPDATE_ENDPOINT);

module.exports = {
  queryClient, // Este lo usarás para SELECT, ASK, etc.
  updateClient // Este lo usarás para INSERT, DELETE, etc.
};