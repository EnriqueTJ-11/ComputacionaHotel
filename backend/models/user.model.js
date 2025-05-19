const { executeQuery } = require('../config/db.config');
const bcrypt = require('bcrypt');

async function findUserByEmail(email) {
  const query = 'SELECT * FROM usuarios WHERE email_usuario = ?';
  const results = await executeQuery(query, [email]);
  return results[0] || null;
}

async function createUser(userData) {
  const {
    email_usuario,
    contrasena_usuario,
    nombre1_usuario,
    nombre2_usuario,
    apellido1_usuario,
    apellido2_usuario,
    rol_id
  } = userData;

  const hashedPassword = await bcrypt.hash(contrasena_usuario, 10);

  await executeQuery(
    'CALL sp_registrar_usuario(?, ?, ?, ?, ?, ?, ?)',
    [
      email_usuario, 
      hashedPassword, 
      nombre1_usuario, 
      nombre2_usuario || '', 
      apellido1_usuario, 
      apellido2_usuario || '', 
      rol_id
    ]
  );

  return { email_usuario };
}

async function getRoles(roleNames = []) {
  const placeholders = roleNames.map(() => '?').join(',');
    
  
  return executeQuery(query, roleNames);
}

module.exports = {
  findUserByEmail,
  createUser,
  getRoles
};