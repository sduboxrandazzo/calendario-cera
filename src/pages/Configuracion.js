// Configuracion.js (Organizado y Completo)
import React, { useState, useEffect } from 'react';
import './Configuracion.css';

function Configuracion() {

  // === Estados Globales ===
  const [entornos, setEntornos] = useState(() => JSON.parse(sessionStorage.getItem('entornos') || '[]'));
  const [entornosChicos, setEntornosChicos] = useState(() => JSON.parse(sessionStorage.getItem('entornosChicos') || '[]'));
  const [nuevoEntorno, setNuevoEntorno] = useState('');
  const listaCursos = ['1er año', '2do año', '3er año', '4to año', '5to año'];
  const handleAgregarEntorno = (e) => {
    e.preventDefault();
    if (!nuevoEntorno) return;
    setEntornos([...entornos, nuevoEntorno]);
    setNuevoEntorno('');
  };
  
  const handleToggleEntornoChico = (entorno) => {
    setEntornosChicos(prev =>
      prev.includes(entorno) ? prev.filter(e => e !== entorno) : [...prev, entorno]
    );
  };
  
  const handleEliminarEntorno = (index) => {
    const entornoEliminado = entornos[index];
    setEntornos(entornos.filter((_, i) => i !== index));
    setEntornosChicos(entornosChicos.filter(e => e !== entornoEliminado));
  };
  

  // === Estados para FERIADOS ===
  const [feriados, setFeriados] = useState(() => JSON.parse(sessionStorage.getItem('feriados') || '[]'));
  const [nuevaFecha, setNuevaFecha] = useState('');
  const [nuevoTitulo, setNuevoTitulo] = useState('');
  const [editFeriadoIndex, setEditFeriadoIndex] = useState(null);
  const [editFeriadoFecha, setEditFeriadoFecha] = useState('');
  const [editFeriadoTitulo, setEditFeriadoTitulo] = useState('');

  // === Estados Salidas ===
  const [salidas, setSalidas] = useState(() => JSON.parse(sessionStorage.getItem('salidas') || '[]'));
  const [tituloSalida, setTituloSalida] = useState('');
  const [inicioSalida, setInicioSalida] = useState('');
  const [finSalida, setFinSalida] = useState('');
  const [cursosSeleccionados, setCursosSeleccionados] = useState([]);
  const [mostrarPopupCursos, setMostrarPopupCursos] = useState(false);
  
  const [editSalidaIndex, setEditSalidaIndex] = useState(null);
  const [editSalidaCursos, setEditSalidaCursos] = useState([]);
  const [editSalidaTitulo, setEditSalidaTitulo] = useState('');
  const [editSalidaInicio, setEditSalidaInicio] = useState('');
  const [editSalidaFin, setEditSalidaFin] = useState('');
  const [mostrarPopupCursosEdit, setMostrarPopupCursosEdit] = useState(false);

  // === Handlers Feriados ===
  const handleAgregarFeriado = (e) => {
    e.preventDefault();
    setFeriados([...feriados, { fecha: nuevaFecha, titulo: nuevoTitulo }]);
    setNuevaFecha('');
    setNuevoTitulo('');
  };

  const handleEditarFeriado = (index) => {
    setEditFeriadoIndex(index);
    setEditFeriadoFecha(feriados[index].fecha);
    setEditFeriadoTitulo(feriados[index].titulo);
  };

  const handleGuardarFeriado = () => {
    const nuevos = [...feriados];
    nuevos[editFeriadoIndex] = { fecha: editFeriadoFecha, titulo: editFeriadoTitulo };
    setFeriados(nuevos);
    setEditFeriadoIndex(null);
  };

  const handleCancelarEdicionFeriado = () => setEditFeriadoIndex(null);
  const handleEliminarFeriado = (index) => setFeriados(feriados.filter((_, i) => i !== index));

  useEffect(() => {
    sessionStorage.setItem('feriados', JSON.stringify(feriados));
    sessionStorage.setItem('salidas', JSON.stringify(salidas));
    sessionStorage.setItem('entornos', JSON.stringify(entornos));
    sessionStorage.setItem('entornosChicos', JSON.stringify(entornosChicos));
  }, [feriados, salidas, entornos, entornosChicos]);

// Agregar Salida
const handleAgregarSalida = (e) => {
  e.preventDefault();
  const nuevaSalida = {
    cursos: cursosSeleccionados,
    titulo: tituloSalida,
    inicio: inicioSalida,
    fin: finSalida
  };
  setSalidas([...salidas, nuevaSalida]);
  setCursosSeleccionados([]);
  setTituloSalida('');
  setInicioSalida('');
  setFinSalida('');
};

// Popup cursos (Agregar)
const abrirPopupCursos = () => setMostrarPopupCursos(true);
const cerrarPopupCursos = () => setMostrarPopupCursos(false);

const handleToggleCurso = (curso) => {
  setCursosSeleccionados(prev =>
    prev.includes(curso) ? prev.filter(c => c !== curso) : [...prev, curso]
  );
};

// Popup cursos (Editar)
const abrirPopupCursosEdit = () => setMostrarPopupCursosEdit(true);
const cerrarPopupCursosEdit = () => setMostrarPopupCursosEdit(false);

const handleToggleCursoEdit = (curso) => {
  setEditSalidaCursos(prev =>
    prev.includes(curso) ? prev.filter(c => c !== curso) : [...prev, curso]
  );
};

// Editar Salida
const handleEditarSalida = (index) => {
  setEditSalidaIndex(index);
  setEditSalidaCursos(salidas[index].cursos);
  setEditSalidaTitulo(salidas[index].titulo);
  setEditSalidaInicio(salidas[index].inicio);
  setEditSalidaFin(salidas[index].fin);
};

const handleGuardarSalida = (index) => {
  const nuevasSalidas = [...salidas];
  nuevasSalidas[index] = {
    cursos: editSalidaCursos,
    titulo: editSalidaTitulo,
    inicio: editSalidaInicio,
    fin: editSalidaFin
  };
  setSalidas(nuevasSalidas);
  setEditSalidaIndex(null);
};

const handleCancelarEdicionSalida = () => setEditSalidaIndex(null);

const handleEliminarSalida = (index) => {
  setSalidas(salidas.filter((_, i) => i !== index));
};


  /* =========================================================
   *  RENDER
   * ========================================================= */
  return (
    <div className="configuracion-container">
      <h1>Configuración</h1>

      {/* ====================== FERIADOS ====================== */}
      <section className="configuracion-section">
        <h2>Listado de feriados</h2>
        <form onSubmit={handleAgregarFeriado} className="configuracion-form">
          <div className="form-group">
            <label>Fecha:</label>
            <input type="date" value={nuevaFecha} onChange={(e) => setNuevaFecha(e.target.value)} />
          </div>
          <div className="form-group">
            <label>Título del feriado:</label>
            <input type="text" value={nuevoTitulo} onChange={(e) => setNuevoTitulo(e.target.value)} />
          </div>
          <button type="submit" className="button-primary">Agregar Feriado</button>
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
            {feriados.map((feriado, index) =>
              editFeriadoIndex === index ? (
                <tr key={index}>
                  <td>
                    <input type="date" value={editFeriadoFecha} onChange={(e) => setEditFeriadoFecha(e.target.value)} />
                  </td>
                  <td>
                    <input type="text" value={editFeriadoTitulo} onChange={(e) => setEditFeriadoTitulo(e.target.value)} />
                  </td>
                  <td>
                    <button onClick={() => handleGuardarFeriado(index)} className="button-secondary">Guardar</button>
                    <button onClick={handleCancelarEdicionFeriado} className="button-secondary">Cancelar</button>
                  </td>
                </tr>
              ) : (
                <tr key={index}>
                  <td>{feriado.fecha}</td>
                  <td>{feriado.titulo}</td>
                  <td>
                    <button onClick={() => handleEditarFeriado(index)} className="button-secondary">Editar</button>
                    <button onClick={() => handleEliminarFeriado(index)} className="button-secondary">Eliminar</button>
                  </td>
                </tr>
              )
            )}
          </tbody>
        </table>
      </section>
 {/* ====================== SALIDAS / ACTIVIDADES ====================== */}
 <section className="configuracion-section">
        <h2>Salidas y Actividades</h2>
        <form onSubmit={handleAgregarSalida} className="configuracion-form">
          <div className="form-group">
            <label>Cursos:</label>
            <button type="button" onClick={abrirPopupCursos} className="button-primary">Elegir cursos</button>
            <div style={{ marginTop: '0.5rem' }}>
              {cursosSeleccionados.length === 0 ? "Ningún curso seleccionado" : cursosSeleccionados.join(", ")}
            </div>
          </div>
          <div className="form-group">
            <label>Título de la salida:</label>
            <input type="text" value={tituloSalida} onChange={(e) => setTituloSalida(e.target.value)} />
          </div>
          <div className="form-group">
            <label>Fecha y hora de inicio:</label>
            <input type="datetime-local" value={inicioSalida} onChange={(e) => setInicioSalida(e.target.value)} />
          </div>
          <div className="form-group">
            <label>Fecha y hora de fin:</label>
            <input type="datetime-local" value={finSalida} onChange={(e) => setFinSalida(e.target.value)} />
          </div>
          <button type="submit" className="button-primary">Agregar Salida</button>
        </form>

        {/* Popup para selección de cursos al AGREGAR */}
        {mostrarPopupCursos && (
          <div className="popup-overlay">
            <div className="popup-content">
              <h3>Seleccionar cursos</h3>
              {listaCursos.map((curso) => (
                <div key={curso} style={{ marginBottom: '0.5rem' }}>
                  <label>
                    <input type="checkbox" checked={cursosSeleccionados.includes(curso)} onChange={() => handleToggleCurso(curso)} />
                    {curso}
                  </label>
                </div>
              ))}
              <div style={{ marginTop: '1rem' }}>
                <button onClick={cerrarPopupCursos} className="button-primary">Cerrar</button>
              </div>
            </div>
          </div>
        )}

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
            {salidas.map((salida, index) =>
              editSalidaIndex === index ? (
                <tr key={index}>
                  <td>
                    <button type="button" onClick={abrirPopupCursosEdit} className="button-primary">Elegir cursos</button>
                    <div style={{ marginTop: '0.5rem' }}>
                      {editSalidaCursos.length === 0 ? "Ningún curso seleccionado" : editSalidaCursos.join(", ")}
                    </div>
                  </td>
                  <td>
                    <input type="text" value={editSalidaTitulo} onChange={(e) => setEditSalidaTitulo(e.target.value)} />
                  </td>
                  <td>
                    <input type="datetime-local" value={editSalidaInicio} onChange={(e) => setEditSalidaInicio(e.target.value)} />
                  </td>
                  <td>
                    <input type="datetime-local" value={editSalidaFin} onChange={(e) => setEditSalidaFin(e.target.value)} />
                  </td>
                  <td>
                    <button onClick={() => handleGuardarSalida(index)} className="button-secondary">Guardar</button>
                    <button onClick={handleCancelarEdicionSalida} className="button-secondary">Cancelar</button>
                  </td>
                </tr>
              ) : (
                <tr key={index}>
                  <td>{salida.cursos.join(", ")}</td>
                  <td>{salida.titulo}</td>
                  <td>{salida.inicio}</td>
                  <td>{salida.fin}</td>
                  <td>
                    <button onClick={() => handleEditarSalida(index)} className="button-secondary">Editar</button>
                    <button onClick={() => handleEliminarSalida(index)} className="button-secondary">Eliminar</button>
                  </td>
                </tr>
              )
            )}
          </tbody>
        </table>

        {/* Popup para selección de cursos al EDITAR */}
        {mostrarPopupCursosEdit && (
          <div className="popup-overlay">
            <div className="popup-content">
              <h3>Editar cursos</h3>
              {listaCursos.map((curso) => (
                <div key={curso} style={{ marginBottom: '0.5rem' }}>
                  <label>
                    <input type="checkbox" checked={editSalidaCursos.includes(curso)} onChange={() => handleToggleCursoEdit(curso)} />
                    {curso}
                  </label>
                </div>
              ))}
              <div style={{ marginTop: '1rem' }}>
                <button onClick={cerrarPopupCursosEdit} className="button-primary">Cerrar</button>
              </div>
            </div>
          </div>
        )}
      </section>

     {/* ====================== ENTORNOS ====================== */}
      <section className="configuracion-section">
      <div className="configuracion-container">
      <h1>Configuración de Entornos</h1>
      <form onSubmit={handleAgregarEntorno} className="configuracion-form">
        <div className="form-group">
          <label>Nuevo entorno:</label>
          <input type="text" value={nuevoEntorno} onChange={(e) => setNuevoEntorno(e.target.value)} placeholder="Ej: Aula 101" />
        </div>
        <button type="submit" className="button-primary">Agregar Entorno</button>
      </form>

      <table className="configuracion-table">
        <thead>
          <tr>
            <th>Entorno</th>
            <th>Tamaño Chico</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {entornos.map((entornoItem, index) => (
            <tr key={index}>
              <td>{entornoItem}</td>
              <td>
                <input
                  type="checkbox"
                  checked={entornosChicos.includes(entornoItem)}
                  onChange={() => handleToggleEntornoChico(entornoItem)}
                />
              </td>
              <td>
                <button onClick={() => handleEliminarEntorno(index)} className="button-secondary">Eliminar</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
      </section>
    </div>
  );
}

export default Configuracion;

