const { client } = require('../config/sparql.config');
const { successResponse, errorResponse } = require('../utils/response');

async function queryOntology(req, res) {
  try {
    const consultaSPARQL = `
      PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>
      PREFIX owl: <http://www.w3.org/2002/07/owl#>
      PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
      PREFIX xsd: <http://www.w3.org/2001/XMLSchema#>
      PREFIX : <http://www.semanticweb.org/ontologies/hotel#>

      SELECT ?alojamiento 
            (STR(?nombre) AS ?Nombre_)
            (STR(?capacidad) AS ?Capacidad_)
            (STR(?categoria) AS ?Categoria_)
            (STR(?descripcion) AS ?Descripcion_)
      WHERE {
        ?alojamiento a ?tipo .
        VALUES ?tipo {
          :Hotel :Hostal :Apartamento :CasaRural :BedAndBreakfast
          :AlbergueJuvenil :Motel :Posada :Resort :HotelBoutique
        }
        
        ?alojamiento :nombre ?nombre ;
              :capacidadTotal ?capacidad  ;
                :categoria ?categoria;
                  :descripcion ?descripcion.
              
      }
    `;

    // 1. Ejecutar consulta SPARQL
    const resultadosOntologia = await client.query(consultaSPARQL).execute();

    // 2. Formatear los resultados para el frontend
    const alojamientosFormateados = resultadosOntologia.results.bindings.map(item => {
      // Extrae solo la parte relevante del URI para el ID y la categoría
      const idAlojamiento = item.alojamiento.value.split('#').pop();
      const categoriaLimpia = item.Categoria_.value.split('#').pop();

      return {
        id_alojamiento: idAlojamiento, // Un ID útil para el frontend
        nombre: item.Nombre_.value,
        capacidad: parseInt(item.Capacidad_.value), // Convertir a número
        categoria: categoriaLimpia,
        descripcion: item.Descripcion_.value
      };
    });

    // 3. Responder con los datos formateados
    return successResponse(res, alojamientosFormateados, 'Alojamientos de ontología obtenidos exitosamente');

  } catch (error) {
    console.error('Error consultando ontología:', error);
    // Para producción, podrías simplificar el error para el cliente
    return errorResponse(res, 'Error al consultar la ontología', error.message);
  }
}

module.exports = {
  queryOntology
};