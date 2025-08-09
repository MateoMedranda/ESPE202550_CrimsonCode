import React, { useState,useEffect } from "react";
import useProfilesController from "../hooks/ProfileManager";
import bootstrap from "bootstrap/dist/js/bootstrap.bundle";
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';

export default function Profiles({ token }) {
    
    const {
    ProfileTableGet,
    handleAddPermits,
    handleEditPermits,
    handleViewPermits,
    handleSaveProfile,
    handleEditProfile,
    profilesTableRef,
    permitsContainerRef,
    profiles,
    permitsContainerViewRef,
    permitsContainerEditRef,
    message,
    handleToggleState,
    loading
  } = useProfilesController(token);

  useEffect(() => {
    ProfileTableGet();
  }, []);

  const onCancel = (modalname) => {
    const modal = document.getElementById(modalname);  
    if (modal) {
      modal.classList.remove("show");
      modal.style.display = "none";
      document.body.classList.remove("modal-open");
      document.body.style.paddingRight = "";
      const backdrop = document.querySelector(".modal-backdrop");
      if (backdrop) {
        backdrop.remove();
      }
    }
  }
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
            onClick={handleAddPermits}
          >
            <i className="bi bi-plus-circle"></i> Agregar Perfil
          </button>
        </div>
        <hr />
        <div className="container">
          <div className="table-responsive">
            <table className="table table-striped">
              <thead className="table-secondary">
                <tr>
                  <th>Perfil</th>
                  <th>Estado</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                    <tr>
                      <td colSpan="3" className="text-center">Cargando...</td>
                    </tr>
                  ) : profiles.length === 0 ? (
                    <tr>
                      <td colSpan="3" className="text-center">No hay perfiles disponibles.</td>
                    </tr>
                  ) : (
                  profiles.map(({ profiles_id, profiles_name, profiles_state }) => {
                    const estadoTexto = profiles_state === 'ACTIVE' ? 'Activo' : 'Inactivo';
                    const btnEstado = profiles_state === 'ACTIVE' ? 'btn-danger' : 'btn-success';
                    const iconoEstado = profiles_state === 'ACTIVE' ? 'bi-check-circle' : 'bi-x-circle';
                    const accion = profiles_state === 'ACTIVE' ? 'Desactivar' : 'Activar';

                    return (
                      <tr key={profiles_id}>
                        <td>{profiles_name}</td>
                        <td>{estadoTexto}</td>
                        <td>
                          <button
                            className="btn btn-sm btn-primary me-1"
                            onClick={() => handleEditPermits(profiles_id, profiles_name)}
                          >
                            <i className="bi bi-pencil"></i> Editar
                          </button>
                          <button
                            className="btn btn-sm btn-info me-1"
                            onClick={() => handleViewPermits( profiles_id,profiles_name)}
                          >
                            <i className="bi bi-eye-fill"></i> Ver Permisos
                          </button>
                          <button
                            className={`btn btn-sm ${btnEstado}`}
                            onClick={() => handleToggleState(profiles_id, profiles_state)}
                          >
                            <i className={`bi ${iconoEstado}`}></i> {accion}
                          </button>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
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
                  {loading ? (
                    <h1>
                      Cargando...
                    </h1>
                  ) : profiles.length === 0 ? (
                    <h1>
                      o hay perfiles disponibles.
                    </h1>)
                    :(
                  <div className="mx-4" ref={permitsContainerRef}></div>
                    )}
                </div>
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-white border-dark"
                  data-bs-dismiss="modal"
                  onClick={() => onCancel('register_profile')}
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
      {/* Modal edit */}
         <div className="modal fade" id="edit_modal" tabIndex="-1" aria-hidden="true">
      <div className="modal-dialog modal-dialog-centered modal-xl">
        <div className="modal-content">
          <div className="container">
            <div className="row">
              <h1 className="text-center">Editar Perfil</h1>
            </div>

            <div className="row border border-dark p-3 my-4 mx-4 position-relative">
              <h3
                className="position-absolute top-0 start-0 ms-3 px-2"
                style={{ marginTop: "-12px", backgroundColor: "white", display: "inline" }}>
                Datos del perfil
              </h3>
              <div className="col-md-8">
                <input type="hidden" id="profile_id_edit" name="profile_id_edit" />
                <label htmlFor="profile_name_edit" className="form-label">
                  Nombre del perfil:
                  <input
                    type="text"
                    id="profile_name_edit"
                    name="profile_name_edit"
                    className="form-control border-dark"
                    required
                  />
                </label>
              </div>
            </div>

            <div className="row border border-dark p-3 my-4 mx-4 position-relative">
              <h3
                className="position-absolute top-0 start-0 ms-3 px-2"
                style={{ marginTop: "-12px", backgroundColor: "white", display: "inline" }}
              >
                Permisos para el perfil
              </h3>
                <div className="col-md-12">
                  {loading ? (
                    <h1>
                      Cargando...
                    </h1>
                  ) : profiles.length === 0 ? (
                    <h1>
                      o hay perfiles disponibles.
                    </h1>)
                    :(
                  <div className="mx-4" ref={permitsContainerEditRef}></div>
                    )}
                </div>
            </div>

            <div className="modal-footer d-flex justify-content-center align-items-center">
              <button type="button" className="btn btn-white border border-dark" data-bs-dismiss="modal" onClick={() => onCancel('edit_modal')}>
                Cancelar
              </button>
              <button type="button" className="btn btn-white border border-dark" onClick={handleEditProfile}>
                Guardar Cambios
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
        {/* Modal view */}             
        <div className="modal fade" id="permits_view" tabIndex="-1" aria-hidden="true">
      <div className="modal-dialog modal-dialog-centered modal-xl">
        <div className="modal-content">
          <div className="container">
            <div className="row">
              <h1 className="text-center">Datos del perfil</h1>
            </div>

            <div className="row border border-dark p-3 my-4 mx-4 position-relative">
              <div className="col-md-8">
                <input type="hidden" id="profile_id_view" name="profile_id_view" />

                <label htmlFor="profile_name_view" className="form-label">
                  Nombre del perfil:
                  <input type="text" id="profile_name_view" name="profile_name_view" className="form-control border-dark" readOnly/>
                </label>
              </div>
            </div>

            <div className="row border border-dark p-3 my-4 mx-4 position-relative">
              <h3
                className="position-absolute top-0 start-0 ms-3 px-2"
                style={{ marginTop: "-12px", backgroundColor: "white", display: "inline" }}
              >
                Permisos del perfil
              </h3>

              <div className="col-md-12">
                  {loading ? (
                    <h1>
                      Cargando...
                    </h1>
                  ) : profiles.length === 0 ? (
                    <h1>
                      o hay perfiles disponibles.
                    </h1>)
                    :(
                  <div className="mx-4" ref={permitsContainerViewRef}></div>
                    )}
                </div>
            </div>

            <div className="modal-footer d-flex justify-content-center align-items-center">
              <button
                type="button"
                className="btn btn-white border border-dark"
                data-bs-dismiss="modal"
                onClick={() => onCancel('permits_view')}
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div
      className="modal fade"
      id="information_container"
      tabIndex="-1"
      aria-labelledby="information_container"
      aria-hidden="true">
      <div className="modal-dialog modal-dialog-centered modal-lg my-5">
        <div className="modal-content my-5">
          <div className="container my-5">
            <div className="row">
              <h1 className="text-center" id="message">
                {message}
              </h1>
            </div>
          </div>
        </div>
      </div>
    </div>
    </div>
  );
}
