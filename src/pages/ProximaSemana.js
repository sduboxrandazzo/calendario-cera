//ProximaSemana.js
import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "../AuthContext";
import "./ProximaSemana.css";

const ProximaSemana = () => {
  const { user } = useContext(AuthContext);

  // === 1) Leer feriados, salidas y horarios desde sessionStorage ===
  const storedFeriados = sessionStorage.getItem("feriados");
  const feriadosEnStorage = storedFeriados ? JSON.parse(storedFeriados) : [];

  const storedSalidas = sessionStorage.getItem("salidas");
  const salidasEnStorage = storedSalidas ? JSON.parse(storedSalidas) : [];

  // Horarios guardados por Horarios.js
  const storedHorarios = sessionStorage.getItem("horarios");
  const horariosEnStorage = storedHorarios ? JSON.parse(storedHorarios) : [];

  // === Reloj y fecha/hora actual (se muestra arriba) ===
  const [fechaHora, setFechaHora] = useState(new Date());
  useEffect(() => {
    const timer = setInterval(() => {
      setFechaHora(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // === Funciones para determinar la "semana" (lunes a viernes) ===
  const getMondayOfRelevantWeek = (currentDate) => {
    const date = new Date(currentDate);
    date.setHours(0, 0, 0, 0);
    const dayOfWeek = date.getDay(); // 0=Domingo, 1=Lunes, etc.

    if (dayOfWeek >= 1 && dayOfWeek <= 5) {
      // Si es lunes(1) a viernes(5), tomamos el lunes de esta semana
      date.setDate(date.getDate() - (dayOfWeek - 1));
    } else {
      // Si es sábado(6) o domingo(0), tomamos el lunes de la próxima semana
      const offset = dayOfWeek === 6 ? 2 : 1;
      date.setDate(date.getDate() + offset);
    }
    return date;
  };

  // Estados: lunes de la semana + día seleccionado (0..4)
  const [selectedWeekMonday, setSelectedWeekMonday] = useState(() =>
    getMondayOfRelevantWeek(new Date())
  );
  const [selectedDayIndex, setSelectedDayIndex] = useState(0);

  // === Cambio de semana (anterior/siguiente) => siempre mostrar lunes (index=0) ===
  const irSemanaAnterior = () => {
    const newDate = new Date(selectedWeekMonday);
    newDate.setDate(newDate.getDate() - 7);
    setSelectedWeekMonday(newDate);
    setSelectedDayIndex(0);
  };

  const irSemanaSiguiente = () => {
    const newDate = new Date(selectedWeekMonday);
    newDate.setDate(newDate.getDate() + 7);
    setSelectedWeekMonday(newDate);
    setSelectedDayIndex(0);
  };

  // Cambio de día (lunes..viernes)
  const irADiaDeLaSemana = (index) => {
    setSelectedDayIndex(index);
  };

  // === Fecha visualizada (lunes + offset del día) ===
  const fechaVisualizada = new Date(selectedWeekMonday);
  fechaVisualizada.setDate(fechaVisualizada.getDate() + selectedDayIndex);

  // === Formateo para la fecha/hora actual (cabezal) ===
  const diasSemana = ["Domingo","Lunes","Martes","Miércoles","Jueves","Viernes","Sábado"];
  const meses = [
    "enero","febrero","marzo","abril","mayo","junio","julio",
    "agosto","septiembre","octubre","noviembre","diciembre"
  ];

  const diaSemanaActual = diasSemana[fechaHora.getDay()];
  const diaNumero = fechaHora.getDate();
  const mesActual = meses[fechaHora.getMonth()];
  const horas = String(fechaHora.getHours()).padStart(2, "0");
  const minutos = String(fechaHora.getMinutes()).padStart(2, "0");
  const segundos = String(fechaHora.getSeconds()).padStart(2, "0");

  const fechaFormateada = `${diaSemanaActual} ${diaNumero} de ${mesActual}`;
  const horaFormateada = `${horas}:${minutos}:${segundos} hs.`;

  // === Formatear la fecha visualizada (para mostrar en pantalla) ===
  const diaSemanaVis = diasSemana[fechaVisualizada.getDay()];
  const diaNumeroVis = fechaVisualizada.getDate();
  const mesVis = meses[fechaVisualizada.getMonth()];
  const fechaVisualizadaStr = `${diaSemanaVis} ${diaNumeroVis} de ${mesVis}`;

  // === Conversión de fechaVisualizada a "YYYY-MM-DD" ===
  const yyyy = fechaVisualizada.getFullYear();
  const mm = String(fechaVisualizada.getMonth() + 1).padStart(2, "0");
  const dd = String(fechaVisualizada.getDate()).padStart(2, "0");
  const fechaYMD = `${yyyy}-${mm}-${dd}`;

  // === 2) Buscar si la fecha visualizada es feriado ===
  const feriadoEncontrado = feriadosEnStorage.find(
    (f) => f.fecha === fechaYMD
  );

  // === 3) Franjas horarias (mismas que en Horarios.js) ===
  const franjasHorarias = [
    "8:15 a 8:55", "8:55 a 9:35", "9:35 a 9:50", "9:50 a 10:30",
    "10:30 a 11:10", "11:10 a 11:25", "11:25 a 12:05", "12:05 a 12:45",
    "12:45 a 13:20", "13:20 a 14:00", "14:00 a 14:40", "14:40 a 15:20",
    "15:20 a 15:30", "15:30 a 16:10",
  ];

  // Cursos (columnas)
  const cursos = ["1er año", "2do año", "3er año", "4to año", "5to año"];

  // En Horarios.js, el día se guarda como LUNES, MARTES, etc. en mayúsculas
  // Convertimos "Lunes" -> "LUNES", "Martes" -> "MARTES", etc.
  const diaVisEnMayus = diaSemanaVis.toUpperCase();

  // === Funciones auxiliares para "salidas" ===
  // Parsear la franja "8:15 a 8:55" en Date [inicio, fin] con la fecha actual
  const parsearFranjaAHoras = (franja) => {
    const [parteInicio, parteFin] = franja.split(" a "); 
    const [horaI, minI] = parteInicio.split(":");
    const [horaF, minF] = parteFin.split(":");

    const dateInicio = new Date(`${fechaYMD}T${horaI.padStart(2, "0")}:${minI}:00`);
    const dateFin = new Date(`${fechaYMD}T${horaF.padStart(2, "0")}:${minF}:00`);
    return [dateInicio, dateFin];
  };

  // Chequear si la franja [fInicio, fFin] + curso se solapa con alguna salida en salidasEnStorage
  const estaDentroDeSalida = (franjaInicio, franjaFin, curso) => {
    for (const salida of salidasEnStorage) {
      // Cada salida tiene "inicio", "fin" en formato "YYYY-MM-DDTHH:mm"
      // y un array "cursos" con los cursos afectados
      if (!salida.cursos.includes(curso)) continue;

      const dateInicioSalida = new Date(salida.inicio);
      const dateFinSalida = new Date(salida.fin);
      // Comprobamos solapamiento
      if (franjaInicio < dateFinSalida && franjaFin > dateInicioSalida) {
        return salida.titulo;
      }
    }
    return null;
  };

  return (
    <div className="contenedorProximaSemana">
      {/* Encabezado */}
      <div className="headerProximaSemana">
        <h1 className="tituloReservas">Reservas</h1>
        <small className="fechaHora">
          {fechaFormateada} - {horaFormateada}
        </small>
      </div>

      {/* Sólo para administradores */}
      {user?.rol === "administrador" && (
        <p className="textoAdmin">Opciones exclusivas del Administrador</p>
      )}

      {/* Navegación: semana y días (lunes..viernes) */}
      <div className="navegacionAgenda">
        <button onClick={irSemanaAnterior}>Anterior (Semana)</button>

        <button onClick={() => irADiaDeLaSemana(0)}>Lunes</button>
        <button onClick={() => irADiaDeLaSemana(1)}>Martes</button>
        <button onClick={() => irADiaDeLaSemana(2)}>Miércoles</button>
        <button onClick={() => irADiaDeLaSemana(3)}>Jueves</button>
        <button onClick={() => irADiaDeLaSemana(4)}>Viernes</button>

        <button onClick={irSemanaSiguiente}>Siguiente (Semana)</button>
      </div>

      {/* Fecha del día seleccionado */}
      <div className="diaSeleccionado">
        <strong>{fechaVisualizadaStr}</strong>
      </div>

      {/* Tabla de franjas => Condicional si es feriado o no */}
      <table className="tablaCalendario">
        <thead>
          <tr>
            <th>Horario</th>
            {cursos.map((curso) => (
              <th key={curso}>{curso}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {feriadoEncontrado ? (
            // Si es feriado => una sola fila con colSpan = #columnas + 1
            <tr>
              <td colSpan={cursos.length + 1}>
                <strong>{`Feriado: ${feriadoEncontrado.titulo}`}</strong>
              </td>
            </tr>
          ) : (
            // Si NO hay feriado, mostramos las franjas
            franjasHorarias.map((franja, index) => {
              const [franjaInicioDate, franjaFinDate] = parsearFranjaAHoras(franja);

              return (
                <tr key={index}>
                  <td>{franja}</td>
                  {cursos.map((curso) => {
                    // Primero, verificar si la franja para este curso está bloqueada por una salida
                    const tituloSalida = estaDentroDeSalida(
                      franjaInicioDate,
                      franjaFinDate,
                      curso
                    );

                    if (tituloSalida) {
                      // Si está bloqueada por salida, mostramos la leyenda de la salida
                      return (
                        <td key={curso}>
                          <strong>{tituloSalida}</strong>
                        </td>
                      );
                    } else {
                      // No está bloqueada => mostramos las materias de Horarios
                      const materias = horariosEnStorage.filter((h) =>
                        h.Día === diaVisEnMayus &&
                        h.Hora === franja &&
                        h.Curso === curso
                      );

                      // Si NO hay materias => celda vacía sin select
                      if (materias.length === 0) {
                        return <td key={curso}></td>;
                      }

                      // Si HAY materias => las mostramos (incluyendo el select en cada subdivisión)
                      return (
                        <td key={curso}>
                          {materias.map((m, idx) => (
                            <div key={idx} className="materia-box">
                              <strong>{m.Materia}</strong><br />
                              {m.Docente}
                              {m.Submateria && (
                                <div className="submateria">{m.Submateria}</div>
                              )}
                              {/* Solo mostramos SELECT si hay info de materia */}
                              <select className="select-reserva">
                                <option>Seleccione...</option>
                              </select>
                            </div>
                          ))}
                        </td>
                      );
                    }
                  })}
                </tr>
              );
            })
          )}
        </tbody>
      </table>
    </div>
  );
};

export default ProximaSemana;
