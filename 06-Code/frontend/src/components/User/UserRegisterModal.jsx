import React, { useEffect, useRef } from "react";

export default function UserRegisterModal({ onCancel, handleSaveUser, profilesContainerRef, canCreate, profiles }) {
  if (!canCreate) return null;

  useEffect(() => {
    if (profiles && profilesContainerRef.current) {
      profilesContainerRef.current.innerHTML = '<option value="seleccione">Seleccione...</option>';
      profiles.forEach((profile) => {
        if(profile.profiles_state !== "ACTIVE") return;
        const option = document.createElement("option");
        option.value = profile.profiles_id;
        option.textContent = profile.profiles_name;
        profilesContainerRef.current.appendChild(option);
      });
    }
  }, [profiles, profilesContainerRef]);

  return (
    <div className="modal fade" id="user_register" tabIndex="-1" aria-hidden="true">
      <div className="modal-dialog modal-dialog-centered modal-lg">
        <div className="modal-content">
          <div className="container">
            <div className="row">
              <h1 className="text-center">Registrar Usuario</h1>
            </div>

            {/* Datos del Usuario */}
            <div className="row border border-dark p-3 my-4 mx-4 position-relative">
              <h3
                className="position-absolute top-0 start-0 ms-3 px-2"
                style={{ marginTop: "-12px", backgroundColor: "white", display: "inline" }}
              >
                Datos del Usuario
              </h3>
              <div className="col-md-6">
                <label className="form-label">
                  Nombre:
                  <input type="text" id="name" name="name" className="form-control border-dark" required />
                </label>
              </div>
              <div className="col-md-4">
                <label className="form-label">
                  Apellido:
                  <input type="text" id="surname" name="surname" className="form-control border-dark" required />
                </label>
              </div>
              <div className="col-md-6">
                <label className="form-label">
                  Correo:
                  <input type="email" id="email" name="email" className="form-control border-dark" required />
                </label>
              </div>
              <div className="col-md-4">
                <label className="form-label">
                  Número de teléfono:
                  <input type="text" id="phone_number" name="phone_number" className="form-control border-dark" required />
                </label>
              </div>
              <div className="col-md-6">
                <label className="form-label">
                  Fecha de nacimiento:
                  <input type="date" id="born_date" name="born_date" className="form-control border-dark" required />
                </label>
              </div>
            </div>

            {/* Datos de la cuenta */}
            <div className="row border border-dark p-3 my-4 mx-4 position-relative">
              <h3
                className="position-absolute top-0 start-0 ms-3 px-2"
                style={{ marginTop: "-12px", backgroundColor: "white", display: "inline" }}
              >
                Datos de la cuenta
              </h3>
              <div className="col-md-6">
                <label className="form-label">
                  Usuario:
                  <input type="text" id="user_name" name="user_name" className="form-control border-dark" required />
                </label>
              </div>
              <div className="col-md-6">
                <label className="form-label">
                  Cédula:
                  <input type="text" id="personal_id" name="personal_id" className="form-control border-dark" required />
                </label>
              </div>
              <div className="modal-footer">
                <div className="col">
                  <label className="form-label" htmlFor="user_profile">Perfil:</label>
                  <select
                    className="form-control border-dark text-dark"
                    id="user_profile"
                    name="user_profile"
                    ref={profilesContainerRef}
                    required
                  ></select>
                </div>
              </div>
            </div>

            {/* Botones */}
            <div className="modal-footer d-flex justify-content-center align-items-center">
              <button type="button" className="btn btn-white border border-dark" data-bs-dismiss="modal" onClick={() => onCancel("user_register")}>
                Cancelar
              </button>
              <button type="button" className="btn btn-white border border-dark" id="submit_user" onClick={handleSaveUser}>
                Ingresar
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}