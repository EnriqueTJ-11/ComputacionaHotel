const { queryClient, updateClient } = require('../config/sparql.config');
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
                     :capacidadTotal ?capacidad ;
                     :descripcion ?descripcion.
        OPTIONAL { ?alojamiento :categoria ?categoria . } 
      }
      ORDER BY ?nombre
    `;

    // 1. Ejecutar consulta SPARQL
    const resultadosOntologia = await queryClient.query(consultaSPARQL).execute();

    // 2. Formatear los resultados para el frontend
    const alojamientosFormateados = resultadosOntologia.results.bindings.map(item => {
      // Extrae solo la parte relevante del URI para el ID
      const idAlojamiento = item.alojamiento ? item.alojamiento.value.split('#').pop() : null; // Debería existir siempre

      return {
        id_alojamiento: idAlojamiento, // Un ID útil para el frontend
        nombre: item.Nombre_ ? item.Nombre_.value : null, // Acceso seguro
        capacidad: item.Capacidad_ ? parseInt(item.Capacidad_.value) : null, // Acceso seguro y parseo
        
        // **Este es el punto clave:** acceso seguro a 'Categoria_'
        categoria: item.Categoria_ ? item.Categoria_.value.split('#').pop() : null,
        
        descripcion: item.Descripcion_ ? item.Descripcion_.value : null // Acceso seguro
      };
    });

    // 3. Responder con los datos formateados
    return successResponse(res, alojamientosFormateados, 'Alojamientos de ontología obtenidos exitosamente');

  } catch (error) {
    console.error('Error consultando ontología (¡ATENCIÓN!):', error); 
    // Asegúrate de que este `console.error` te muestre el detalle del error en tu servidor.
    // Para producción, podrías simplificar el error para el cliente
    return errorResponse(res, 'Error interno del servidor al consultar la ontología', error.message);
  }
}

async function createAlojamiento(req, res) {
  try {
    if (!req.body || Object.keys(req.body).length === 0) {
      return errorResponse(res, 'No se recibieron datos en el cuerpo de la petición', 400); // Ajuste aquí
    }

    const {
      tipoEstablecimientoId,
      nombre_alojamiento,
      emailContacto,
      direccionEstablecimiento,
      descripcionEstablecimiento,
      numero_establecimiento,
      capacidad_total,
      num_habitaciones,
      latitud = null,
      longitud = null,
      horarioApertura = null,
      horarioCierre = null,
      esAccesible = null, 
      categoria = null
    } = req.body;

    // --- Validación básica de los datos ---
    if (!tipoEstablecimientoId || !nombre_alojamiento || !capacidad_total || !num_habitaciones || !descripcionEstablecimiento) {
      return errorResponse(res, 'Faltan campos obligatorios para el alojamiento.', 400); // Ajuste aquí
    }
    
    if (isNaN(parseInt(capacidad_total)) || parseInt(capacidad_total) <= 0) {
      return errorResponse(res, 'La capacidad total debe ser un número entero positivo.', 400); // Ajuste aquí
    }
    
    if (isNaN(parseInt(num_habitaciones)) || parseInt(num_habitaciones) <= 0) {
      return errorResponse(res, 'El número de habitaciones debe ser un número entero positivo.', 400); // Ajuste aquí
    }

    const alojamientoUri = `Alojamiento_${Date.now()}`;
    const tipoAlojamientoOntologia = tipoEstablecimientoId;

    // Iniciar la consulta INSERT DATA
    let insertTriples = []; // Usaremos un array para construir las triples

    // --- Triples del Alojamiento ---
    let alojamientoTriples = `
  :${alojamientoUri} rdf:type :${tipoAlojamientoOntologia} ;
                     :nombre "${nombre_alojamiento}" ;
                     :capacidadTotal "${parseInt(capacidad_total)}"^^xsd:integer ;
                     :descripcion "${descripcionEstablecimiento}" ;
                     :email "${emailContacto}" ;
                     :telefono "${numero_establecimiento}" ;
                     :direccion "${direccionEstablecimiento}" ;
                     :numeroHabitaciones "${parseInt(num_habitaciones)}"^^xsd:integer`;

    // Añadir propiedades opcionales del Alojamiento
    if (latitud !== null) {
      alojamientoTriples += ` ;
                     :latitud "${latitud}"^^xsd:float`;
    }
    if (longitud !== null) {
      alojamientoTriples += ` ;
                     :longitud "${longitud}"^^xsd:float`;
    }
    if (horarioApertura !== null) {
      alojamientoTriples += ` ;
                     :horarioApertura "${horarioApertura}"`;
    }
    if (horarioCierre !== null) {
      alojamientoTriples += ` ;
                     :horarioCierre "${horarioCierre}"`;
    }
    if (esAccesible !== null) {
      alojamientoTriples += ` ;
                     :esAccesible "${esAccesible}"^^xsd:boolean`;
    }
    if (categoria !== null) {
      alojamientoTriples += ` ;
                     :categoria  "${categoria}"^^xsd:integer`;
    }
    alojamientoTriples += ` .`; // <--- ¡Punto final para el Alojamiento!
    insertTriples.push(alojamientoTriples);

    // --- Triples de las Habitaciones y sus relaciones con el Alojamiento ---
    if (parseInt(num_habitaciones) > 0) {
      for (let i = 1; i <= parseInt(num_habitaciones); i++) {
        const habitacionUri = `Habitacion_${alojamientoUri}_${i}`;
        const numeroCamasDefault = 2;
        const capacidadHabitacionDefault = 4;
        const costoNocheDefault = 80.0;
        const esFumadorDefault = false;

        let habitacionDeclaration = `
  :${habitacionUri} rdf:type :Habitacion ;
                     :numero "${i}"^^xsd:integer ; # <--- ¡CORREGIDO! xsd:integer añadido
                     :numeroCamas "${numeroCamasDefault}"^^xsd:integer ;
                     :capacidad "${capacidadHabitacionDefault}"^^xsd:integer ;
                     :tieneCostoPorNoche "${costoNocheDefault}"^^xsd:float ;
                     :esFumador "${esFumadorDefault}"^^xsd:boolean .`; // <--- ¡Punto final para la Habitacion!
        
        insertTriples.push(habitacionDeclaration);

        // Relación entre Alojamiento y Habitacion
        insertTriples.push(`:${alojamientoUri} :tieneHabitacion :${habitacionUri} .`); // <--- ¡Punto final para la relación!
      }
    }

    // Unir todas las triples y construir la consulta final
    const finalInsertQuery = `
PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>
PREFIX owl: <http://www.w3.org/2002/07/owl#>
PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
PREFIX xsd: <http://www.w3.org/2001/XMLSchema#>
PREFIX : <http://www.semanticweb.org/ontologies/hotel#>

INSERT DATA {
  ${insertTriples.join('\n')}
}`;
    
    console.log("Consulta INSERT SPARQL a ejecutar:\n", finalInsertQuery);

    // Ejecutar la consulta INSERT
    await updateClient.query(finalInsertQuery).execute();

    return successResponse(res, { message: 'Alojamiento y habitaciones insertados en la ontología exitosamente', uri: alojamientoUri });

  } catch (error) {
    console.error('Error al insertar alojamiento en la ontología:', error);
    
    const statusCode = error.httpStatus || 500;
    const errorMsg = error.message || 'Error desconocido';
    
    // Esta llamada ya está correcta según tu última definición de errorResponse
    return errorResponse(res, `Error al insertar alojamiento en la ontología: ${errorMsg}`, statusCode, error);
  }
}

async function getTiposAlojamiento(req, res) {
  try {
    const queryTipos = `
      PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>
      PREFIX owl: <http://www.w3.org/2002/07/owl#>
      PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
      PREFIX xsd: <http://www.w3.org/2001/XMLSchema#>
      PREFIX : <http://www.semanticweb.org/ontologies/hotel#>
      
      SELECT  (REPLACE(STR(?tipoAlojamiento) , "http://www.semanticweb.org/ontologies/hotel#", " ") AS ?nombreTipo)
      WHERE {
        
        ?tipoAlojamiento rdfs:subClassOf :Establecimiento .
      }
      ORDER BY ?nombreTipo
    `;

    const result = await queryClient.query(queryTipos).execute();

    const tiposAlojamiento = result.results.bindings.map(binding => {
      // El nombreTipo ya viene limpio de la consulta
      const nombreCorto = binding.nombreTipo.value.trim(); // Usamos .trim() para eliminar el espacio al inicio
      return { id: nombreCorto, name: nombreCorto }; // id y name serán lo mismo en este caso
    });

    return successResponse(res, tiposAlojamiento, 'Tipos de alojamiento obtenidos exitosamente');

  } catch (error) {
    console.error('Error al obtener tipos de alojamiento desde la ontología:', error);
    return errorResponse(res, 'Error al obtener tipos de alojamiento', error.message);
  }
}

module.exports = {
  queryOntology,
  getTiposAlojamiento,
  createAlojamiento
};