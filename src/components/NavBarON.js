// MainLayout.js 
import React from 'react';
import { Outlet } from 'react-router-dom';
import NavBar from '../components/NavBar';

export default function MainLayout() {
  return (
    <div className="layout">
    <NavBar />
    <main className="content">
      <Outlet />
    </main>
  </div>
);
}
