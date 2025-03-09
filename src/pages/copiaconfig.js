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
  
  // Estados para edición de feriados
  const [editFeriadoIndex, setEditFeriadoIndex] = useState(null);
  const [editFeriadoFecha, setEditFeriadoFecha] = useState('');
  const [editFeriadoTitulo, setEditFeriadoTitulo] = useState('');

  useEffect(() => {
    sessionStorage.setItem('feriados', JSON.stringify(feriados));
  }, [feriados]);

  const handleAgregarFeriado = (e) => {
    e.preventDefault();
    if (!nuevaFecha || !nuevoTitulo) return;
    const nuevoFeriado = { fecha: nuevaFecha, titulo: nuevoTitulo };
    setFeriados([...feriados, nuevoFeriado]);
    setNuevaFecha('');
    setNuevoTitulo('');
  };

  const handleEliminarFeriado = (index) => {
    setFeriados(feriados.filter((_, i) => i !== index));
  };

  const handleEditarFeriado = (index) => {
    setEditFeriadoIndex(index);
    setEditFeriadoFecha(feriados[index].fecha);
    setEditFeriadoTitulo(feriados[index].titulo);
  };

  const handleGuardarFeriado = (index) => {
    const nuevosFeriados = [...feriados];
    nuevosFeriados[index] = { fecha: editFeriadoFecha, titulo: editFeriadoTitulo };
    setFeriados(nuevosFeriados);
    setEditFeriadoIndex(null);
  };

  const handleCancelarEdicionFeriado = () => {
    setEditFeriadoIndex(null);
  };

  /* =========================================================
   *  SALIDAS/ACTIVIDADES
   * ========================================================= */
  const [salidas, setSalidas] = useState(() => {
    const stored = sessionStorage.getItem('salidas');
    return stored ? JSON.parse(stored) : [];
  });
  const [cursosSeleccionados, setCursosSeleccionados] = useState([]);
  const [tituloSalida, setTituloSalida] = useState('');
  const [inicioSalida, setInicioSalida] = useState('');
  const [finSalida, setFinSalida] = useState('');
  // Popup para selección de cursos (AGREGAR)
  const [mostrarPopupCursos, setMostrarPopupCursos] = useState(false);
  // Estados para edición de salida
  const [editSalidaIndex, setEditSalidaIndex] = useState(null);
  const [editSalidaCursos, setEditSalidaCursos] = useState([]);
  const [editSalidaTitulo, setEditSalidaTitulo] = useState('');
  const [editSalidaInicio, setEditSalidaInicio] = useState('');
  const [editSalidaFin, setEditSalidaFin] = useState('');
  // Popup para selección de cursos (EDITAR)
  const [mostrarPopupCursosEdit, setMostrarPopupCursosEdit] = useState(false);

  useEffect(() => {
    sessionStorage.setItem('salidas', JSON.stringify(salidas));
  }, [salidas]);

  const listaCursos = ['1er año', '2do año', '3er año', '4to año', '5to año'];

  const handleAgregarSalida = (e) => {
    e.preventDefault();
    if (!cursosSeleccionados.length || !tituloSalida || !inicioSalida || !finSalida) return;
    const nuevaSalida = { cursos: cursosSeleccionados, titulo: tituloSalida, inicio: inicioSalida, fin: finSalida };
    setSalidas([...salidas, nuevaSalida]);
    setCursosSeleccionados([]);
    setTituloSalida('');
    setInicioSalida('');
    setFinSalida('');
  };

  const handleEliminarSalida = (index) => {
    setSalidas(salidas.filter((_, i) => i !== index));
  };

  const abrirPopupCursos = () => {
    setMostrarPopupCursos(true);
  };
  const cerrarPopupCursos = () => {
    setMostrarPopupCursos(false);
  };
  const handleToggleCurso = (curso) => {
    if (cursosSeleccionados.includes(curso)) {
      setCursosSeleccionados(cursosSeleccionados.filter(c => c !== curso));
    } else {
      setCursosSeleccionados([...cursosSeleccionados, curso]);
    }
  };

  const handleEditarSalida = (index) => {
    setEditSalidaIndex(index);
    const salida = salidas[index];
    setEditSalidaCursos(salida.cursos);
    setEditSalidaTitulo(salida.titulo);
    setEditSalidaInicio(salida.inicio);
    setEditSalidaFin(salida.fin);
  };

  const handleGuardarSalida = (index) => {
    const nuevasSalidas = [...salidas];
    nuevasSalidas[index] = { cursos: editSalidaCursos, titulo: editSalidaTitulo, inicio: editSalidaInicio, fin: editSalidaFin };
    setSalidas(nuevasSalidas);
    setEditSalidaIndex(null);
  };

  const handleCancelarEdicionSalida = () => {
    setEditSalidaIndex(null);
  };

  const abrirPopupCursosEdit = () => {
    setMostrarPopupCursosEdit(true);
  };
  const cerrarPopupCursosEdit = () => {
    setMostrarPopupCursosEdit(false);
  };
  const handleToggleCursoEdit = (curso) => {
    if (editSalidaCursos.includes(curso)) {
      setEditSalidaCursos(editSalidaCursos.filter(c => c !== curso));
    } else {
      setEditSalidaCursos([...editSalidaCursos, curso]);
    }
  };

  /* =========================================================
   *  ENTORNOS
   * ========================================================= */
  // Listado de entornos (para que el selector de ProximaSemana use estos)
  const [entornos, setEntornos] = useState(() => {
    const stored = sessionStorage.getItem('entornos');
    return stored ? JSON.parse(stored) : [];
  });
  const [nuevoEntorno, setNuevoEntorno] = useState('');
  const [editEntornoIndex, setEditEntornoIndex] = useState(null);
  const [editEntornoNombre, setEditEntornoNombre] = useState('');

  useEffect(() => {
    sessionStorage.setItem('entornos', JSON.stringify(entornos));
  }, [entornos]);

  const handleAgregarEntorno = (e) => {
    e.preventDefault();
    if (!nuevoEntorno) return;
    setEntornos([...entornos, nuevoEntorno]);
    setNuevoEntorno('');
  };

  const handleEliminarEntorno = (index) => {
    setEntornos(entornos.filter((_, i) => i !== index));
  };

  const handleEditarEntorno = (index) => {
    setEditEntornoIndex(index);
    setEditEntornoNombre(entornos[index]);
  };

  const handleGuardarEntorno = (index) => {
    const nuevosEntornos = [...entornos];
    nuevosEntornos[index] = editEntornoNombre;
    setEntornos(nuevosEntornos);
    setEditEntornoIndex(null);
  };

  const handleCancelarEdicionEntorno = () => {
    setEditEntornoIndex(null);
  };

  /* =========================================================
   *  REGLAS DE COMPORTAMIENTO DE LAS RESERVAS
   * ========================================================= */
  const [entornos, setEntornos] = useState(() => {
    const stored = sessionStorage.getItem('entornos');
    return stored ? JSON.parse(stored) : [];
  });
  const [nuevoEntorno, setNuevoEntorno] = useState('');
  const [entornosChicos, setEntornosChicos] = useState(() => {
    const stored = sessionStorage.getItem('entornosChicos');
    return stored ? JSON.parse(stored) : [];
  });
  
  useEffect(() => {
    sessionStorage.setItem('entornos', JSON.stringify(entornos));
    sessionStorage.setItem('entornosChicos', JSON.stringify(entornosChicos));
  }, [entornos, entornosChicos]);
  
  const handleAgregarEntorno = (e) => {
    e.preventDefault();
    if (!nuevoEntorno) return;
    setEntornos([...entornos, nuevoEntorno]);
    setNuevoEntorno('');
  };
  
  const handleEliminarEntorno = (index) => {
    const entornoEliminado = entornos[index];
    setEntornos(entornos.filter((_, i) => i !== index));
    setEntornosChicos(entornosChicos.filter(e => e !== entornoEliminado));
  };
  
  const handleToggleEntornoChico = (entorno) => {
    if (entornosChicos.includes(entorno)) {
      setEntornosChicos(entornosChicos.filter(e => e !== entorno));
    } else {
      setEntornosChicos([...entornosChicos, entorno]);
    }
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
        <h2>Entornos</h2>
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
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {entornos.map((entornoItem, index) =>
              editEntornoIndex === index ? (
                <tr key={index}>
                  <td>
                    <input type="text" value={editEntornoNombre} onChange={(e) => setEditEntornoNombre(e.target.value)} />
                  </td>
                  <td>
                    <button onClick={() => handleGuardarEntorno(index)} className="button-secondary">Guardar</button>
                    <button onClick={handleCancelarEdicionEntorno} className="button-secondary">Cancelar</button>
                  </td>
                </tr>
              ) : (
                <tr key={index}>
                  <td>{entornoItem}</td>
                  <td>
                    <button onClick={() => handleEditarEntorno(index)} className="button-secondary">Editar</button>
                    <button onClick={() => handleEliminarEntorno(index)} className="button-secondary">Eliminar</button>
                  </td>
                </tr>
              )
            )}
          </tbody>
        </table>
      </section>

      {/* ====================== REGLAS DE COMPORTAMIENTO DE LAS RESERVAS ====================== */}
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
    </div>
  );
}


export default Configuracion;
