import React, { useContext } from "react";
import { AuthContext } from "../AuthContext";

const Estadisticas = () => {
  const { user } = useContext(AuthContext);

  return (
    <div>
      <h1>Estadísticas</h1>
      {user?.rol === "administrador" && (
        <button>Opciones exclusivas del Administrador</button>
      )}

      <p>Aquí va la vista normal que ven docentes y administradores.</p>
    </div>
  );
};

export default Estadisticas;
