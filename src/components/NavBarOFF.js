// AuthLayout.jsx
// Un layout simple que NO renderiza la NavBar:
import React from 'react';
import { Outlet } from 'react-router-dom';

export default function AuthLayout() {
  return (
    <div className="auth-layout">
      {/* Aquí podrías poner un logo o un background especial */}
      <Outlet />
    </div>
  );
}
