import React, { useState } from "react";
import "./EstaSemana.css";

// Ejemplo de datos de referencia (normalmente se obtendrían de una API o contexto)
const DIAS = ["Lunes", "Martes", "Miércoles", "Jueves", "Viernes"];

const HORARIOS = [
  "8:15 a 8:55",
  "8:55 a 9:35",
  "9:35 a 10:15",
  "10:15 a 10:55",
  "11:05 a 11:45",
  "11:45 a 12:25",
];
const CURSOS = ["1er Año", "2do Año", "3er Año", "4to Año", "5to Año"];

// Entornos disponibles para la reserva
const ENTORNOS = [
  "Robótica",
  "Colaboratorio",
  "ConCiencia",
  "Atelier Digital",
  "TED Classroom",
  "CreArte",
  "Zona SAP",
  "Manos a la Obra",
];

// Ejemplo de materias con subdivisiones (esto es solo un ejemplo)
const MATERIAS_DEMO = [
  { materia: "Matemática", docente: "Profe. García", subdivisiones: [] },
  {
    materia: "Inglés",
    docente: "Profe. Smith",
    subdivisiones: ["Literatura Inglesa", "Artes"],
  },
  { materia: "Historia", docente: "Profe. Romero", subdivisiones: [] },
];

// ---------------------------------------------------------------------
// CeldaHorario: Representa una celda de la tabla con la información:
// - Materia (y subdivisiones si las hubiera)
// - Docente (en caso de subdivisiones, podría ir en cada subcelda, o solo al lado de la materia principal)
// - Select o botón de entorno (según si está o no reservado)
// ---------------------------------------------------------------------
function CeldaHorario({ materia, subdivisiones, docente, entornoReservado, onReservarEntorno }) {
  const [seleccionEntorno, setSeleccionEntorno] = useState(entornoReservado || "");

  // Maneja el cambio de entorno
  const handleChange = (e) => {
    const nuevoEntorno = e.target.value;
    setSeleccionEntorno(nuevoEntorno);
    onReservarEntorno(nuevoEntorno);
  };

  // Si la materia tiene subdivisiones, dividimos la celda en subceldas
  if (subdivisiones && subdivisiones.length > 0) {
    return (
      <div className="celda-subdividida">
        {subdivisiones.map((sub, idx) => (
          <div key={idx} className="subcelda">
            <p>
              <strong>{materia}</strong> - {sub}
            </p>
            <p>{docente}</p>
            {/* Select o botón de entorno (si está reservado) */}
            {seleccionEntorno ? (
              <button
                onClick={() => setSeleccionEntorno("")}
                className="boton-reserva"
              >
                {seleccionEntorno}
              </button>
            ) : (
              <select value={seleccionEntorno} onChange={handleChange}>
                <option value="">-- Seleccionar entorno --</option>
                {ENTORNOS.map((ent) => (
                  <option key={ent} value={ent}>
                    {ent}
                  </option>
                ))}
              </select>
            )}
          </div>
        ))}
      </div>
    );
  }

  // Si NO hay subdivisiones
  return (
    <div className="celda-normal">
      <p>
        <strong>{materia}</strong>
      </p>
      <p>{docente}</p>
      {seleccionEntorno ? (
        <button onClick={() => setSeleccionEntorno("")} className="boton-reserva">
          {seleccionEntorno}
        </button>
      ) : (
        <select value={seleccionEntorno} onChange={handleChange}>
          <option value="">-- Seleccionar entorno --</option>
          {ENTORNOS.map((ent) => (
            <option key={ent} value={ent}>
              {ent}
            </option>
          ))}
        </select>
      )}
    </div>
  );
}

