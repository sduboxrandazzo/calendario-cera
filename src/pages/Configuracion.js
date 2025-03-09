// Configuracion.js
import React, { useState, useEffect } from 'react';
import './Configuracion.css';

function Configuracion() {
  /* =========================================================
   *  FERIADOS
   * ========================================================= */
  const [feriados, setFeriados] = useState(() => {
    const storedData = sessionStorage.getItem('feriados');
    return storedData ? JSON.parse(storedData) : [];
  });

  const [nuevaFecha, setNuevaFecha] = useState('');
  const [nuevoTitulo, setNuevoTitulo] = useState('');

  // Edición inline de feriados
  const [editFeriadoIndex, setEditFeriadoIndex] = useState(null);
  const [editFeriadoFecha, setEditFeriadoFecha] = useState('');
  const [editFeriadoTitulo, setEditFeriadoTitulo] = useState('');

  // Guardar feriados en sessionStorage cada vez que cambie el array
  useEffect(() => {
    sessionStorage.setItem('feriados', JSON.stringify(feriados));
  }, [feriados]);

  // Agregar feriado
  const handleAgregarFeriado = (e) => {
    e.preventDefault();
    if (!nuevaFecha || !nuevoTitulo) return;

    const nuevoFeriado = { fecha: nuevaFecha, titulo: nuevoTitulo };
    setFeriados([...feriados, nuevoFeriado]);

    // Limpiar campos
    setNuevaFecha('');
    setNuevoTitulo('');
  };

  // Eliminar feriado
  const handleEliminarFeriado = (index) => {
    const feriadosActualizados = feriados.filter((_, i) => i !== index);
    setFeriados(feriadosActualizados);
  };

  // Iniciar edición de un feriado
  const handleEditarFeriado = (index) => {
    setEditFeriadoIndex(index);
    setEditFeriadoFecha(feriados[index].fecha);
    setEditFeriadoTitulo(feriados[index].titulo);
  };

  // Guardar cambios al editar feriado
  const handleGuardarFeriado = (index) => {
    const feriadosActualizados = [...feriados];
    feriadosActualizados[index] = {
      fecha: editFeriadoFecha,
      titulo: editFeriadoTitulo
    };
    setFeriados(feriadosActualizados);
    setEditFeriadoIndex(null);
  };

  // Cancelar edición de feriado
  const handleCancelarEdicionFeriado = () => {
    setEditFeriadoIndex(null);
  };


  /* =========================================================
   *  SALIDAS/ACTIVIDADES
   * ========================================================= */
  const [salidas, setSalidas] = useState(() => {
    const storedData = sessionStorage.getItem('salidas');
    return storedData ? JSON.parse(storedData) : [];
  });

  // Campos para AGREGAR una salida
  const [cursosSeleccionados, setCursosSeleccionados] = useState([]);
  const [tituloSalida, setTituloSalida] = useState('');
  const [inicioSalida, setInicioSalida] = useState('');
  const [finSalida, setFinSalida] = useState('');

  // Popup de selección de cursos (AL AGREGAR)
  const [mostrarPopupCursos, setMostrarPopupCursos] = useState(false);

  // Estados para EDICIÓN de una salida
  const [editSalidaIndex, setEditSalidaIndex] = useState(null);
  const [editSalidaCursos, setEditSalidaCursos] = useState([]);
  const [editSalidaTitulo, setEditSalidaTitulo] = useState('');
  const [editSalidaInicio, setEditSalidaInicio] = useState('');
  const [editSalidaFin, setEditSalidaFin] = useState('');

  // Popup de selección de cursos (AL EDITAR)
  const [mostrarPopupCursosEdit, setMostrarPopupCursosEdit] = useState(false);

  // Guardar salidas en sessionStorage cada vez que cambie el array
  useEffect(() => {
    sessionStorage.setItem('salidas', JSON.stringify(salidas));
  }, [salidas]);

  // Lista de cursos disponibles
  const listaCursos = ['1er año', '2do año', '3er año', '4to año', '5to año'];

  /* =========== Lógica AGREGAR SALIDA =========== */
  const handleAgregarSalida = (e) => {
    e.preventDefault();
    if (!cursosSeleccionados.length || !tituloSalida || !inicioSalida || !finSalida) {
      return;
    }

    const nuevaSalida = {
      cursos: cursosSeleccionados,
      titulo: tituloSalida,
      inicio: inicioSalida,
      fin: finSalida
    };
    setSalidas([...salidas, nuevaSalida]);

    // Limpiar campos
    setCursosSeleccionados([]);
    setTituloSalida('');
    setInicioSalida('');
    setFinSalida('');
  };

  // Eliminar salida
  const handleEliminarSalida = (index) => {
    const salidasActualizadas = salidas.filter((_, i) => i !== index);
    setSalidas(salidasActualizadas);
  };

  /* =========== Popup de selección de cursos (AGREGAR) =========== */
  const abrirPopupCursos = () => {
    setMostrarPopupCursos(true);
  };
  const cerrarPopupCursos = () => {
    setMostrarPopupCursos(false);
  };

  // Checkbox toggle (AGREGAR)
  const handleToggleCurso = (curso) => {
    if (cursosSeleccionados.includes(curso)) {
      setCursosSeleccionados((prev) => prev.filter((c) => c !== curso));
    } else {
      setCursosSeleccionados((prev) => [...prev, curso]);
    }
  };

  /* =========== Lógica EDITAR SALIDA =========== */
  const handleEditarSalida = (index) => {
    setEditSalidaIndex(index);
    const salida = salidas[index];
    setEditSalidaCursos(salida.cursos);
    setEditSalidaTitulo(salida.titulo);
    setEditSalidaInicio(salida.inicio);
    setEditSalidaFin(salida.fin);
  };

  const handleGuardarSalida = (index) => {
    const salidasActualizadas = [...salidas];
    salidasActualizadas[index] = {
      cursos: editSalidaCursos,
      titulo: editSalidaTitulo,
      inicio: editSalidaInicio,
      fin: editSalidaFin
    };
    setSalidas(salidasActualizadas);
    setEditSalidaIndex(null);
  };

  const handleCancelarEdicionSalida = () => {
    setEditSalidaIndex(null);
  };

  /* =========== Popup de selección de cursos (EDITAR) =========== */
  const abrirPopupCursosEdit = () => {
    setMostrarPopupCursosEdit(true);
  };
  const cerrarPopupCursosEdit = () => {
    setMostrarPopupCursosEdit(false);
  };

  // Checkbox toggle (EDITAR)
  const handleToggleCursoEdit = (curso) => {
    if (editSalidaCursos.includes(curso)) {
      setEditSalidaCursos((prev) => prev.filter((c) => c !== curso));
    } else {
      setEditSalidaCursos((prev) => [...prev, curso]);
    }
  };


  /* =========================================================
   *  RENDER
   * ========================================================= */
  return (
    <div className="configuracion-container">
      <h1>Configuración</h1>

      {/* ================================================== */}
      {/*                 FERIADOS                          */}
      {/* ================================================== */}
      <section className="configuracion-section">
        <h2>Listado de feriados</h2>
        <form onSubmit={handleAgregarFeriado} className="configuracion-form">
          <div className="form-group">
            <label>Fecha:</label>
            <input
              type="date"
              value={nuevaFecha}
              onChange={(e) => setNuevaFecha(e.target.value)}
            />
          </div>
          <div className="form-group">
            <label>Título del feriado:</label>
            <input
              type="text"
              value={nuevoTitulo}
              onChange={(e) => setNuevoTitulo(e.target.value)}
            />
          </div>
          <button type="submit" className="button-primary">
            Agregar Feriado
          </button>
        </form>

        <table className="configuracion-table">
          <thead>
            <tr>
              <th>Fecha</th>
              <th>Descripción</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {feriados.map((feriado, index) => {
              // ¿Estamos editando este feriado?
              if (editFeriadoIndex === index) {
                return (
                  <tr key={index}>
                    <td>
                      <input
                        type="date"
                        value={editFeriadoFecha}
                        onChange={(e) => setEditFeriadoFecha(e.target.value)}
                      />
                    </td>
                    <td>
                      <input
                        type="text"
                        value={editFeriadoTitulo}
                        onChange={(e) => setEditFeriadoTitulo(e.target.value)}
                      />
                    </td>
                    <td>
                      <button
                        onClick={() => handleGuardarFeriado(index)}
                        className="button-secondary"
                      >
                        Guardar
                      </button>
                      <button
                        onClick={handleCancelarEdicionFeriado}
                        className="button-secondary"
                      >
                        Cancelar
                      </button>
                    </td>
                  </tr>
                );
              } else {
                // Vista normal
                return (
                  <tr key={index}>
                    <td>{feriado.fecha}</td>
                    <td>{feriado.titulo}</td>
                    <td>
                      <button
                        onClick={() => handleEditarFeriado(index)}
                        className="button-secondary"
                      >
                        Editar
                      </button>
                      <button
                        onClick={() => handleEliminarFeriado(index)}
                        className="button-secondary"
                      >
                        Eliminar
                      </button>
                    </td>
                  </tr>
                );
              }
            })}
          </tbody>
        </table>
      </section>

      {/* ================================================== */}
      {/*             SALIDAS / ACTIVIDADES                */}
      {/* ================================================== */}
      <section className="configuracion-section">
        <h2>Salidas y Actividades</h2>

        {/* Form para agregar salida */}
        <form onSubmit={handleAgregarSalida} className="configuracion-form">
          {/* Botón para abrir popup de selección de cursos */}
          <div className="form-group">
            <label>Cursos: </label>
            <button
              type="button"
              onClick={abrirPopupCursos}
              className="button-primary"
            >
              Elegir cursos
            </button>
            {/* Mostrar debajo los cursos elegidos */}
            <div style={{ marginTop: '0.5rem' }}>
              {cursosSeleccionados.length === 0
                ? "Ningún curso seleccionado"
                : cursosSeleccionados.join(", ")}
            </div>
          </div>

          <div className="form-group">
            <label>Título de la salida:</label>
            <input
              type="text"
              value={tituloSalida}
              onChange={(e) => setTituloSalida(e.target.value)}
            />
          </div>
          <div className="form-group">
            <label>Fecha y hora de inicio:</label>
            <input
              type="datetime-local"
              value={inicioSalida}
              onChange={(e) => setInicioSalida(e.target.value)}
            />
          </div>
          <div className="form-group">
            <label>Fecha y hora de fin:</label>
            <input
              type="datetime-local"
              value={finSalida}
              onChange={(e) => setFinSalida(e.target.value)}
            />
          </div>

          <button type="submit" className="button-primary">
            Agregar Salida
          </button>
        </form>

        {/* Popup de selección de cursos (AGREGAR) */}
        {mostrarPopupCursos && (
          <div className="popup-overlay">
            <div className="popup-content">
              <h3>Seleccionar cursos</h3>
              {listaCursos.map((curso) => (
                <div key={curso} style={{ marginBottom: '0.5rem' }}>
                  <label>
                    <input
                      type="checkbox"
                      checked={cursosSeleccionados.includes(curso)}
                      onChange={() => handleToggleCurso(curso)}
                    />
                    {curso}
                  </label>
                </div>
              ))}
              <div style={{ marginTop: '1rem' }}>
                <button onClick={cerrarPopupCursos} className="button-primary">
                  Cerrar
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Tabla de salidas */}
        <table className="configuracion-table">
          <thead>
            <tr>
              <th>Cursos</th>
              <th>Título</th>
              <th>Inicio</th>
              <th>Fin</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {salidas.map((salida, index) => {
              // ¿Estamos editando esta salida?
              if (editSalidaIndex === index) {
                return (
                  <tr key={index}>
                    <td>
                      {/* Botón para abrir popup de edición de cursos */}
                      <button
                        type="button"
                        onClick={abrirPopupCursosEdit}
                        className="button-primary"
                      >
                        Elegir cursos
                      </button>
                      <div style={{ marginTop: '0.5rem' }}>
                        {editSalidaCursos.length === 0
                          ? "Ningún curso seleccionado"
                          : editSalidaCursos.join(", ")}
                      </div>
                    </td>
                    <td>
                      <input
                        type="text"
                        value={editSalidaTitulo}
                        onChange={(e) => setEditSalidaTitulo(e.target.value)}
                      />
                    </td>
                    <td>
                      <input
                        type="datetime-local"
                        value={editSalidaInicio}
                        onChange={(e) => setEditSalidaInicio(e.target.value)}
                      />
                    </td>
                    <td>
                      <input
                        type="datetime-local"
                        value={editSalidaFin}
                        onChange={(e) => setEditSalidaFin(e.target.value)}
                      />
                    </td>
                    <td>
                      <button
                        onClick={() => handleGuardarSalida(index)}
                        className="button-secondary"
                      >
                        Guardar
                      </button>
                      <button
                        onClick={handleCancelarEdicionSalida}
                        className="button-secondary"
                      >
                        Cancelar
                      </button>
                    </td>
                  </tr>
                );
              } else {
                // Vista normal
                return (
                  <tr key={index}>
                    <td>{salida.cursos.join(", ")}</td>
                    <td>{salida.titulo}</td>
                    <td>{salida.inicio}</td>
                    <td>{salida.fin}</td>
                    <td>
                      <button
                        onClick={() => handleEditarSalida(index)}
                        className="button-secondary"
                      >
                        Editar
                      </button>
                      <button
                        onClick={() => handleEliminarSalida(index)}
                        className="button-secondary"
                      >
                        Eliminar
                      </button>
                    </td>
                  </tr>
                );
              }
            })}
          </tbody>
        </table>

        {/* Popup de selección de cursos (EDITAR) */}
        {mostrarPopupCursosEdit && (
          <div className="popup-overlay">
            <div className="popup-content">
              <h3>Editar cursos</h3>
              {listaCursos.map((curso) => (
                <div key={curso} style={{ marginBottom: '0.5rem' }}>
                  <label>
                    <input
                      type="checkbox"
                      checked={editSalidaCursos.includes(curso)}
                      onChange={() => handleToggleCursoEdit(curso)}
                    />
                    {curso}
                  </label>
                </div>
              ))}
              <div style={{ marginTop: '1rem' }}>
                <button onClick={cerrarPopupCursosEdit} className="button-primary">
                  Cerrar
                </button>
              </div>
            </div>
          </div>
        )}
      </section>
    </div>
  );
}

export default Configuracion;
