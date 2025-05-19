const express = require('express');
const { getEnrichedHotels } = require('../controllers/hotel.controller');
const { authenticateUser } = require('../middleware/auth.middleware');

const router = express.Router();

// Rutas de hoteles
router.get('/alojamientos-completos', getEnrichedHotels);

// Ejemplo de ruta protegida
router.get('/alojamientos-privados', authenticateUser, getEnrichedHotels);

module.exports = router;