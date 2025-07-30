import { useState } from "react";
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import '../css/login.css';

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!username.trim() || !password.trim()) {
      alert("Por favor, completa todos los campos.");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("https://sima-es01.onrender.com/api/user/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password }),
      });

      if (!res.ok) {
        const err = await res.json();
        alert(err.message || "Error en el login");
        setLoading(false);
        return;
      }

      const data = await res.json();

      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));

      window.location.reload(); 

    } catch (err) {
      console.error(err);
      alert("Error de conexión al servidor");
    } finally {
      setLoading(false);
    }
  };


  return (
    <div className="login-bck d-flex justify-content-center align-items-center min-vh-100">
      <div className="login-box text-center">
        <img src="/img/biosigma_logo.png" alt="Logo" className="mb-3" />
        <h3>Bienvenido</h3>
        <form onSubmit={handleSubmit}>
          <div className="form-group mb-3">
            <input
              type="text"
              className="form-control"
              name="username"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>
          <div className="form-group mb-3">
            <input
              type="password"
              className="form-control"
              name="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <button
            type="submit"
            className="btn btn-primary w-100"
            disabled={loading}
          >
            {loading ? "Cargando…" : "LOGIN"}
          </button>
        </form>
      </div>
    </div>
  );
}
