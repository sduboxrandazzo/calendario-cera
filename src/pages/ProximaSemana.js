// ProximaSemana.js
import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "../AuthContext";
import "./ProximaSemana.css";

const ProximaSemana = () => {
  const { user } = useContext(AuthContext);

  // --- Datos de configuración ---
  const storedFeriados = sessionStorage.getItem("feriados");
  const feriadosEnStorage = storedFeriados ? JSON.parse(storedFeriados) : [];
  
  const storedSalidas = sessionStorage.getItem("salidas");
  const salidasEnStorage = storedSalidas ? JSON.parse(storedSalidas) : [];
  
  const storedHorarios = sessionStorage.getItem("horarios");
  const horariosEnStorage = storedHorarios ? JSON.parse(storedHorarios) : [];
  
  const storedEntornos = sessionStorage.getItem("entornos");
  const entornosDisponibles = storedEntornos ? JSON.parse(storedEntornos) : [];
  const [entornoSeleccionado, setEntornoSeleccionado] = useState(null);
  const handleSeleccionarEntorno = (entorno) => {
    setEntornoSeleccionado(entorno);
  };
  

  const storedMateriaRules = sessionStorage.getItem("materiaRules");
  const materiaRules = storedMateriaRules ? JSON.parse(storedMateriaRules) : [];
  
  const storedSubmateriaRules = sessionStorage.getItem("submateriaRules");
  const submateriaRules = storedSubmateriaRules ? JSON.parse(storedSubmateriaRules) : [];
  
  // --- Reloj y fecha actual ---
  const [fechaHora, setFechaHora] = useState(new Date());
  useEffect(() => {
    const timer = setInterval(() => setFechaHora(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);
  
  // --- Semana y día seleccionado ---
  const getMondayOfRelevantWeek = (currentDate) => {
    const date = new Date(currentDate);
    date.setHours(0, 0, 0, 0);
    const dayOfWeek = date.getDay();
    if (dayOfWeek >= 1 && dayOfWeek <= 5) {
      date.setDate(date.getDate() - (dayOfWeek - 1));
    } else {
      const offset = dayOfWeek === 6 ? 2 : 1;
      date.setDate(date.getDate() + offset);
    }
    return date;
  };
  
  const [selectedWeekMonday, setSelectedWeekMonday] = useState(() =>
    getMondayOfRelevantWeek(new Date())
  );
  const [selectedDayIndex, setSelectedDayIndex] = useState(0);
  
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
  
  const irADiaDeLaSemana = (index) => {
    setSelectedDayIndex(index);
  };
  
  // --- Fecha visualizada ---
  const fechaVisualizada = new Date(selectedWeekMonday);
  fechaVisualizada.setDate(fechaVisualizada.getDate() + selectedDayIndex);
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
  
  const diaSemanaVis = diasSemana[fechaVisualizada.getDay()];
  const diaNumeroVis = fechaVisualizada.getDate();
  const mesVis = meses[fechaVisualizada.getMonth()];
  const fechaVisualizadaStr = `${diaSemanaVis} ${diaNumeroVis} de ${mesVis}`;
  
  const yyyy = fechaVisualizada.getFullYear();
  const mm = String(fechaVisualizada.getMonth() + 1).padStart(2, "0");
  const dd = String(fechaVisualizada.getDate()).padStart(2, "0");
  const fechaYMD = `${yyyy}-${mm}-${dd}`;
  
  // --- Feriado del día ---
  const feriadoEncontrado = feriadosEnStorage.find((f) => f.fecha === fechaYMD);
  
  // --- Reservas por día ---
  const reservasKey = "reservas-" + fechaYMD;
  const [reservas, setReservas] = useState({});
  useEffect(() => {
    const stored = sessionStorage.getItem(reservasKey);
    if (stored) {
      setReservas(JSON.parse(stored));
    } else {
      setReservas({});
    }
  }, [fechaYMD]);
  useEffect(() => {
    sessionStorage.setItem(reservasKey, JSON.stringify(reservas));
  }, [reservas, reservasKey]);
  
  // --- Horarios y Materias ---
  // Se asume que los horarios tienen: { Día, Hora, Materia, Docente, Curso, Submateria (opcional) }
  const diaVisEnMayus = diaSemanaVis.toUpperCase();
  
  // --- Franjas horarias y Cursos ---
  const franjasHorarias = [
    "8:15 a 8:55", "8:55 a 9:35", "9:35 a 9:50", "9:50 a 10:30",
    "10:30 a 11:10", "11:10 a 11:25", "11:25 a 12:05", "12:05 a 12:45",
    "12:45 a 13:20", "13:20 a 14:00", "14:00 a 14:40", "14:40 a 15:20",
    "15:20 a 15:30", "15:30 a 16:10"
  ];

  const horasEspeciales = {
    "9:35 a 9:50": "RECREO",
    "11:10 a 11:25": "RECREO",
    "12:45 a 13:20": "ALMUERZO",
    "15:20 a 15:30": "RECREO"
  };
  

  const cursos = ["1er año", "2do año", "3er año", "4to año", "5to año"];
  
  // --- Función auxiliar: parsear franja en Date ---
  const parsearFranjaAHoras = (franja) => {
    const [parteInicio, parteFin] = franja.split(" a ");
    const [horaI, minI] = parteInicio.split(":");
    const [horaF, minF] = parteFin.split(":");
    const dateInicio = new Date(`${fechaYMD}T${horaI.padStart(2, "0")}:${minI}:00`);
    const dateFin = new Date(`${fechaYMD}T${horaF.padStart(2, "0")}:${minF}:00`);
    return [dateInicio, dateFin];
  };
  
  // --- Opciones para cada subcelda ---
  // Se filtran los entornos ya reservados en la misma franja (para cualquier curso)
  // Y se aplica la regla de materias.
  const obtenerOpcionesParaSubcelda = (franjaIndex, curso, currentKey, materiaActual) => {
    // Filtrar entornos ya usados en la franja (ignorar el curso)
    const cellPrefix = `${franjaIndex}-`;
    const usados = Object.entries(reservas)
      .filter(([k, v]) => k.startsWith(cellPrefix) && k !== currentKey)
      .map(([k, v]) => v);
    let opciones = entornosDisponibles.filter(opt => !usados.includes(opt));
    if (materiaActual) {
      materiaRules.forEach(rule => {
        if (
          rule.materia.toLowerCase() === materiaActual.Materia.toLowerCase() &&
          rule.curso === curso
        ) {
          opciones = opciones.filter(opt => opt !== rule.entorno);
        }
      });
    }
    return opciones;
  };
  
  // --- Para la regla de submaterias ---
  // Ahora, en vez de mostrar una advertencia, si el usuario elige un entorno
  // distinto al requerido, se asigna automáticamente el entorno exigido.
  const manejarCambioSubcelda = (e, franjaIndex, curso, currentKey, materiaActual) => {
    let valor = e.target.value;
    if (materiaActual && materiaActual.Materia) {
      const ruleSub = submateriaRules.find(
        r => r.materia.toLowerCase() === materiaActual.Materia.toLowerCase()
      );
      if (ruleSub) {
        // Si se seleccionó un valor y no coincide con el requerido, lo forzamos
        if (valor && valor.toLowerCase() !== ruleSub.entorno.toLowerCase()) {
          valor = ruleSub.entorno;
        }
      }
    }
    setReservas(prev => ({ ...prev, [currentKey]: valor }));
  };
  
  // --- Render ---
  return (
    <div className="contenedorProximaSemana">
      <div className="headerProximaSemana">
        <h1 className="tituloReservas">Reservas</h1>
        <small className="fechaHora">{fechaFormateada} - {horaFormateada}</small>
      </div>
  
      {user?.rol === "administrador" && (
        <p className="textoAdmin">Opciones exclusivas del Administrador</p>
      )}
  
      <div className="navegacionAgenda">
        <button onClick={irSemanaAnterior}>Anterior (Semana)</button>
        <button onClick={() => irADiaDeLaSemana(0)}>Lunes</button>
        <button onClick={() => irADiaDeLaSemana(1)}>Martes</button>
        <button onClick={() => irADiaDeLaSemana(2)}>Miércoles</button>
        <button onClick={() => irADiaDeLaSemana(3)}>Jueves</button>
        <button onClick={() => irADiaDeLaSemana(4)}>Viernes</button>
        <button onClick={irSemanaSiguiente}>Siguiente (Semana)</button>
      </div>
  
      <div className="diaSeleccionado">
        <strong>{fechaVisualizadaStr}</strong>
      </div>
  
      <table className="tablaCalendario">
        <thead>
          <tr>
            <th>Horario</th>
            {cursos.map((curso) => (<th key={curso}>{curso}</th>))}
          </tr>
        </thead>
        <tbody>
          {feriadoEncontrado ? (
            <tr>
              <td colSpan={cursos.length + 1}>
                <strong>{`Feriado: ${feriadoEncontrado.titulo}`}</strong>
              </td>
            </tr>
          ) : (
            franjasHorarias.map((franja, franjaIndex) => {
              const [franjaInicioDate, franjaFinDate] = parsearFranjaAHoras(franja);
              if (horasEspeciales[franja]) {
                // Si la franja es especial, muestra una fila combinada
                return (
                  <tr key={franjaIndex} className="reduced-height">
                    <td>{franja}</td>
                    <td colSpan={cursos.length} className="special-cell">
                      {horasEspeciales[franja]}
                    </td>
                  </tr>
                );
              } else {
              
              return (
                <tr key={franjaIndex}>
                  <td>{franja}</td>
                  {cursos.map((curso) => {
                    const currentKeyBase = `${franjaIndex}-${curso}`;
                    // Filtrar materias de la celda según día, franja y curso
                    const materias = horariosEnStorage.filter(
                      (h) =>
                        h.Día === diaVisEnMayus &&
                        h.Hora === franja &&
                        h.Curso === curso
                    );
                    if (materias.length === 0) return <td key={curso}></td>;
  
                    // Agrupar subceldas por materia
                    const gruposMateria = {};
                    materias.forEach((m, idx) => {
                      const subKey = `${franjaIndex}-${curso}-${idx}`;
                      if (!gruposMateria[m.Materia]) gruposMateria[m.Materia] = [];
                      gruposMateria[m.Materia].push(subKey);
                    });
  
                    return (
                      <td key={curso}>
                        {materias.map((m, idx) => {
                          const currentKey = `${franjaIndex}-${curso}-${idx}`;
                          const opciones = obtenerOpcionesParaSubcelda(franjaIndex, curso, currentKey, m);
                          return (
                            <div
                             key={currentKey}
                             className={`materia-box ${entornoSeleccionado === currentKey ? 'seleccionado' : ''}`}
                             onClick={() => handleSeleccionarEntorno(currentKey)}
                             >
                             <strong>{m.Materia}</strong>
                             <br />
                             {m.Docente}
                             {m.Submateria && <div className="submateria">{m.Submateria}</div>}
                             <select
                               className="select-reserva"
                               value={reservas[currentKey] || ""}
                               onChange={(e) => manejarCambioSubcelda(e, franjaIndex, curso, currentKey, m)}
                             >
                               <option value="">Seleccione...</option>
                               {opciones.map((opt, i) => (
                                 <option key={i} value={opt}>{opt}</option>
                               ))}
                             </select>
                      </div>
                          );
                        })}
                      </td>
                    );
                  })}
                </tr>
              );
            }
           })
          )}
        </tbody>
      </table>
    </div>
  );
};

export default ProximaSemana;
