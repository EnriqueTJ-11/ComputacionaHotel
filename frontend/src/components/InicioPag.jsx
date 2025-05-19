import React from 'react';
import '../styles/InicioPag.css'; // Importa los estilos CSS
import Busqueda from '../components/Reserva'; // Importa los estilos CSS

function InicioPag() {
    return (
        <div className="inicio-pag">
           
            <Busqueda />

            <div className="contenedor-hoteles">
                {/* Aquí puedes mapear tus datos de hoteles y renderizar los contenedores */}
                <div className="hotel-container">
                    {/* Espacio para la información del hotel */}
                    <h3>Hotel Ejemplo 1</h3>
                    <p>Descripción breve del hotel.</p>
                    {/* ... más información ... */}
                </div>
                <div className="hotel-container">
                    {/* Espacio para la información del hotel */}
                    <h3>Hotel Ejemplo 2</h3>
                    <p>Descripción breve del hotel.</p>
                    {/* ... más información ... */}
                </div>
                <div className="hotel-container">
                    {/* Espacio para la información del hotel */}
                    <h3>Hotel Ejemplo 3</h3>
                    <p>Descripción breve del hotel.</p>
                    {/* ... más información ... */}
                </div>
                <div className="hotel-container">
                    {/* Espacio para la información del hotel */}
                    <h3>Hotel Ejemplo 4</h3>
                    <p>Descripción breve del hotel.</p>
                    {/* ... más información ... */}
                </div>
                <div className="hotel-container">
                    {/* Espacio para la información del hotel */}
                    <h3>Hotel Ejemplo 5</h3>
                    <p>Descripción breve del hotel.</p>
                    {/* ... más información ... */}
                </div>
                <div className="hotel-container">
                    {/* Espacio para la información del hotel */}
                    <h3>Hotel Ejemplo 6</h3>
                    <p>Descripción breve del hotel.</p>
                    {/* ... más información ... */}
                </div>
                <div className="hotel-container">
                    {/* Espacio para la información del hotel */}
                    <h3>Hotel Ejemplo 7</h3>
                    <p>Descripción breve del hotel.</p>
                    {/* ... más información ... */}
                </div>
                <div className="hotel-container">
                    {/* Espacio para la información del hotel */}
                    <h3>Hotel Ejemplo 8</h3>
                    <p>Descripción breve del hotel.</p>
                    {/* ... más información ... */}
                </div>
                {/* ... puedes agregar más contenedores según la cantidad de hoteles ... */}
            </div>
        </div>
    );
}

export default InicioPag;