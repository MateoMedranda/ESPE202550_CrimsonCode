import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { MemoryRouter } from "react-router-dom";
import { AuthProvider, useAuth } from "./Context/AuthContext";
import Login from "./pages/LoginRouter.jsx";
import { Menu } from "./App.jsx";
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';

function RootApp() {
  const { token } = useAuth();
  return token ? <Menu /> : <Login />;
}

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <AuthProvider>
      <MemoryRouter>
        <RootApp />
      </MemoryRouter>
    </AuthProvider>
  </StrictMode>
);
