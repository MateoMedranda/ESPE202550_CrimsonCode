export default function ProfileHeader({canCreate,handleAddPermits}){
    return(
        <>
        <div className="text-center bg-success-subtle">
          <h2 className="title">
            <b>Menu Perfiles</b>
          </h2>
        </div>
        <hr />
        <div className="d-flex justify-content-end">
            {canCreate && (
            <button className="btn_add btn bg-info-subtle border-black"
            onClick={handleAddPermits}>
                <i className="bi bi-plus-circle"></i> Agregar Perfil
            </button>
            )}
          
        </div>
        <hr />
        </>
    );
}