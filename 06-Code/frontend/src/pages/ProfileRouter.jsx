import React, { useState,useEffect } from "react";
import useProfilesController from "../hooks/ProfileManager";
import { useAuth } from "../Context/AuthContext";
import ProfileHeader from "../components/Profiles/ProfileHeader";
import ProfileTable from "../components/Profiles/ProfileTable";
import bootstrap from "bootstrap/dist/js/bootstrap.bundle";
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';

export default function Profiles() {
  const {token,permits } = useAuth();   
    const canEdit = permits?.Perfiles?.profiles_updateprofiles?.value === true;
    const canCreate = permits?.Perfiles?.profiles_createprofiles?.value === true;
    const canView = permits?.Perfiles?.profiles_readprofiles?.value === true; 
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
      <ProfileHeader canCreate={canCreate} handleAddPermits={handleAddPermits}/>
      {canView && (
        <ProfileTable canEdit={canEdit} handleEditPermits= {handleEditPermits} handleViewPermits={handleEditPermits} 
      handleToggleState={handleToggleState} loading={loading} profiles={profiles} />
      )}
      
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
