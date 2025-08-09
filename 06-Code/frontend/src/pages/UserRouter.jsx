import React, { useState,useEffect } from "react";
import useUserController from "../hooks/UserManager";
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';

export default function User({ token }) {
    
    const {
    UserTableGet,
    handleAddUser,
    handleSaveUser,
    handleEditUser,
    handleUpdateUser,
    profilesContainerRef,
    profilesEditContainerRef,
    loading,
    user,
    message
  } = useUserController(token);

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
        <div className="text-center bg-success-subtle">
          <h2 className="title"><b>Menu Usuarios</b></h2>
        </div>
        <hr />
        <div className="d-flex">
          <div className="col"></div>
          <div className="col text-end">
            <button id="add_user" className="btn_add btn bg-info-subtle border-black" onClick={handleAddUser}>
              <i className="bi bi-plus-circle" ></i> Agregar Usuario
            </button>
          </div>
        </div>
        <hr />

        <div className="container" id="user_table">
          <div className="table-responsive">
            <table className="table table-striped">
              <thead className="table-secondary">
                <tr>
                  <th>
                    Cedula
                    <button className="btn btn-sm btn-light ms-2" id="personal_id_filter">
                      <i className="bi bi-arrow-down-circle"></i>
                    </button>
                  </th>
                  <th>
                    Nombre y Apellido
                    <button className="btn btn-sm btn-light ms-2" id="name_filter">
                      <i className="bi bi-arrow-down-circle"></i>
                    </button>
                  </th>
                  <th>
                    Perfil
                    <button className="btn btn-sm btn-light ms-2" id="profile_filter">
                      <i className="bi bi-arrow-down-circle"></i>
                    </button>
                  </th>
                  <th>
                    Email
                    <button className="btn btn-sm btn-light ms-2" id="email_filter">
                      <i className="bi bi-arrow-down-circle"></i>
                    </button>
                  </th>
                  <th>
                    Telefono
                    <button className="btn btn-sm btn-light ms-2" id="phone_filter">
                      <i className="bi bi-arrow-down-circle"></i>
                    </button>
                  </th>
                  <th>
                    Estado
                    <button className="btn btn-sm btn-light ms-2" id="state_filter">
                      <i className="bi bi-arrow-down-circle"></i>
                    </button>
                  </th>
                  <th></th>
                </tr>
              </thead>
              <tbody id="table_body">
                
                {loading ?  (
                    <tr>
                      <td colSpan="3" className="text-center">Cargando...</td>
                    </tr>
                  ) : user.length === 0 ? (
                    <tr>
                      <td colSpan="3" className="text-center">No hay Usuarios disponibles.</td>
                    </tr>
                  ) : (
                    user.map(({id, name, surname, personal_id, email, phone_number, profile_name,state }) => {
                    const estadoTexto = state === 'ACTIVE' ? 'Activo' : 'Inactivo';
                    const btnEstado = state === 'ACTIVE' ? 'btn-danger' : 'btn-success';
                    const iconoEstado = state === 'ACTIVE' ? 'bi-check-circle' : 'bi-x-circle';
                    const accion = state === 'ACTIVE' ? 'Desactivar' : 'Activar';
                        return (
                            <tr key={id}>
                                <td>{personal_id}</td>
                                <td>{name} {surname}</td>
                                <td>{profile_name}</td>
                                <td>{email}</td>
                                <td>{phone_number}</td>
                                <td>{estadoTexto}</td>
                                <td>
                                    <button
                                        className="btn btn-sm btn-primary me-1"
                                        onClick={()=> {handleEditUser(id)}}
                                    >
                                        <i className="bi bi-pencil"></i> Editar
                                    </button>
                                    <button
                                        className={`btn btn-sm ${btnEstado}`}
                                        onClick={()=> {}}
                                    >
                                        <i className={`bi ${iconoEstado}`}></i> {accion}
                                    </button>
                                </td>
                            </tr>
                        );
                    
                }))
                    }
              </tbody>
            </table>
          </div>
        </div>

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
  

        {/* Information container */}
        <div className="modal fade" id="information_container" tabIndex="-1" aria-labelledby="information_container" aria-hidden="true">
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

      </fieldset>

      
    </div>
  );
}
