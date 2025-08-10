import React from "react";

export default function UserEditModal({ onCancel, handleUpdateUser, profilesEditContainerRef, canEdit }) {
  if (!canEdit) return null; 

  return (
    <div className="modal fade" id="user_edit" tabIndex="-1" aria-hidden="true">
      <div className="modal-dialog modal-dialog-centered modal-lg">
        <div className="modal-content">
          <div className="container">
            <div className="row">
              <h1 className="text-center">Editar Usuario</h1>
            </div>

            {/* Datos del Usuario */}
            <div className="row border border-dark p-3 pt-5 my-4 mx-4 position-relative">
              <h3
                className="position-absolute top-0 start-0 ms-3 px-2"
                style={{ marginTop: "-12px", backgroundColor: "white", display: "inline" }}
              >
                Datos del Usuario
              </h3>
              <div className="col-md-6">
                <input type="hidden" id="user_id_edit" name="user_id_edit" />
                <label htmlFor="name_edit" className="form-label">
                  Nombre:
                  <input type="text" id="name_edit" name="name_edit" className="form-control border-dark" readOnly />
                </label>
              </div>
              <div className="col-md-4">
                <label htmlFor="surname_edit" className="form-label">
                  Apellido:
                  <input type="text" id="surname_edit" name="surname_edit" className="form-control border-dark" readOnly />
                </label>
              </div>
            </div>
            {/* Datos de la cuenta */}
            <div className="row border border-dark p-3 pt-5 my-4 mx-4 position-relative">
              <h3
                className="position-absolute top-0 start-0 ms-3 px-2"
                style={{ marginTop: "-12px", backgroundColor: "white", display: "inline" }}
              >
                Datos de la cuenta
              </h3>
              <div className="col-md-6">
                <label htmlFor="username_edit" className="form-label">
                  Usuario:
                  <input type="text" id="username_edit" name="username_edit" className="form-control border-dark" readOnly />
                </label>
              </div>
              <div className="modal-footer">
                <div className="col">
                  <label htmlFor="user_profile_edit" className="form-label">Perfil:</label>
                  <select
                    className="form-control border-dark text-dark"
                    id="user_profile_edit"
                    name="user_profile_edit"
                    required
                    ref={profilesEditContainerRef}
                  ></select>
                </div>
              </div>
            </div>


            {/* Botones */}
            <div className="modal-footer d-flex justify-content-center align-items-center">
              <button type="button" className="btn btn-white border border-dark" data-bs-dismiss="modal" onClick={() => onCancel("user_edit")}>
                Cancelar
              </button>
              <button type="button" className="btn btn-white border border-dark" id="update_user" onClick={handleUpdateUser}>
                Actualizar
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
