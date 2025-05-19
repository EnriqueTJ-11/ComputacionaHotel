const express = require('express');
const { login, register, getUserRoles } = require('../controllers/auth.controller');

const router = express.Router();

// Rutas de autenticación
router.post('/login', login);
router.post('/registrar', register);
router.get('/roles-usuario-cliente', getUserRoles);

module.exports = router;