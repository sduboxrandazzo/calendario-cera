import React, { useState, useContext } from "react";
import { auth, db } from "../firebaseConfig";
import { signInWithEmailAndPassword } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import logo from "../assets/logo.png";
import "../styles.css";

// 1) Importamos el AuthContext para acceder a setUser
import { AuthContext } from "../AuthContext";

const Login = () => {
  // 2) Creamos estados locales para email, password y errores
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  // 3) useNavigate para movernos a otras rutas
  const navigate = useNavigate();

  // 4) Extraemos setUser del contexto, para guardar info del usuario al loguearse
  const { setUser } = useContext(AuthContext);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError(""); // Resetear mensaje de error al intentar loguear

    try {
      // 5) Autenticar con Firebase (email y password)
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // 6) Obtenemos de Firestore los datos (por ejemplo, el rol)
      const userRef = doc(db, "usuarios", user.email);
      const userSnap = await getDoc(userRef);

      if (userSnap.exists()) {
        const userData = userSnap.data();

        // 7) Guardamos la info del usuario en nuestro AuthContext
        setUser({
          email: user.email,
          rol: userData.rol,
        });

        // 8) Redirigimos a alguna ruta una vez logueado (ej. /esta-semana)
        navigate("/esta-semana");
      } else {
        // Si no se encuentra un documento para este usuario, arrojamos error
        setError("No tienes permisos para acceder.");
      }
    } catch (err) {
      // 9) Si Firebase lanza error de credenciales, mostramos mensaje
      setError("Usuario o contraseña incorrectos.");
    }
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <img src={logo} alt="Logo Colegio" className="logo" />
        <h2>CERA</h2>
        <p>Calendario de Entornos Rotativos de Aprendizaje</p>
        {error && <p className="error-message">{error}</p>}
        <form onSubmit={handleLogin}>
          <input
            type="email"
            placeholder="Ingresa tu usuario @santarsicio"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Contraseña"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button type="submit">Ingresar</button>
        </form>
      </div>
    </div>
  );
};

export default Login;
