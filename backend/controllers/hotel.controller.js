const { getAllHotels } = require('../models/hotel.model');
const { client } = require('../config/sparql.config');
const { successResponse, errorResponse } = require('../utils/response');

async function getEnrichedHotels(req, res) {
  try {
    // 1. Obtener hoteles desde MySQL
    const hotelesMySQL = await getAllHotels();

    // Si no hay hoteles, devolver lista vacía
    if (!hotelesMySQL.length) {
      return successResponse(res, []);
    }

    // 2. Preparar consulta SPARQL
    const hotelIds = hotelesMySQL.map(hotel => hotel.id_hotel).join('", "');

    const consultaOntologia = `
      PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>
      PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
      PREFIX : <http://www.semanticweb.org/ontologies/hospedaje#>
      
      SELECT 
        ?alojamiento ?descripcion ?numeroHabitaciones ?latitud ?longitud
      WHERE {
        ?alojamiento a :Alojamiento ;
                     :descripción ?descripcion ;
                     :NumeroHabitaciones ?numeroHabitaciones ;
                     :estáUbicadoEn ?ubicacion .
        ?ubicacion :Latitud ?latitud ;
                   :Longitud ?longitud .
        FILTER (STRAFTER(STR(?alojamiento), "#") IN ("${hotelIds}"))  
      }
    `;

    // 3. Ejecutar consulta SPARQL
    const resultadosOntologia = await client.query(consultaOntologia).execute();

    // 4. Combinar resultados
    const alojamientosCompletos = hotelesMySQL.map(hotel => {
      const alojamientoOntologia = resultadosOntologia.results.bindings.find(item => 
        item.alojamiento.value.endsWith("#" + hotel.id_hotel)
      );

      return {
        ...hotel,
        descripcion_ontologia: alojamientoOntologia ? alojamientoOntologia.descripcion.value : null,
        numeroHabitaciones_ontologia: alojamientoOntologia ? alojamientoOntologia.numeroHabitaciones.value : null,
        latitud_ontologia: alojamientoOntologia ? alojamientoOntologia.latitud.value : null,
        longitud_ontologia: alojamientoOntologia ? alojamientoOntologia.longitud.value : null,
      };
    });

    return successResponse(res, alojamientosCompletos);

  } catch (error) {
    console.error('Error al obtener alojamientos:', error);
    return errorResponse(res, 'Error al obtener datos de alojamientos');
  }
}

module.exports = {
  getEnrichedHotels
};