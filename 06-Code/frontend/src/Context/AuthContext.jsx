import { createContext, useContext, useState, useEffect} from "react";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [token, setToken] = useState(localStorage.getItem("token") || null);
  const [user, setUser] = useState(localStorage.getItem("user") || null);
  const [permits, setPermits] = useState(
    JSON.parse(localStorage.getItem("permits") || "[]")
  );
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(false);
  }, []);

  const login = (newToken, newUser, newPermits) => {
    setToken(newToken);
    setUser(newUser);
    setPermits(newPermits);

    localStorage.setItem("token", newToken);
    localStorage.setItem("user", newUser);
    localStorage.setItem("permits", JSON.stringify(newPermits));
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    setPermits([]);
    localStorage.clear();
  };

  return (
    <AuthContext.Provider value={{ token, user, permits, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
