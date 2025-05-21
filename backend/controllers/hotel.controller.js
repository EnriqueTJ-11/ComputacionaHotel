
const { client } = require('../config/sparql.config');
const { successResponse, errorResponse } = require('../utils/response');

async function getEnrichedHotels(req, res) {
  try {
    const consultaOntologia = `
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
             (STR(?latitud) AS ?Latitud_)
             (STR(?longitud) AS ?Longitud_)
      WHERE {
        ?alojamiento a ?tipo .
        VALUES ?tipo {
          :Hotel :Hostal :Apartamento :CasaRural :BedAndBreakfast
          :AlbergueJuvenil :Motel :Posada :Resort :HotelBoutique
        }

        ?alojamiento :nombre ?nombre ;
                     :capacidadTotal ?capacidad ;
                     :categoria ?categoria;
                     :descripcion ?descripcion.

        ?alojamiento :ubicado en ?ubicación . 
        ?ubicacion a :Ubicacion . 

        ?ubicación :latitud ?latitud ; 
                   :longitud ?longitud .
      }
    `;

    // 1. Ejecutar consulta SPARQL
    const resultadosOntologia = await client.query(consultaOntologia).execute();

    // 2. Formatear los resultados de la ontología
    const alojamientosOntologia = resultadosOntologia.results.bindings.map(item => {
      // Extrae solo la parte relevante del URI (e.g., "Hotel_1" de "http://www.semanticweb.org/ontologies/hotel#Hotel_1")
      const idAlojamiento = item.alojamiento.value.split('#').pop(); 
      const categoriaLimpia = item.Categoria_.value.split('#').pop();

      return {
        id_alojamiento_ontologia: idAlojamiento, // Puedes usar esto como un identificador único
        nombre: item.Nombre_.value,
        capacidad: parseInt(item.Capacidad_.value), // Asegurarse de que sea un número
        categoria: categoriaLimpia,
        descripcion: item.Descripcion_.value,
        // Si tu consulta SPARQL tuviera latitud, longitud, etc., las añadirías aquí
        // latitud: item.latitud_ontologia ? parseFloat(item.latitud_ontologia.value) : null,
        // longitud: item.longitud_ontologia ? parseFloat(item.longitud_ontologia.value) : null,
        // numeroHabitaciones: item.numeroHabitaciones_ontologia ? parseInt(item.numeroHabitaciones_ontologia.value) : null,
      };
    });

    // En este punto, 'alojamientosOntologia' ya contiene todos los datos que trajiste de la ontología.
    // Si NO necesitas combinar con MySQL, puedes responder directamente con esto.
    return successResponse(res, alojamientosOntologia, 'Alojamientos de ontología obtenidos exitosamente');

  } catch (error) {
    console.error('Error al obtener alojamientos enriquecidos desde la ontología:', error);
    // Es buena práctica no exponer detalles internos del error en producción
    return errorResponse(res, 'Error al obtener datos de alojamientos desde la ontología');
  }
}

module.exports = {
  getEnrichedHotels // Exporta la función
};