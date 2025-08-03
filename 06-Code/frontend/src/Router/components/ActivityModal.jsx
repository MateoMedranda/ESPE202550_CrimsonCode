import React from "react";

const ActivityModal = ({
    show,
    onClose,
    onSubmit,
    formData,
    handleChange,
    formError,
    saving,
    title,
    submitLabel
}) => {
    if (!show) return null;

    return (
        <div className="modal d-block bg-dark bg-opacity-50" onClick={onClose}>
            <div className="modal-dialog modal-lg" onClick={(e) => e.stopPropagation()}>
                <div className="modal-content">
                    <div className={`modal-header ${title.includes("Editar") ? "bg-warning" : "bg-success-subtle"}`}>
                        <h5>{title}</h5>
                        <button className="btn-close" onClick={onClose}></button>
                    </div>
                    <div className="modal-body">
                        {formError && (
                            <p className="text-danger fw-bold">{formError}</p>
                        )}

                        <form
                            onSubmit={(e) => {
                                e.preventDefault();
                                onSubmit(e);
                            }}
                        >
                            <div className="mb-3">
                                <label>Proceso / Actividad *</label>
                                <input
                                    type="text"
                                    name="aspect"
                                    className="form-control"
                                    value={formData.aspect}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                            <div className="mb-3">
                                <label>Impacto Ambiental *</label>
                                <input
                                    type="text"
                                    name="impact"
                                    className="form-control"
                                    value={formData.impact}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                            <div className="mb-3">
                                <label>Medidas *</label>
                                <input
                                    type="text"
                                    name="measure"
                                    className="form-control"
                                    value={formData.measure}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                            <div className="mb-3">
                                <label>Verificación *</label>
                                <input
                                    type="text"
                                    name="verification"
                                    className="form-control"
                                    value={formData.verification}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                            <div className="mb-3">
                                <label>Frecuencia *</label>
                                <select
                                    name="frecuency"
                                    className="form-select"
                                    value={formData.frecuency}
                                    onChange={handleChange}
                                    required
                                >
                                    <option value="">Seleccione</option>
                                    <option value="Anual">Anual</option>
                                    <option value="Mensual">Mensual</option>
                                    <option value="Permanente">Permanente</option>
                                    <option value="No aplica">No aplica</option>
                                </select>
                            </div>

                            <div className="d-flex justify-content-end">
                                <button
                                    type="button"
                                    className="btn btn-secondary me-2"
                                    onClick={onClose}
                                    disabled={saving}
                                >
                                    Cancelar
                                </button>
                                <button
                                    type="submit"
                                    className={`btn ${title.includes("Editar") ? "btn-warning" : "btn-success"}`}
                                    disabled={saving}
                                >
                                    {saving ? "Guardando..." : submitLabel}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ActivityModal;
