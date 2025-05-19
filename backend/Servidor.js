const express = require('express');
const cors = require('cors'); // Importa el middleware CORS
const SparqlClient = require('sparql-client-2');
const mysql = require('mysql2/promise'); // Importa el driver de MySQL

const app = express();
const port = 3000;

const endpoint = 'http://localhost:3030/hotel_data/query'; // SPARQL endpoint URL
const client = new SparqlClient(endpoint);

app.use(cors()); // Habilita CORS para todas las rutas y orígenes
app.use(express.json()); // Para analizar el cuerpo de las peticiones POST

// ==========================================================
//  Configuración de la Conexión a MySQL
// ==========================================================
const pool = mysql.createPool({
  host: 'localhost',      // O la dirección de tu servidor MySQL
  user: 'root', // Tu usuario de MySQL
  password: '0107', // Tu contraseña de MySQL
  database: 'hotel_app',    // El nombre de tu base de datos
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// Función para ejecutar consultas SQL
async function ejecutarConsultaMySQL(query, params) {
    try {
        const [rows] = await pool.execute(query, params);
        console.log('Resultados:', rows);
        return rows;
    } catch (error) {
        console.error('Error al ejecutar la consulta:', error);
        throw error;
    }
}

// ==========================================================
//  Ruta para consultar la ontología (existente)
// ==========================================================
app.get('/query-ontologia', (req, res) => { // Cambié el nombre para evitar confusión
  const query = `
    PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>
    PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
    PREFIX : <http://www.semanticweb.org/ontologies/hospedaje#>


    SELECT ?hotel 

    WHERE {
      ?hotel rdf:type :Hotel ;

             
    }
    LIMIT 10

  `;

  client.query(query).execute()
    .then(result => {
      res.json(result.results.bindings);
    })
    .catch(err => {
      res.status(500).json({ error: 'Error querying ontology' });
    });
});

// ==========================================================
//  Rutas para interactuar con la base de datos MySQL
// ==========================================================

// Ruta para registrar un nuevo usuario (usando procedimiento almacenado)
app.post('/usuarios/registrar', async (req, res) => {
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

        const bcrypt = require('bcrypt');
        const hashedPassword = await bcrypt.hash(contrasena_usuario, 10);

        // Llamar al procedimiento almacenado
        await ejecutarConsultaMySQL(
            'CALL sp_registrar_usuario(?, ?, ?, ?, ?, ?, ?)',
            [email_usuario, hashedPassword, nombre1_usuario, nombre2_usuario, apellido1_usuario, apellido2_usuario, rol_id]
        );

        res.status(201).json({ mensaje: 'Usuario registrado con éxito' }); // Ya no enviamos el ID

    } catch (error) {
        console.error('Error al registrar usuario:', error);
        res.status(500).json({ error: 'Error al registrar usuario' });
    }
});


// traer roles
app.get('/roles-usuario-cliente', async (req, res) => {
    try {
        const result = await ejecutarConsultaMySQL(
            'SELECT id_rol, nombre_rol FROM roles WHERE nombre_rol IN (?, ?)',
            ['Usuario', 'Cliente']
        );
        console.log('Tipo de result:', typeof result);
        console.log('Contenido de result:', result);
        const roles = result; // ¡Corrección aquí!

        const rolesMap = {};
        roles.forEach(rol => {
            rolesMap[rol.nombre_rol] = rol.id_rol;
        });

        res.json(rolesMap);
    } catch (error) {
        console.error('Error al obtener IDs de roles:', error);
        res.status(500).json({ error: 'Error al obtener IDs de roles' });
    }
});

// ==========================================================
//  Rutas que combinan la ontología y la base de datos MySQL
// ==========================================================

// Ejemplo: Obtener hoteles de MySQL y enriquecerlos con datos de la ontología (ADAPTAR)
app.get('/alojamientos-completos', async (req, res) => { // Renombré la ruta para mayor claridad
  try {
    // 1. Obtener hoteles de MySQL (¡No cambia!)
    const hotelesMySQL = await ejecutarConsultaMySQL(`
      SELECT 
        id_hotel, 
        nombre_hotel, 
        descripcion_hotel, 
        imagen_hotel 
      FROM hoteles
    `);

    // 2. Consulta SPARQL (Modificada para Alojamiento)
    const hotelIds = hotelesMySQL.map(hotel => hotel.id_hotel).join('", "'); 

    const consultaOntologia = `
      PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>
      PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
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

    // 3. Ejecutar la consulta SPARQL
    const resultadosOntologia = await client.query(consultaOntologia).execute();

    // 4. Combinar los resultados (Modificado para Alojamiento)
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

    // 5. Enviar la respuesta
    res.json(alojamientosCompletos);

  } catch (error) {
    console.error('Error al obtener alojamientos completos:', error);
    res.status(500).json({ error: 'Error al obtener datos de alojamientos' });
  }
});

app.listen(port, () => {
  console.log(`Servidor corriendo en http://localhost:${port}/query-ontologia`);
  console.log(`Servidor corriendo en http://localhost:${port}/roles-usuario-cliente`);
});