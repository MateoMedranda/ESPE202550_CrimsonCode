const handleLogout = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
  window.location.reload();
};
function Menu_logout(){
  return(
  <div
  className="modal fade"
  id="logoutModal"
  tabIndex="-1"
  aria-labelledby="logoutModalLabel"
  aria-hidden="true"
>
  <div className="modal-dialog modal-dialog-centered">
    <div className="modal-content">
      <div className="modal-header">
        <h5 className="modal-title" id="logoutModalLabel">Inactividad detectada</h5>
      </div>
      <div className="modal-body">
        No se detectó actividad en el sistema. Por favor, haga clic en el botón para cerrar su sesión.
      </div>
      <div className="modal-footer">
        <button
          type="button"
          className="btn btn-danger"
          onClick={handleLogout}
        >
          Ok
        </button>
      </div>
    </div>
  </div>
</div>

  );
}
export default handleLogout;
export {Menu_logout};