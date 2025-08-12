import React, { useState } from "react";

export default function UserRegisterModal({ onCancel, startGoogleAuth, canCreate }) {
  const [email, setEmail] = useState("");

  if (!canCreate) return null;

  const handleStart = () => {
    startGoogleAuth(email);
  };

  return (
    <div className="modal fade" id="user_register" tabIndex="-1" aria-hidden="true">
      <div className="modal-dialog modal-dialog-centered modal-lg">
        <div className="modal-content">
          <div className="container">
            <div className="row">
              <h1 className="text-center">Registrar Usuario</h1>
            </div>
            <div className="row border border-dark p-3 my-4 mx-4 position-relative">
              <h3
                className="position-absolute top-0 start-0 ms-3 px-2"
                style={{ marginTop: "-12px", backgroundColor: "white" }}
              >
                Ingrese el correo Gmail a Registrar
              </h3>
              <div className="col-md-12 py-5">
                <label htmlFor="email" >Email:</label>
                <input
                  type="email"
                  name="email"
                  id="email"
                  className="form-control border-dark"
                  placeholder="usuario@gmail.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="modal-footer d-flex justify-content-center align-items-center">
              <button type="button" className="btn btn-white border border-dark" data-bs-dismiss="modal" onClick={() => onCancel("user_register")}>
                Cancelar
              </button>
              <button type="button" className="btn btn-primary" onClick={handleStart}>
                Enviar Formulario
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
