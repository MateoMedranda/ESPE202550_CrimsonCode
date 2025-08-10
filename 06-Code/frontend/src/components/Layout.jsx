import { Outlet, Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Menu from "./Menu.jsx";

export default function Layout() {
  const { token, loading } = useAuth();
  const isAuthenticated = !!token;

  if (loading) {
    return <div className="p-4">Cargando...</div>;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return (
    <>
      <Menu />
      <main>
        <Outlet />
      </main>
    </>
  );
}
