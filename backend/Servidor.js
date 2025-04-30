const express = require('express');
const SparqlClient = require('sparql-client-2');

const app = express();
const port = 3000;

const endpoint = 'http://localhost:3030/hotel_data/query';  // SPARQL endpoint URL

const client = new SparqlClient(endpoint);

app.get('/query', (req, res) => {
    const query = `
      PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>
      PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>

      SELECT  ?subject ?predicate ?object
      WHERE {
        ?subject ?predicate ?object
      }
      LIMIT 10
    `;

    client.query(query).execute()
        .then(result => {
            res.json(result.results.bindings);
        })
        .catch(err => {
            res.status(500).json({ error: 'Error querying ontology' });
        });
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${3000}/query`); 
});
