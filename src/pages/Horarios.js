//Horarios.js
import React, { useState, useContext, useEffect } from 'react';
import { AuthContext } from '../AuthContext';
import Papa from 'papaparse';
import logo from '../assets/logo.png';
import './Horarios.css';

function Horarios() {
  const { user } = useContext(AuthContext);
  const [horarios, setHorarios] = useState(() => {
    const storedData = sessionStorage.getItem('horarios');
    return storedData ? JSON.parse(storedData) : [];
  });
  const [cursoSeleccionado, setCursoSeleccionado] = useState("1er año");
  const [archivoSeleccionado, setArchivoSeleccionado] = useState(null);
  const [errores, setErrores] = useState([]);
  const [filasErroneas, setFilasErroneas] = useState(0);

  // Listas de validación
  const diasValidos = ["LUNES", "MARTES", "MIERCOLES", "JUEVES", "VIERNES"];
  const horasValidas = [
    "8:15 a 8:55", "8:55 a 9:35", "9:35 a 9:50", "9:50 a 10:30", "10:30 a 11:10",
    "11:10 a 11:25", "11:25 a 12:05", "12:05 a 12:45", "12:45 a 13:20", "13:20 a 14:00",
    "14:00 a 14:40", "14:40 a 15:20", "15:20 a 15:30", "15:30 a 16:10"
  ];
  const cursosValidos = ["1er año", "2do año", "3er año", "4to año", "5to año"];
  const horasEspeciales = {
    "9:35 a 9:50": "RECREO",
    "11:10 a 11:25": "RECREO",
    "12:45 a 13:20": "ALMUERZO",
    "15:20 a 15:30": "RECREO"
  };

  // Guardar horarios en sessionStorage
  useEffect(() => {
    sessionStorage.setItem('horarios', JSON.stringify(horarios));
  }, [horarios]);

  // Selección de archivo CSV
  const handleFileSelect = (event) => {
    setArchivoSeleccionado(event.target.files[0]);
  };

  // Cargar CSV y actualizar horarios
  const handleCSVUpload = () => {
    if (!archivoSeleccionado) {
      setErrores(["Debes seleccionar un archivo"]);
      setFilasErroneas(0);
      return;
    }

    Papa.parse(archivoSeleccionado, {
      complete: (result) => {
        if (!result.data || result.data.length === 0) {
          setErrores(["Ocurrió un error al subir el archivo"]);
          setFilasErroneas(0);
          return;
        }

        let filasErroneas = 0;
        let detallesErrores = [];
        const data = result.data
          .filter((row, index) => {
            const dia = row["Día"] ? row["Día"].trim().toUpperCase() : "";
            const hora = row["Hora"] ? row["Hora"].trim() : "";
            const curso = row["Curso"] ? row["Curso"].trim() : "";

            const diaValido = diasValidos.includes(dia);
            const horaValida = horasValidas.includes(hora);
            const cursoValido = cursosValidos.includes(curso);

            if (!diaValido || !horaValida || !cursoValido) {
              filasErroneas++;
              detallesErrores.push(`Línea ${index + 1}: Día: ${dia}, Hora: ${hora}, Curso: ${curso} - ❌ Error en uno o más campos.`);
              return false;
            }
            return true;
          })
          .map(row => ({
            Día: row["Día"].trim().toUpperCase(),
            Hora: row["Hora"].trim(),
            Materia: row["Materia"] ? row["Materia"].trim().toUpperCase() : "",
            Submateria: row["Submateria/Grupo"] ? row["Submateria/Grupo"].trim() : "",
            Docente: row["Docente"] ? row["Docente"].trim() : "",
            Curso: row["Curso"].trim()
          }));

        setHorarios(data);
        setFilasErroneas(filasErroneas);
        setErrores(detallesErrores);
      },
      header: true,
      skipEmptyLines: true
    });
  };

  return (
    <div className="horarios-container">
      <img src={logo} alt="Logo Colegio" className="horarios-logo" />
      <h2 className="horarios-title">Horarios</h2>

      {user?.rol === 'administrador' && <h3 className="admin-label">Administradores</h3>}

      <div className="button-container">
        {cursosValidos.map((curso, index) => (
          <button
            key={index}
            onClick={() => setCursoSeleccionado(curso)}
            className={`year-button ${cursoSeleccionado === curso ? 'active' : ''}`}
          >
            {curso}
          </button>
        ))}
      </div>

      <table className="horarios-table">
        <thead>
          <tr>
            <th>Horas</th>
            {diasValidos.map(dia => <th key={dia}>{dia}</th>)}
          </tr>
        </thead>
        <tbody>
  {horasValidas.map((hora, index) => {
    // Si es un horario especial, unir las celdas en una sola fila
    if (horasEspeciales[hora]) {
      return (
        <tr key={index} className="reduced-height">
          <td>{hora}</td>
          <td colSpan={5} className="special-cell">{horasEspeciales[hora]}</td>
        </tr>
      );
    }

    return (
      <tr key={index}>
        <td>{hora}</td>
        {diasValidos.map(dia => {
          // Filtrar todas las materias que coincidan con el curso, día y hora
          const materias = horarios.filter(h =>
            h.Curso === cursoSeleccionado &&
            h.Hora === hora &&
            h.Día === dia
          );

          return (
            <td key={dia}>
              {materias.length > 0 ? (
                materias.map((materia, idx) => (
                  <div key={idx} className="materia-box">
                    <strong>{materia.Materia}</strong>
                    <br />
                    {materia.Docente}
                  </div>
                ))
              ) : ''}
            </td>
          );
        })}
      </tr>
    );
  })}
</tbody>

      </table>

      {user?.rol === 'administrador' && (
        <div className="upload-container">
          <input type="file" accept=".csv" onChange={handleFileSelect} className="file-input" />
          <button onClick={handleCSVUpload} className="button upload">Actualizar horario</button>
        </div>
      )}

      {errores.length > 0 && (
        <div className="error-messages">
          <h4>Errores detectados:</h4>
          <p>{filasErroneas} filas fueron excluidas por errores.</p>
          <ul>
            {errores.map((error, index) => <li key={index}>{error}</li>)}
          </ul>
        </div>
      )}
    </div>
  );
}

export default Horarios;
