//Horaris.js
import React from 'react';
import logo from "../assets/logo.png";



// También puedes obtenerlo desde un contexto, Redux, etc.
function Horarios({ userRole }) {
  // Para simplificar, asumimos que hay cinco años (1º a 5º).
  // Si tuvieras la data de los horarios en un estado o en props, podrías mapearla aquí.
  // Por ejemplo, si fuera un objeto con claves '1', '2', '3', etc. y cada clave contuviera sus horarios.
  
  const years = [1, 2, 3, 4, 5];

  const handleCSVUpload = (e) => {
    // Manejador de subida de archivos CSV
    // Implementa aquí la lógica para leer el CSV y cargar la información.
    console.log('Archivo CSV subido:', e.target.files[0]);
  };

  // Función de ejemplo para el botón Imprimir (por ahora sin funcionalidad completa).
  const handlePrint = (year) => {
    // Lógica de impresión por año (vacío por ahora).
    console.log(`Imprimiendo horarios de ${year}° año`);
  };

  // Render para cada año (el contenido de la tabla y la forma de imprimir puede variar).
  // Aquí lo dejamos como un ejemplo genérico.
  const renderYearSchedule = (year) => {
    return (
      <div key={year} style={{ marginBottom: '1rem' }}>
        <h3>Horarios {year}° año</h3>
        <button onClick={() => handlePrint(year)}>
          Imprimir
        </button>
        <div style={{ border: '1px solid black', marginTop: '0.5rem' }}>
          {/* Aquí iría la tabla de horarios de {year}° año */}
          <p>Tabla de horarios de {year}° año</p>
        </div>
      </div>
    );
  };

  return (
    <div style={{ padding: '1rem', fontFamily: 'sans-serif' }}>
      {/* 1. Logo pequeño del colegio */}
      <img src={logo} alt="Logo Colegio" className="logo" 
      style={{ width: '80px', marginBottom: '1rem' }}
      />

      {/* 2. Frase: "Horarios" */}
      <h2>Horarios</h2>

      {/* Condicional: si es admin, mostramos los elementos extra */}
      {userRole === 'administrador' && (
        <div>
          {/* 3. Frase: "Perfil administradores" */}
          <h3>Perfil administradores</h3>

          {/* 4. Botón para adjuntar archivo CSV */}
          <div>
            <label htmlFor="csvFile">
              Importar CSV:
              <input
                id="csvFile"
                type="file"
                accept=".csv"
                onChange={handleCSVUpload}
              />
            </label>
          </div>

          {/* El bloque para cada año (1º a 5º) con la frase "Horarios X año", botón imprimir y tabla */}
          {years.map((year) => renderYearSchedule(year))}
        </div>
      )}

      {/* Condicional: si es docente, mostramos solo la parte de horarios sin CSV y sin la frase "Perfil administradores" */}
      {userRole === 'docente' && (
        <div>
          {years.map((year) => renderYearSchedule(year))}
        </div>
      )}
    </div>
  );
}

export default Horarios;
