export default function UserHeader({ canCreate, onAddUser }) {
  return (
    <>
      <div className="text-center bg-success-subtle">
        <h2 className="title"><b>Menu Usuarios</b></h2>
      </div>
      <hr />
      <div className="d-flex">
        <div className="col"></div>
        <div className="col text-end">
          {canCreate && (
            <button 
              id="add_user" 
              className="btn_add btn bg-info-subtle border-black" 
              onClick={onAddUser}
            >
              <i className="bi bi-plus-circle"></i> Agregar Usuario
            </button>
          )}
        </div>
      </div>
      <hr />
    </>
  );
}
