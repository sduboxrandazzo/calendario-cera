//App.js
//Importaciones generales + React
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

//Control de NavBar
import AuthLayout from './components/NavBarOFF';
import MainLayout from './components/NavBarON';

//Páginas concretas
import Login from './pages/Login';
import EstaSemana from './pages/EstaSemana';
import ProximaSemana from './pages/ProximaSemana';
import Horarios from './pages/Horarios';
import Estadisticas from './pages/Estadisticas';
import Configuracion from './pages/Configuracion';

//Control de token y rutas protegidas
import ProtectedRoute from './ProtectedRoute';
import { AuthProvider } from './AuthContext';


//Estilos globales
import './App.css'; 


function App() {
  return (
    <AuthProvider>
    <BrowserRouter>

      <Routes>
      <Route path="/" element={<Navigate to="/login" replace />} />
        {/* Rutas para autenticación */}
        <Route element={<AuthLayout />}>  
        <Route path="/login" element={<Login/>} />                                 </Route>

        {/* Rutas protegidas*/}
          <Route element={            <ProtectedRoute><MainLayout /></ProtectedRoute>}>
          <Route path="/esta-semana" element={<EstaSemana />} />
          <Route path="/proxima-semana" element={<ProximaSemana />} />
          <Route path="/horarios" element={<Horarios/>} />
          <Route path="/estadisticas" element={<Estadisticas/>} />
          <Route path="/configuracion" element={<Configuracion/>} />                 </Route>
                                                                                    </Routes>
    
                                                                                    </BrowserRouter>
                                                                                    </AuthProvider>
  );

}

export default App;
