// ProtectedRoute.jsx
import React, { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContext } from './AuthContext'; // tu contexto

export default function ProtectedRoute({ children }) {
  const { user } = useContext(AuthContext);

  // Si no hay usuario, redirigir a /login
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // De lo contrario, mostramos el contenido
  return children;
}
