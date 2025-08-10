import React, { useState,useEffect } from "react";
import { useAuth } from "../Context/AuthContext";
import useUserController from "../hooks/UserManager";
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import UserTable from "../components/User/UserTable";
import informationModal from "../components/User/InformationModal"
import UserHeader from "../components/User/UserHeader";
export default function User({ token }) {
    const {
    UserTableGet,
    handleAddUser,
    handleSaveUser,
    handleEditUser,
    handleUpdateUser,
    handleToggleUser,
    profilesContainerRef,
    profilesEditContainerRef,
    loading,
    user,
    message
  } = useUserController(token);
  const { permits} = useAuth();
  const canEdit = permits?.Usuarios?.profiles_updateusers?.value === true;
  const canCreate = permits?.Usuarios?.profiles_createusers?.value === true;
  const canView = permits?.Usuarios?.profiles_readusers?.value === true;


  useEffect(() => {
    UserTableGet();
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
    <div className="container mt-4 mb-4 p-4">
      <fieldset className="border p-4 shadow agregar bg-light rounded">
        <hr />
        <UserHeader canCreate={canCreate} onAddUser={handleAddUser}/>
        <hr />

        <UserTable 
          user={user} 
          loading={loading} 
          handleEditUser={handleEditUser} 
          handleToggleState={handleToggleUser}
          canEdit={canEdit}
        />

        <hr />

        {/* Register Modal */}
        <div className="modal fade" id="user_register" tabIndex="-1" aria-hidden="true">
          <div className="modal-dialog modal-dialog-centered modal-lg">
            <div className="modal-content">
              <div className="container">
                <div className="row">
                  <h1 className="text-center">Registrar Usuario</h1>
                </div>

                {/* Datos del Usuario */}
                <div className="row border border-dark p-3 my-4 mx-4 position-relative">
                  <h3 className="position-absolute top-0 start-0 ms-3 px-2" style={{ marginTop: "-12px", backgroundColor: "white", display: "inline" }}>
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
                      Numero de telefono:
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

                {/* user Data */}
                <div className="row border border-dark p-3 my-4 mx-4 position-relative">
                  <h3 className="position-absolute top-0 start-0 ms-3 px-2" style={{ marginTop: "-12px", backgroundColor: "white", display: "inline" }}>
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
                      Cedula:
                      <input type="text" id="personal_id" name="personal_id" className="form-control border-dark" required />
                    </label>
                  </div>
                  <div className="modal-footer">
                    <div className="col">
                      <label className="form-label" htmlFor="user_profile">Perfil:</label>
                      <select className="form-control border-dark text-dark" id="user_profile" name="user_profile" ref={profilesContainerRef} required>

                      </select>
                    </div>
                  </div>
                </div>

                <div className="modal-footer d-flex justify-content-center align-items-center">
                  <button type="button" className="btn btn-white border border-dark" data-bs-dismiss="modal" onClick={() => onCancel("user_register")}>Cancelar</button>
                  <button type="button" className="btn btn-white border border-dark" id="submit_user" onClick={handleSaveUser}>Ingresar</button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/*Edit modal */}
          <div className="modal fade" id="user_edit" tabIndex="-1" aria-labelledby="user_register_label" aria-hidden="true">
            <div className="modal-dialog modal-dialog-centered modal-lg">
                <div className="modal-content">
                <div className="container">
                    <div className="row">
                    <h1 className="text-center">Registrar Usuario</h1>
                    </div>

                    {/* user data */}
                    <div className="row border border-dark p-3 my-4 mx-4 position-relative">
                    <h3 className="position-absolute top-0 start-0 ms-3 px-2"style={{backgroundColor: "white",display: "inline",}}>
                        Datos del Usuario
                    </h3>
                    <div className="col-md-6">
                        <input type="hidden" id="user_id_edit" name="user_id_edit" />
                        <label htmlFor="name_edit" className="form-label">
                        Nombre:
                        <input type="text" id="name_edit"  name="name_edit" className="form-control border-dark" readOnly/>
                        </label>
                    </div>
                    <div className="col-md-4">
                        <label htmlFor="surname_edit" className="form-label">
                        Apellido:
                        <input  type="text" id="surname_edit" name="surname_edit" className="form-control border-dark" readOnly
                        />
                        </label>
                    </div>
                    </div>

                    {/* account data */}
                    <div className="row border border-dark p-3 my-4 mx-4 position-relative">
                    <h3 className="position-absolute top-0 start-0 ms-3 px-2" style={{ marginTop: "-12px", backgroundColor: "white", display: "inline", }}
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
                        <label htmlFor="user_profile_edit" className="form-label">
                            Perfil:
                        </label>
                        <select className="form-control border-dark text-dark" id="user_profile_edit"  name="user_profile_edit" required ref={profilesEditContainerRef}
                        >

                        </select>
                        </div>
                    </div>
                    </div>

                    {/* Buttons */}
                    <div className="modal-footer d-flex justify-content-center align-items-center">
                    <button type="button" className="btn btn-white border border-dark" data-bs-dismiss="modal" onClick={() => onCancel("user_edit")}
                    >
                        Cancelar
                    </button>
                    <button type="button" className="btn btn-white border border-dark"  id="update_user" onClick={handleUpdateUser}
                    >
                        Actualizar
                    </button>
                    </div>
                </div>
                </div>
            </div>
            </div>
        <informationModal message={message}></informationModal>

      </fieldset>

      
    </div>
  );
}
