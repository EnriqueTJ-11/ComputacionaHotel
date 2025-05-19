const { client } = require('../config/sparql.config');
const { successResponse, errorResponse } = require('../utils/response');

async function queryOntology(req, res) {
  try {
    const query = `
      PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>
      PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
      PREFIX : <http://www.semanticweb.org/ontologies/hospedaje#>

      SELECT ?hotel 
      WHERE {
        ?hotel rdf:type :Hotel
      }
      LIMIT 10
    `;

    const result = await client.query(query).execute();
    return successResponse(res, result.results.bindings);
  } catch (error) {
    console.error('Error consultando ontología:', error);
    return errorResponse(res, 'Error al consultar la ontología');
  }
}

module.exports = {
  queryOntology
};