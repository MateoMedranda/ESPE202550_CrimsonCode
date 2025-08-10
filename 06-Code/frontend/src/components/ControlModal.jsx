import React, { useState, useEffect, useRef } from "react";
import { Tooltip } from "bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import "../css/ControlModal.css";
import { useActivitiesControls } from "../hooks/useActivitiesControl";

function ControlModal({ show, onClose, token, activity }) {
    const [showForm, setShowForm] = useState(false);
    const tooltipRef = useRef(null);

    const activityId = activity?.activity_id;

    const {
        controls,
        loading,
        error,
        createControl,
        updateControl,
        deleteControl,
    } = useActivitiesControls(activityId, token);


    useEffect(() => {
        let tooltipInstances = [];

        if (show) {
            const tooltipElements = document.querySelectorAll('[data-bs-toggle="tooltip"]');
            tooltipInstances = [...tooltipElements].map(
                (el) => new Tooltip(el)
            );
        }

        return () => {
            tooltipInstances.forEach((instance) => instance.dispose());
        };
    }, [show, controls]);


    if (!show) return null;

    const handleContentClick = (e) => e.stopPropagation();

    return (
        <div className="modal fade show d-block" tabIndex="-1" role="dialog">
            <div className="modal-backdrop fade show" onClick={onClose}></div>

            <div className="modal-dialog modal-xl modal-dialog-centered" role="document" style={{ zIndex: 1055 }}>
                <div className="modal-content rounded-4 shadow-lg border-0 overflow-hidden" onClick={handleContentClick}>

                    <div className="modal-header bg-info-subtle text-dark py-3">
                        <h3 className="mb-0">
                            <i className="bi bi-graph-up-arrow me-2"></i> Seguimiento de cumplimiento
                        </h3>
                        <button type="button" className="btn-close btn-close-dark" onClick={onClose}></button>
                    </div>

                    {/* Botón */}
                    <div className="px-4 pt-3">
                        <button
                            className="btn btn-outline-primary mb-3"
                            onClick={() => setShowForm(!showForm)}
                        >
                            <i className="bi bi-plus-circle me-2"></i>
                            {showForm ? "Cerrar formulario" : "Agregar nuevo control"}
                        </button>

                        {/* Cajón animado */}
                        <div className={`drawer-container ${showForm ? "open" : ""}`}>
                            <div className="card card-body mb-4 shadow-sm border-0">
                                <form id="register_control">
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
                                            <button
                                                type="button"
                                                className="btn btn-outline-danger px-4 shadow-sm"
                                                onClick={() => setShowForm(false)}
                                            >
                                                <i className="bi bi-x-circle me-2"></i> Cancelar
                                            </button>
                                        </div>
                                    </fieldset>
                                </form>
                            </div>
                        </div>
                    </div>

                    {/* Seguimiento */}
                    <div className="bg-light px-4 pb-4">
                        <hr />
                        {loading ? (
                            <div className="text-center py-4">
                                <div className="spinner-border text-primary" role="status">
                                    <span className="visually-hidden">Cargando controles...</span>
                                </div>
                            </div>
                        ) : error ? (

                            <p className="text-danger">
                                Error al cargar controles: {error?.message || "Error desconocido"}
                            </p>
                        ) : (
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
                                    <tbody id="controlsTable">
                                        {controls.length > 0 ? (
                                            controls.map((control) => (
                                                <tr key={control.control_id}>
                                                    <td>{control.control_id}</td>
                                                    <td>{control.control_createdby}</td>
                                                    <td>{new Date(control.updatedat).toLocaleDateString()}</td>
                                                    <td>{control.control_criterion}</td>
                                                    <td
                                                        data-bs-toggle="tooltip"
                                                        className="text-truncate"
                                                        style={{ maxWidth: "200px", cursor: "pointer" }}
                                                        title={control.control_observation}
                                                    >
                                                        {control.control_observation.length > 30
                                                            ? control.control_observation.slice(0, 30) + "..."
                                                            : control.control_observation}
                                                    </td>
                                                    <td>{control.control_verification}</td>
                                                    <td>
                                                        <a
                                                            href={control.control_evidence}
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                            className="btn btn-sm btn-primary"
                                                        >
                                                            Ver
                                                        </a>
                                                    </td>
                                                </tr>
                                            ))
                                        ) : (
                                            <tr>
                                                <td colSpan="7" className="text-center text-muted">
                                                    No hay controles registrados
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ControlModal;