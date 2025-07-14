import React, { useEffect } from "react";
import useProfilesController from "./hooks/ProfileManager";

export default function Profiles() {
  const {
    ProfileTableGet,
    handleAddProfile,
    handleSaveProfile,
    profilesTableRef,
    permitsContainerRef,
    
  } = useProfilesController();

  useEffect(() => {
    ProfileTableGet(); 
  }, []);

  return (
    <div className="container mt-4">
      <fieldset className="border p-4 shadow agregar bg-light rounded">
        <div className="text-center bg-success-subtle">
          <h2 className="title">
            <b>Menu Perfiles</b>
          </h2>
        </div>
        <hr />
        <div className="d-flex justify-content-end">
          <button
            className="btn_add btn bg-info-subtle border-black"
            onClick={handleAddProfile}
          >
            <i className="bi bi-plus-circle"></i> Agregar Perfil
          </button>
        </div>
        <hr />
        <div className="container" id="profile_table">
          <div className="table-responsive">
            <table className="table table-striped">
              <thead className="table-secondary">
                <tr>
                  <th>Perfil</th>
                  <th>Estado</th>
                  <th></th>
                </tr>
              </thead>
              <tbody ref={profilesTableRef}></tbody>
            </table>
          </div>
        </div>
      </fieldset>

      {/* Modal */}
      <div className="modal fade" id="register_profile" tabIndex="-1">
        <div className="modal-dialog modal-dialog-centered modal-xl">
          <div className="modal-content">
            <div className="container">
              <h1 className="text-center">Registrar Nuevo Perfil</h1>
              <div className="row border border-dark p-3 my-4 mx-4">
                <div className="col-md-8">
                  <label htmlFor="profile_name" className="form-label">
                    Nombre del perfil:
                  </label>
                  <input
                    type="text"
                    id="profile_name"
                    className="form-control border-dark"
                  />
                </div>
              </div>
              <div className="row border border-dark p-5 my-4 mx-4">
                <h3>Permisos para el perfil</h3>
                <div className="col-md-12">
                  <div className="mx-4" ref={permitsContainerRef}></div>
                </div>
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-white border-dark"
                  data-bs-dismiss="modal"
                >
                  Cancelar
                </button>
                <button
                  type="button"
                  className="btn btn-white border-dark"
                  onClick={handleSaveProfile}
                >
                  Guardar
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
