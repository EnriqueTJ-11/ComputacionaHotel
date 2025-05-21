const express = require('express');
const { queryOntology, createAlojamiento, getTiposAlojamiento, buscarHospedajes, getCiudadesUnicas } = require('../controllers/ontology.controller');

const router = express.Router();

// Rutas de ontología
router.get('/query', queryOntology);
router.post('/alojamiento', createAlojamiento); // Para insertar un alojamiento
router.get('/tiposAlojamiento', getTiposAlojamiento); // Para obtener los tipos de alojamiento
router.get('/bucar', buscarHospedajes); 
router.get('/traerCuiudades',getCiudadesUnicas)// Para obtener un tipo de alojamiento específico

module.exports = router;