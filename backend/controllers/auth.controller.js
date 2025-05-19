const { findUserByEmail, createUser, getRoles } = require('../models/user.model');
const { generateToken } = require('../config/jwt.config');
const { successResponse, errorResponse } = require('../utils/response');
const bcrypt = require('bcrypt');

async function login(req, res) {
  try {
    const { email_usuario, contrasena_usuario } = req.body;
    
    // Validar que se proporcionen credenciales
    if (!email_usuario || !contrasena_usuario) {
      return errorResponse(res, 'Email y contraseña son requeridos', 400);
    }

    // Buscar usuario por email
    const usuario = await findUserByEmail(email_usuario);
    
    // Verificar si el usuario existe
    if (!usuario) {
      return errorResponse(res, 'Email no encontrado', 401);
    }

    // Verificar contraseña
    const contrasenaValida = await bcrypt.compare(contrasena_usuario, usuario.contrasena_usuario);
    
    if (!contrasenaValida) {
      return errorResponse(res, 'Contraseña incorrecta', 401);
    }

    // Generar token JWT
    const token = generateToken({
      usuarioId: usuario.id_usuario,
      email: usuario.email_usuario,
      rolId: usuario.rol_id
    });

    // Responder con token y datos básicos del usuario
    return successResponse(res, {
      token,
      usuarioId: usuario.id_usuario,
      email: usuario.email_usuario,
      rol: usuario.rol_id
    }, 'Inicio de sesión exitoso');

  } catch (error) {
    console.error('Error en login:', error);
    return errorResponse(res, 'Error al procesar el inicio de sesión');
  }
}

async function register(req, res) {
  try {
    const {
      email_usuario,
      contrasena_usuario,
      nombre1_usuario,
      nombre2_usuario,
      apellido1_usuario,
      apellido2_usuario,
      rol_id
    } = req.body;

    // Validar campos requeridos
    if (!email_usuario || !contrasena_usuario || !nombre1_usuario || !apellido1_usuario || !rol_id) {
      return errorResponse(res, 'Faltan campos obligatorios', 400);
    }

    // Verificar si el usuario ya existe
    const existingUser = await findUserByEmail(email_usuario);
    
    if (existingUser) {
      return errorResponse(res, 'El email ya está registrado', 409);
    }

    // Crear usuario
    await createUser({
      email_usuario,
      contrasena_usuario,
      nombre1_usuario,
      nombre2_usuario,
      apellido1_usuario,
      apellido2_usuario,
      rol_id
    });

    return successResponse(res, null, 'Usuario registrado con éxito', 201);

  } catch (error) {
    console.error('Error en registro:', error);
    return errorResponse(res, 'Error al registrar usuario');
  }
}

async function getUserRoles(req, res) {
  try {
    const roles = await getRoles(['Usuario', 'Cliente']);
    
    // Transformar a formato de mapa
    const rolesMap = {};
    roles.forEach(rol => {
      rolesMap[rol.nombre_rol] = rol.id_rol;
    });
    
    return successResponse(res, rolesMap);
  } catch (error) {
    console.error('Error al obtener roles:', error);
    return errorResponse(res, 'Error al obtener roles de usuario');
  }
}

module.exports = {
  login,
  register,
  getUserRoles
};