import React, { useEffect, useRef } from "react";
import { Tooltip } from "bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";

export default function ControlModal({ show, onClose }) {
    const tooltipRef = useRef(null);

    useEffect(() => {
        let tooltipInstance;
        if (tooltipRef.current) {
            tooltipInstance = new Tooltip(tooltipRef.current);
        }
        return () => {
            if (tooltipInstance) {
                tooltipInstance.dispose();
            }
        };
    }, [show]);

    if (!show) return null;

    const handleContentClick = (e) => e.stopPropagation();

    const controlData = {
        createdat: "2025-08-03T04:19:06.429Z",
        updatedat: "2025-08-03T04:19:06.429Z",
        control_id: 5,
        activity_id: 1,
        control_createdby: "María González",
        control_criterion: "Cumple",
        control_observation: "El procedimiento fue verificado y cumple con los estándares de calidad",
        control_evidence: "./evidence/control05062025_v6.pdf",
        control_verification: "Certificado de conformidad"
    };

    return (
        <div className="modal fade show d-block" tabIndex="-1" role="dialog">
            {/* Backdrop */}
            <div className="modal-backdrop fade show" onClick={onClose}></div>

            {/* Contenido del modal */}
            <div className="modal-dialog modal-xl modal-dialog-centered" role="document" style={{ zIndex: 1055 }}>
                <div className="modal-content rounded-4 shadow-lg border-0 overflow-hidden" onClick={handleContentClick}>

                    {/* Header */}
                    <div className="modal-header bg-info-subtle text-dark py-3">
                        <h3 className="mb-0">
                            <i className="bi bi-graph-up-arrow me-2"></i> Seguimiento de cumplimiento
                        </h3>
                        <button type="button" className="btn-close btn-close-dark" onClick={onClose}></button>
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
                                <button type="button" className="btn btn-outline-success px-4 me-2 shadow-sm">
                                    <i className="bi bi-save me-2"></i> Guardar
                                </button>
                                <button type="button" className="btn btn-outline-danger px-4 shadow-sm" onClick={onClose}>
                                    <i className="bi bi-x-circle me-2"></i> Cancelar
                                </button>
                            </div>
                        </fieldset>
                    </form>

                    {/* Seguimiento */}
                    <div className="bg-light px-4 pb-4">
                        <hr />
                        <div className="table-responsive rounded shadow-sm">
                            <table className="table table-hover table-bordered align-middle text-center mb-0">
                                <thead className="table-primary">
                                    <tr>
                                        <th>ID</th>
                                        <th>Creado por</th>
                                        <th>Fecha</th>
                                        <th>Criterio</th>
                                        <th>Observación</th>
                                        <th>Verificación</th>
                                        <th>Evidencia</th>
                                    </tr>
                                </thead>
                                <tbody id="tablaEgresos">
                                    <tr>
                                        <td>{controlData.control_id}</td>
                                        <td>{controlData.control_createdby}</td>
                                        <td>{new Date(controlData.updatedat).toLocaleDateString()}</td>
                                        <td>{controlData.control_criterion}</td>
                                        <td
                                            ref={tooltipRef}
                                            data-bs-toggle="tooltip"
                                            className="text-truncate"
                                            style={{ maxWidth: "200px", cursor: "pointer" }}
                                            title={controlData.control_observation}
                                        >
                                            {controlData.control_observation.length > 30
                                                ? controlData.control_observation.slice(0, 30) + "..."
                                                : controlData.control_observation}
                                        </td>
                                        <td>{controlData.control_verification}</td>
                                        <td>
                                            <a
                                                href={controlData.control_evidence}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="btn btn-sm btn-primary"
                                            >
                                                Ver
                                            </a>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
