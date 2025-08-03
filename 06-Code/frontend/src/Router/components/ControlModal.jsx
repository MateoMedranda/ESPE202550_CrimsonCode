import React from "react";

export default function ControlModal({ show, onClose }) {
    if (!show) return null;

    const handleContentClick = (e) => e.stopPropagation();

    return (
    <div className="modal fade show d-block" tabIndex="-1" role="dialog">
        {/* Backdrop */}
        <div
            className="modal-backdrop fade show"
            onClick={onClose}
        ></div>

        {/* Contenido del modal */}
        <div
            className="modal-dialog modal-xl modal-dialog-centered"
            role="document"
            style={{ zIndex: 1055 }}
        >
            <div
                className="modal-content rounded-4 shadow-lg border-0 overflow-hidden"
                onClick={handleContentClick}
            >
                {/* Header */}
                <div className="modal-header bg-info-subtle text-dark py-3">
                    <h3 className="mb-0">
                        <i className="bi bi-clipboard-check me-2"></i> Nuevo Control
                    </h3>
                    <button
                        type="button"
                        className="btn-close btn-close-dark"
                        onClick={onClose}
                    ></button>
                </div>

                {/* Formulario */}
                <form id="register_control" className="p-4">
                    <fieldset>
                        <div className="row g-3">
                            <div className="col-12 col-md-3">
                                <label className="form-label fw-semibold">Criterio*</label>
                                <select className="form-select shadow-sm">
                                    <option>Cumple</option>
                                    <option>No cumple</option>
                                </select>
                            </div>
                            <div className="col-12 col-md-5">
                                <label className="form-label fw-semibold">Observación*</label>
                                <input type="text" className="form-control shadow-sm" />
                            </div>
                            <div className="col-12 col-md-4">
                                <label className="form-label fw-semibold">Evidencia*</label>
                                <input type="file" className="form-control shadow-sm" />
                            </div>
                        </div>
                        <div className="text-end mt-4">
                            <button
                                type="button"
                                className="btn btn-outline-success px-4 me-2 shadow-sm"
                            >
                                <i className="bi bi-save me-2"></i> Guardar
                            </button>
                            <button
                                type="button"
                                className="btn btn-outline-danger px-4 shadow-sm"
                                onClick={onClose}
                            >
                                <i className="bi bi-x-circle me-2"></i> Cancelar
                            </button>
                        </div>
                    </fieldset>
                </form>

                {/* Seguimiento */}
                <div className="bg-light px-4 pb-4">
                    <hr />
                    <h4 className="text-center mb-3 fw-bold text-dark">
                        <i className="bi bi-graph-up-arrow me-2"></i> Seguimiento de cumplimiento
                    </h4>
                    <hr></hr>
                    <div className="table-responsive rounded shadow-sm">
                        <table className="table table-hover table-bordered align-middle text-center mb-0">
                            <thead className="table-primary">
                                <tr>
                                    <th>Fecha de Control</th>
                                    <th>Cumplimiento</th>
                                    <th>Observación</th>
                                    <th>Evidencias</th>
                                    <th>Acciones</th>
                                </tr>
                            </thead>
                            <tbody id="tablaEgresos">
                                {/* Datos dinámicos */}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    </div>
);

}
