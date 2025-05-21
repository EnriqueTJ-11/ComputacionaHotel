const express = require('express');
const { queryOntology, createAlojamiento, getTiposAlojamiento } = require('../controllers/ontology.controller');

const router = express.Router();

// Rutas de ontología
router.get('/query', queryOntology);
router.post('/alojamiento', createAlojamiento); // Para insertar un alojamiento
router.get('/tiposAlojamiento', getTiposAlojamiento); // Para obtener los tipos de alojamiento

module.exports = router;