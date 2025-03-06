import React, { useState, useContext } from 'react';
import { AuthContext } from '../AuthContext';
import Papa from 'papaparse';
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';
import logo from '../assets/logo.png';
import './Horarios.css';

function Horarios() {
  const { user } = useContext(AuthContext);

  const [horarios, setHorarios] = useState([]);
  const [cursoSeleccionado, setCursoSeleccionado] = useState(1);
  const [archivoSeleccionado, setArchivoSeleccionado] = useState(null);
  const [mensaje, setMensaje] = useState(null);

  const horas = [
    "8:15 a 8:55", "8:55 a 9:35", "9:35 a 9:50", "9:50 a 10:30", "10:30 a 11:10",
    "11:10 a 11:25", "11:25 a 12:05", "12:05 a 12:45", "12:45 a 13:20", "13:20 a 14:00",
    "14:00 a 14:40", "14:40 a 15:20", "15:20 a 15:30", "15:30 a 16:10"
  ];
  const dias = ["LUNES", "MARTES", "Miércoles", "Jueves", "Viernes"];

  // Función para manejar la selección del archivo CSV
  const handleFileSelect = (event) => {
    setArchivoSeleccionado(event.target.files[0]);
  };

  // Función para procesar y cargar el CSV con el nuevo orden de columnas
  const handleCSVUpload = () => {
    if (!archivoSeleccionado) {
      setMensaje({ tipo: "error", texto: "Debes seleccionar un archivo" });
      return;
    }

    Papa.parse(archivoSeleccionado, {
      complete: (result) => {
        if (!result.data || result.data.length === 0) {
          setMensaje({ tipo: "error", texto: "Ocurrió un error al subir el archivo" });
          return;
        }

        const data = result.data.filter(row => row.length > 1).map(row => ({
          Día: row["Día"], // Nueva estructura
          Hora: row["Hora"],
          Materia: row["Materia"],
          Submateria: row["Submateria/Grupo"] || "", // Si no hay submateria, dejar vacío
          Docente: row["Docente"],
          Curso: row["Curso"]
        }));

        setHorarios(data);
        setMensaje({ tipo: "success", texto: "Horario actualizado satisfactoriamente" });

        // Ocultar mensaje después de 3 segundos
        setTimeout(() => setMensaje(null), 3000);
      },
      header: true,
      error: () => {
        setMensaje({ tipo: "error", texto: "Ocurrió un error al subir el archivo" });
      }
    });
  };

  // Función para generar y descargar un PDF con el horario
  const handlePrintPDF = () => {
    const doc = new jsPDF();
    doc.text(`Horario de ${cursoSeleccionado}° año`, 14, 20);
    doc.addImage(logo, 'PNG', 160, 10, 30, 30);
    doc.autoTable({
      head: [['Horas', ...dias]],
      body: horas.map((hora) => [
        hora,
        ...dias.map(dia => {
          const materia = horarios.find(h =>
            h.Curso === `${cursoSeleccionado}` && h.Hora === hora && h.Día === dia
          );
          return materia ? `${materia.Materia} ${materia.Submateria ? `(${materia.Submateria})` : ''} (${materia.Docente})` : '';
        })
      ]),
      startY: 40
    });
    doc.save(`Horario_${cursoSeleccionado}Año.pdf`);
  };

  return (
    <div className="horarios-container">
      <img src={logo} alt="Logo Colegio" className="horarios-logo" />
      <h2 className="horarios-title">Horarios</h2>

      {user?.rol === 'administrador' && <h3 className="admin-label">Administradores</h3>}

      <div className="button-container">
        {[1, 2, 3, 4, 5].map(año => (
          <button
            key={año}
            onClick={() => setCursoSeleccionado(año)}
            className={`year-button ${cursoSeleccionado === año ? 'active' : ''}`}
          >
            {año}° Año
          </button>
        ))}
      </div>

      <table className="horarios-table">
        <thead>
          <tr>
            <th>Horas</th>
            {dias.map(dia => <th key={dia}>{dia}</th>)}
          </tr>
        </thead>
        <tbody>
          {horas.map((hora, index) => (
            <tr key={index}>
              <td>{hora}</td>
              {dias.map(dia => {
                const materia = horarios.find(h =>
                  h.Curso === `${cursoSeleccionado}` && h.Hora === hora && h.Día === dia
                );
                return <td key={dia}>{materia ? `${materia.Materia} ${materia.Submateria ? `(${materia.Submateria})` : ''} (${materia.Docente})` : ''}</td>;
              })}
            </tr>
          ))}
        </tbody>
      </table>

      <button onClick={handlePrintPDF} className="button print">Imprimir horario</button>

      {user?.rol === 'administrador' && (
        <div className="upload-container">
          <input type="file" accept=".csv" onChange={handleFileSelect} className="file-input" />
          <button onClick={handleCSVUpload} className="button upload">Actualizar horario</button>
        </div>
      )}

      {mensaje && <p className={`mensaje ${mensaje.tipo}`}>{mensaje.texto}</p>}
    </div>
  );
}

export default Horarios;
