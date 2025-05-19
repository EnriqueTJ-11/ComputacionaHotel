const express = require('express');
const { queryOntology } = require('../controllers/ontology.controller');

const router = express.Router();

// Rutas de ontología
router.get('/query', queryOntology);

module.exports = router;