import { useState } from "react";
<<<<<<< HEAD:06-Code/frontend/src/Router/LoginRouter.jsx
import "../css/login.css";
import { useAuth } from "../Context/AuthContext";
=======
import { useAuth } from '../context/AuthContext';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import '../css/login.css';
import { useNavigate } from "react-router-dom";
>>>>>>> e3bfaac0329cb90485c47147fefb812a1ecd7529:06-Code/frontend/src/pages/LoginRouter.jsx

function Login() {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const { login } = useAuth();
<<<<<<< HEAD:06-Code/frontend/src/Router/LoginRouter.jsx

=======
  
>>>>>>> e3bfaac0329cb90485c47147fefb812a1ecd7529:06-Code/frontend/src/pages/LoginRouter.jsx
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!username.trim() || !password.trim()) {
      setErrorMsg("Por favor, completa todos los campos.");
      return;
    }

    setErrorMsg("");
    setLoading(true);

    try {
      const res = await fetch("https://sima-es01.onrender.com/api/user/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      if (!res.ok) {
        const err = await res.json();
<<<<<<< HEAD:06-Code/frontend/src/Router/LoginRouter.jsx
        setErrorMsg(err.message || "Error en el login");
=======
        setErrorMsg(err.message || "Error al iniciar sesión");
        setLoading(false);
>>>>>>> e3bfaac0329cb90485c47147fefb812a1ecd7529:06-Code/frontend/src/pages/LoginRouter.jsx
        return;
      }

      const data = await res.json();
      const permitsRes = await fetch(`https://sima-es01.onrender.com/api/profile/permits`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${data.token}`
          },              
          body: JSON.stringify({ id: data.user.profile_id }),
        }
      );

<<<<<<< HEAD:06-Code/frontend/src/Router/LoginRouter.jsx
      
      if (!permitsRes.ok) {
        const err = await permitsRes.json();
        setErrorMsg(err.message || "Error al obtener permisos");
        return;
      }
      const permits = await permitsRes.json();
      login(data.token, data.user, permits);
=======
      login(data.token,data.user);
      navigate("/", { replace: true });
>>>>>>> e3bfaac0329cb90485c47147fefb812a1ecd7529:06-Code/frontend/src/pages/LoginRouter.jsx

    } catch (err) {
      console.error(err);
      setErrorMsg("Error de conexión al servidor");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-bck d-flex justify-content-center align-items-center min-vh-100">
      <div className="login-box p-4 rounded shadow-lg">
        <div className="text-center mb-4">
          <img
            src="/img/Logo.png"
            alt="Logo"
            width={"110px"}
            className="login-logo mb-2"
          />
          <h3 className="login-title">Bienvenido</h3>
        </div>

        <form onSubmit={handleSubmit} noValidate>
          <div className="input-group mb-3">
            <span className="input-group-text bg-success text-white">
              <i className="bi bi-person-fill"></i>
            </span>
            <input
              type="text"
              className="form-control"
              placeholder="Usuario"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              disabled={loading}
              required
            />
          </div>

          <div className="input-group mb-4">
            <span className="input-group-text bg-success text-white">
              <i className="bi bi-lock-fill"></i>
            </span>
            <input
              type="password"
              className="form-control"
              placeholder="Contraseña"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={loading}
              required
            />
          </div>

          {errorMsg && (
            <div
              className="alert bg-danger-subtle border-danger rounded mb-3"
              role="alert"
            >
              {errorMsg}
            </div>
          )}

          <button
            type="submit"
            className="btn btn-success w-100 fw-semibold"
            disabled={loading}
          >
            {loading ? (
              <>
                <span
                  className="spinner-border spinner-border-sm me-2"
                  role="status"
                  aria-hidden="true"
                ></span>
                Cargando…
              </>
            ) : (
              "Ingresar"
            )}
          </button>
        </form>
      </div>
    </div>
  );
}

export default Login;
