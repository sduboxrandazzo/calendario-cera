// NavBar.js
import React, { useContext } from 'react';
import { useNavigate, NavLink } from 'react-router-dom';
import './NavBar.css'; 
import { AuthContext } from "../AuthContext";

function NavBar() {
  const navigate = useNavigate();
  // Se consume el contexto para obtener el objeto "user"
  const { user } = useContext(AuthContext);

  const handleLogout = () => {
    // Lógica de cierre de sesión (ejemplo: remover token de localStorage)
    localStorage.removeItem('token');
    // Redirigir a Login
    navigate('/login');
  };

  return (
    <nav className="navbar">
     
           {/* Se muestra la información del usuario si existe */}
           {user && (
        <div className="user-info">
          <span>Usuario: {user.email}</span>
          <span> | Rol: {user.rol}</span>
        </div>
      )}
     
      <NavLink 
        to="/esta-semana"
        className="nav-link"
        activeClassName="active"
      >
        Esta semana
      </NavLink>
      <NavLink 
        to="/proxima-semana"
        className="nav-link"
        activeClassName="active"
      >
        Próxima semana
      </NavLink>
      <NavLink 
        to="/horarios"
        className="nav-link"
        activeClassName="active"
      >
        Horarios
      </NavLink>
      <NavLink 
        to="/estadisticas"
        className="nav-link"
        activeClassName="active"
      >
        Estadísticas
      </NavLink>

      {user && user.rol === 'administrador' && (
      <NavLink 
        to="/configuracion"
        className="nav-link"
        activeClassName="active"
      >
        Configuracion
      </NavLink>
       )}


      {/* Botón que cierra sesión y redirige */}
      <button className="nav-link logout-btn" onClick={handleLogout}>
        Cerrar Sesión
      </button>
    </nav>
  );
}

export default NavBar;