// ---------------------------------------------------------------------
// TablaDia: Genera la tabla de un día específico, con filas = HORARIOS
// y columnas = CURSOS. Cada celda será un CeldaHorario.
// En un proyecto real, obtendrías la info real de cada horario-curso.
// ---------------------------------------------------------------------
function TablaDia({ dia, horarios, cursos, onGuardarReserva }) {
  // Ejemplo: genera datos aleatorios o en blanco para cada curso/horario
  // En la práctica, irás a tu store/API para obtener la materia correspondiente a (dia, curso, horario)
  const obtenerMateriaMock = () => {
    // Retorna aleatoriamente una de las materias demo
    const randomIndex = Math.floor(Math.random() * MATERIAS_DEMO.length);
    return MATERIAS_DEMO[randomIndex];
  };

  return (
    <table className="tabla-horarios">
      <thead>
        <tr>
          <th colSpan={cursos.length + 1}>{dia}</th>
        </tr>
        <tr>
          <th>Horario</th>
          {cursos.map((curso) => (
            <th key={curso}>{curso}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {horarios.map((hora) => (
          <tr key={hora}>
            <td className="col-horario">{hora}</td>
            {cursos.map((curso) => {
              // Ejemplo: generamos info de materia ficticia
              const infoMateria = obtenerMateriaMock();
              return (
                <td key={curso}>
                  <CeldaHorario
                    materia={infoMateria.materia}
                    subdivisiones={infoMateria.subdivisiones}
                    docente={infoMateria.docente}
                    entornoReservado=""
                    onReservarEntorno={(entorno) => {
                      // Guarda la reserva en tu lista global
                      onGuardarReserva({
                        dia,
                        hora,
                        curso,
                        materia: infoMateria.materia,
                        entorno,
                      });
                    }}
                  />
                </td>
              );
            })}
          </tr>
        ))}
      </tbody>
    </table>
  );
}

// ---------------------------------------------------------------------
// ListadoReservas: Solo visible para administradores. Muestra un resumen
// de todas las reservas realizadas.
// ---------------------------------------------------------------------
function ListadoReservas({ reservas }) {
  return (
    <div className="lista-reservas">
      <h3>Listado de Reservas</h3>
      {reservas.length === 0 ? (
        <p>No hay reservas registradas.</p>
      ) : (
        <ul>
          {reservas.map((res, index) => (
            <li key={index}>
              <strong>{res.dia} - {res.hora}</strong> | {res.curso} | {res.materia} | Entorno: {res.entorno}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

// ---------------------------------------------------------------------
// EstaSemana: Componente principal
// - Muestra el "Panel de administradores" si isAdmin = true
// - Muestra las 5 tablas de horarios
// - Si es admin, muestra ListadoReservas al final
// ---------------------------------------------------------------------
const EstaSemana = ({ isAdmin = false }) => {
  const [reservas, setReservas] = useState([]);

  // Esta función se pasa a cada TablaDia para que guarde las reservas que se hagan
  const handleGuardarReserva = (reserva) => {
    // Si ya existe esa reserva en la misma celda, la actualizamos;
    // si no existe, la agregamos. Esto es solo un ejemplo rápido.
    setReservas((prev) => {
      // Verifica si existe ya una reserva para (dia, hora, curso)
      const indice = prev.findIndex(
        (r) => r.dia === reserva.dia && r.hora === reserva.hora && r.curso === reserva.curso
      );
      if (indice >= 0) {
        // Actualiza el entorno
        const copia = [...prev];
        copia[indice] = { ...copia[indice], entorno: reserva.entorno };
        return copia;
      } else {
        // Crea nueva reserva
        return [...prev, reserva];
      }
    });
  };

  return (
    <div className="contenedor-esta-semana">
      <h1>Esta semana</h1>

      {/* Si es admin, mostramos el panel */}
      {isAdmin && (
        <div className="panel-administradores">
          <h2>Panel de administradores</h2>
        </div>
      )}

      <div className="tablas-contenedor">
        {DIAS.map((dia) => (
          <TablaDia
            key={dia}
            dia={dia}
            horarios={HORARIOS}
            cursos={CURSOS}
            onGuardarReserva={handleGuardarReserva}
          />
        ))}
      </div>

      {/* Si es admin, mostramos el listado de reservas */}
      {isAdmin && <ListadoReservas reservas={reservas} />}
    </div>
  );
};

export default EstaSemana;
