export default function InformationModal({ message }) {
  return (
    <div className="modal fade" id="information_container" tabIndex="-1" aria-hidden="true">
      <div className="modal-dialog modal-dialog-centered modal-lg my-5">
        <div className="modal-content my-5">
          <div className="container my-5">
            <div className="row">
              <h1 className="text-center" id="message">{message}</h1>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
