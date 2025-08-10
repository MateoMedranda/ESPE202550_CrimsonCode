// UserTable.jsx
import React from "react";
import { useAuth } from "../../Context/AuthContext";
export default function UserTable({ userdata, loading, handleEditUser, handleToggleState, canEdit, canDelete}) {
  return (
    <div className="container" id="user_table">
      <div className="table-responsive">
        <table className="table table-striped">
          <thead className="table-secondary">
            <tr>
              <th>Cédula</th>
              <th>Nombre y Apellido</th>
              <th>Perfil</th>
              <th>Email</th>
              <th>Teléfono</th>
              <th>Estado</th>
               <th></th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan="6" className="text-center">Cargando...</td>
              </tr>
            ) : userdata.length === 0 ? (
              <tr>
                <td colSpan="6" className="text-center">No hay usuarios disponibles.</td>
              </tr>
            ) : (
              userdata
              .filter(userdata => userdata.profile_name !== "Administrador General")
              .map(({ id, name, surname, personal_id, email, phone_number, profile_name, state }) => {
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
                    {canEdit && (
                    <>
                        <button
                          className="btn btn-sm btn-primary me-1"
                          onClick={() => handleEditUser(id)}
                        >
                          <i className="bi bi-pencil"></i> Editar
                        </button>
                    </>
                    )}
                    {canDelete && (
                    <>
                      <button
                          className={`btn btn-sm ${btnEstado}`}
                          onClick={() => handleToggleState(id, state)}
                        >
                          <i className={`bi ${iconoEstado}`}></i> {accion}
                        </button>
                    </>
                    )}
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
