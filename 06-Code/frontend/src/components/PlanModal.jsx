import React from "react";

const PlanModal = ({ show, onClose, onSubmit, formData, handleChange, title, submitLabel }) => {
    if (!show) return null;

    return (
        <div className="modal d-block bg-dark bg-opacity-50" onClick={onClose}>
            <div className="modal-dialog" onClick={(e) => e.stopPropagation()}>
                <div className="modal-content">
                    <div className={`modal-header ${title.includes("Editar") ? "bg-warning" : "bg-success-subtle"}`}>
                        <h5>{title}</h5>
                        <button className="btn-close" onClick={onClose}></button>
                    </div>
                    <div className="modal-body">
                        <form
                            onSubmit={(e) => {
                                e.preventDefault();
                                onSubmit();
                            }}
                        >
                            <div className="mb-3">
                                <label>Nombre del Plan *</label>
                                <input
                                    type="text"
                                    name="project_emp_name"
                                    className="form-control"
                                    value={formData.project_emp_name}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                            <div className="mb-3">
                                <label>Etapa del Proyecto *</label>
                                <input
                                    type="text"
                                    name="project_emp_stage"
                                    className="form-control"
                                    value={formData.project_emp_stage}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                            <div className="mb-3">
                                <label>Descripción *</label>
                                <textarea
                                    className="form-control"
                                    name="project_emp_description"
                                    value={formData.project_emp_description}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                            <div className="mb-3">
                                <label>Proceso *</label>
                                <textarea
                                    className="form-control"
                                    name="project_emp_process"
                                    value={formData.project_emp_process}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                            <div className="d-flex justify-content-end">
                                <button type="button" className="btn btn-secondary me-2" onClick={onClose}>
                                    Cancelar
                                </button>
                                <button type="submit" className={`btn ${title.includes("Editar") ? "btn-warning" : "btn-success"}`}>
                                    {submitLabel}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PlanModal;