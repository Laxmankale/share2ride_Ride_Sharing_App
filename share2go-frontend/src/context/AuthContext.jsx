import { createContext, useContext, useState, useEffect } from "react";
import { jwtDecode } from "jwt-decode";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem("token") || null);

  useEffect(() => {
    if (token) {
      localStorage.setItem("token", token);

      try {
        const decoded = jwtDecode(token);
        setUser({
          id: decoded.userId,
          email: decoded.sub,
          role: decoded.role,
        });
      } catch (e) {
        console.error("Invalid token:", e);
        logout();
      }
    }
  }, [token]);

  const login = (token) => {
    setToken(token);
  };

  const logout = () => {
    localStorage.removeItem("token");
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, token, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
