import { createContext, useContext, useState, useEffect } from "react";
import { jwtDecode } from "jwt-decode";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [token, setToken] = useState(localStorage.getItem("token") || null);
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem("user");
    return saved ? JSON.parse(saved) : null;
  });

  useEffect(() => {
    if (!token) {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      setUser(null);
      return;
    }

    // Save token to localStorage
    localStorage.setItem("token", token);

    // If saved user exists AND has id, don't overwrite.
    const savedUserRaw = localStorage.getItem("user");
    if (savedUserRaw) {
      try {
        const parsed = JSON.parse(savedUserRaw);
        if (parsed && parsed.id) {
          setUser(parsed);  // valid user
          return;
        }
      } catch (e) {
        // corrupted user object → fall through to decode
      }
    }

    // Fallback: decode token if no valid local user found
    try {
      const decoded = jwtDecode(token);

      const decodedUser = {
        id: decoded.uid,
        email: decoded.sub,
        role: decoded.role,
      };

      setUser(decodedUser);
      localStorage.setItem("user", JSON.stringify(decodedUser));
    } catch (err) {
      console.error("Invalid token:", err);
      logout();
    }
  }, [token]);

  // FIXED LOGIN — maps backend userData into correct FE structure
  const login = (token, userData) => {
    const correctedUser = {
      id: userData.userId,               // backend: userId
      email: userData.email || jwtDecode(token).sub, // fallback from token
      role: userData.role,               // backend provides role
    };

    setToken(token);
    setUser(correctedUser);

    localStorage.setItem("token", token);
    localStorage.setItem("user", JSON.stringify(correctedUser));
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem("token");
    localStorage.removeItem("user");
  };

  return (
    <AuthContext.Provider value={{ user, token, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
