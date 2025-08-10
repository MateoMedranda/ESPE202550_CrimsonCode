export default function ProfileTable({canEdit,handleEditPermits,handleViewPermits,handleToggleState,loading,profiles }){
       return(
         <div className="container">
          <div className="table-responsive">
            <table className="table table-striped">
              <thead className="table-secondary">
                <tr>
                  <th>Perfil</th>
                  <th>Estado</th>
                  {canEdit && <th></th>}
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
                        {canEdit && (
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
                    )}
                        
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