import React, { useState } from "react";

export default function ProfileForm() {
  const [form, setForm] = useState({
    nombre: "",
    apellido: "",
    cedula: "",
    username: "",
    password: "",
    new_password: "",
    repeat_password: "",
  });

  const [errors, setErrors] = useState({});

  const handleChange = e => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const validatePasswords = () => {
    const newErrors = {};
    if (form.new_password && form.new_password.length < 8) {
      newErrors.new_password = "La nueva contraseña debe tener mínimo 8 caracteres.";
    }
    if (form.new_password !== form.repeat_password) {
      newErrors.repeat_password = "Las contraseñas no coinciden.";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = e => {
    e.preventDefault();

    if (!validatePasswords()) return;

    alert("Formulario enviado con éxito!");
  };

  return (
    <div
      className="container mt-5 bg-white px-5 py-4 rounded shadow"
    >
      <h2 className="text-center fw-bold text-dark">
        Información Personal
      </h2>
      <hr className="mb-4"></hr>
      <form onSubmit={handleSubmit} noValidate>
        <div className="row gx-4 gy-4">
          {/* Nombre y Apellido - dos columnas */}
          <div className="col-md-6">
            <label htmlFor="nombre" className="form-label fw-semibold">
              Nombre
            </label>
            <input
              type="text"
              id="nombre"
              name="nombre"
              value={form.nombre}
              onChange={handleChange}
              className="form-control shadow-sm"
              placeholder="Ej: Juan"
              pattern="^[A-Za-zÁÉÍÓÚÑáéíóúñ\s]{2,50}$"
              required
              style={{ padding: "12px 14px" }}
            />
          </div>

          <div className="col-md-6">
            <label htmlFor="apellido" className="form-label fw-semibold">
              Apellido
            </label>
            <input
              type="text"
              id="apellido"
              name="apellido"
              value={form.apellido}
              onChange={handleChange}
              className="form-control shadow-sm"
              placeholder="Ej: Pérez"
              pattern="^[A-Za-zÁÉÍÓÚÑáéíóúñ\s]{2,50}$"
              required
              style={{ padding: "12px 14px" }}
            />
          </div>

          {/* Cédula y Username - dos columnas */}
          <div className="col-md-6">
            <label htmlFor="cedula" className="form-label fw-semibold">
              Cédula
            </label>
            <input
              type="text"
              id="cedula"
              name="cedula"
              value={form.cedula}
              onChange={handleChange}
              className="form-control shadow-sm"
              placeholder="Ej: 0102030405"
              pattern="^\d{10}$"
              required
              style={{ padding: "12px 14px" }}
            />
          </div>

          <div className="col-md-6">
            <label htmlFor="username" className="form-label fw-semibold">
              Username
            </label>
            <input
              type="text"
              id="username"
              name="username"
              value={form.username}
              onChange={handleChange}
              className="form-control shadow-sm"
              placeholder="Ej: juanperez123"
              pattern="^[a-zA-Z0-9_.-]{4,20}$"
              required
              style={{ padding: "12px 14px" }}
            />
          </div>

          {/* Contraseñas - tres columnas */}
          <div className="col-md-4">
            <label htmlFor="password" className="form-label fw-semibold">
              Contraseña Actual
            </label>
            <input
              type="password"
              id="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              className="form-control shadow-sm"
              required
              style={{ padding: "12px 14px" }}
            />
          </div>

          <div className="col-md-4">
            <label htmlFor="new_password" className="form-label fw-semibold">
              Nueva Contraseña
            </label>
            <input
              type="password"
              id="new_password"
              name="new_password"
              value={form.new_password}
              onChange={handleChange}
              className={`form-control shadow-sm ${
                errors.new_password ? "is-invalid" : ""
              }`}
              placeholder="Mínimo 8 caracteres"
              style={{ padding: "12px 14px" }}
            />
            {errors.new_password && (
              <div className="invalid-feedback">{errors.new_password}</div>
            )}
          </div>

          <div className="col-md-4">
            <label htmlFor="repeat_password" className="form-label fw-semibold">
              Repetir Contraseña
            </label>
            <input
              type="password"
              id="repeat_password"
              name="repeat_password"
              value={form.repeat_password}
              onChange={handleChange}
              className={`form-control shadow-sm ${
                errors.repeat_password ? "is-invalid" : ""
              }`}
              placeholder="Repite la nueva contraseña"
              style={{ padding: "12px 14px" }}
            />
            {errors.repeat_password && (
              <div className="invalid-feedback">{errors.repeat_password}</div>
            )}
          </div>
        </div>
        <hr className="my-4"></hr>

        {/* Botón */}
        <div className="d-flex justify-content-end mt-4">
          <button
            type="submit"
            className="btn btn-primary d-flex align-items-center gap-2 px-5 py-3 fw-semibold shadow"
            style={{
              fontSize: "1.1rem",
              boxShadow: "0 4px 12px rgba(13,110,253,0.5)",
              transition: "background-color 0.3s ease",
            }}
            onMouseEnter={e => (e.currentTarget.style.backgroundColor = "#0b5ed7")}
            onMouseLeave={e => (e.currentTarget.style.backgroundColor = "")}
          >
            Guardar Cambios
          </button>
        </div>
      </form>
    </div>
  );
}
