const SparqlClient = require('sparql-client-2');

const SPARQL_ENDPOINT = 'http://localhost:3030/hotel_data/query';
const client = new SparqlClient(SPARQL_ENDPOINT);

module.exports = {
  client,
  SPARQL_ENDPOINT
};