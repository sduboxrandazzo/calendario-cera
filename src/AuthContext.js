// AuthContext.js
import React, { createContext, useState } from "react";

// Exportas el contexto
export const AuthContext = createContext();

// Proveedor del contexto
export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);

  return (
    <AuthContext.Provider value={{ user, setUser }}>
      {children}
    </AuthContext.Provider>
  );
}
