const { executeQuery } = require('../config/db.config');

async function getAllHotels() {
  const query = `
    SELECT 
      id_hotel, 
      nombre_hotel, 
      descripcion_hotel, 
      imagen_hotel 
    FROM hoteles
  `;
  
  return executeQuery(query);
}

module.exports = {
  getAllHotels
};