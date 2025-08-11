import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./Context/AuthContext";
import Login from "./pages/LoginRouter.jsx";
import RegisterPage from "./pages/registerRouter.jsx";
import { Menu } from "./App.jsx";
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';

function ProtectedRoute({ children }) {
  const { token, loading } = useAuth();
  if (loading) return <div>Cargando...</div>; 
  return token ? children : <Navigate to="/login" replace />;
}

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/registro" element={<RegisterPage />} />
          
          <Route
            path="/*"
            element={
              <ProtectedRoute>
                <Menu />
              </ProtectedRoute>
            }
          />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  </StrictMode>
);