import React, { useState } from "react";
import { useParams, useLocation } from "react-router-dom";
import { usePlanActivities } from "./hooks/usePlanActivities";

export default function EnvironmentalPlanDetail({ token }) {
    const { planId } = useParams();
    const location = useLocation();
    const plan = location.state?.plan;

    const {
        activities,
        loading,
        error,
        createActivity,
        updateActivity,
        deleteActivity,
    } = usePlanActivities(planId, token);

    const [showModal, setShowModal] = useState(false);
    const [editingActivity, setEditingActivity] = useState(null); 

    const [formData, setFormData] = useState({
        aspect: "",
        impact: "",
        measure: "",
        verification: "",
        frecuency: "",
    });

    const [formError, setFormError] = useState(null);
    const [saving, setSaving] = useState(false);

    const openCreateModal = () => {
        setEditingActivity(null);
        setFormData({
            aspect: "",
            impact: "",
            measure: "",
            verification: "",
            frecuency: "",
        });
        setFormError(null);
        setShowModal(true);
    };

    const openEditModal = (activity) => {
        setEditingActivity(activity);
        setFormData({
            aspect: activity.activity_aspect || "",
            impact: activity.activity_impact || "",
            measure: activity.activity_measure || "",
            verification: activity.activity_verification || "",
            frecuency: activity.activity_frecuency || "",
        });
        setFormError(null);
        setShowModal(true);
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setFormError(null);

        const { aspect, impact, measure, verification, frecuency } = formData;
        if (!aspect || !impact || !measure || !verification || !frecuency) {
            setFormError("Por favor, complete todos los campos requeridos.");
            return;
        }

        try {
            setSaving(true);
            if (editingActivity) {
                await updateActivity(editingActivity.activity_id, formData);
            } else {
                console.log(formData);
                await createActivity(formData);
            }
            setShowModal(false);
        } catch (err) {
            setFormError(err.response?.data?.message || "Error al guardar la actividad.");
        } finally {
            setSaving(false);
        }
    };

    const handleDelete = async (activityId) => {
        if (window.confirm("¿Seguro que quieres eliminar esta actividad?")) {
            try {
                await deleteActivity(activityId);
            } catch (err) {
                alert(err.response?.data?.message || "Error al eliminar la actividad.");
            }
        }
    };

    return (
        <div className="container mt-4 position-relative">
            <div className="d-flex">
                <div className="col">
                    <h2 style={{ color: "white" }}>{plan?.environmentalplan_name}</h2>
                </div>
                <div className="col text-end">
                    <button
                        className="btn bg-info-subtle border-black"
                        onClick={openCreateModal}
                    >
                        <i className="bi bi-plus-circle"></i> Agregar Actividad
                    </button>
                </div>
            </div>

            <fieldset className="project_activities_container rounded shadow p-2">
                <hr />
                {loading ? (
                    <p className="text-white">Cargando actividades...</p>
                ) : error ? (
                    <p className="text-danger">Error al cargar actividades: {error.message}</p>
                ) : (
                    <div className="table-responsive">
                        <table className="table text-center table-striped rounded">
                            <thead>
                                <tr>
                                    <th>Código</th>
                                    <th>Proceso / Actividad</th>
                                    <th>Impacto Ambiental</th>
                                    <th>Medidas</th>
                                    <th>Frecuencia</th>
                                    <th>Actualización</th>
                                    <th></th>
                                </tr>
                            </thead>
                            <tbody>
                                {activities.map((act) => (
                                    <tr key={act.activity_id} className="align-middle">
                                        <td>P{planId}C{act.activity_id}</td>
                                        <td>{act.activity_aspect}</td>
                                        <td>{act.activity_impact}</td>
                                        <td>{act.activity_measure}</td>
                                        <td>{act.activity_frecuency}</td>
                                        <td>{new Date(act.updatedat).toLocaleDateString()}</td>
                                        <td>
                                            <div className="d-flex justify-content-center">
                                                <button
                                                    className="btn bg-success-subtle btn-sm mx-2"
                                                    title="Controles"
                                                >
                                                    <i className="bi bi-clipboard-check-fill me-2"></i> Controles
                                                </button>
                                                <i
                                                    className="bi bi-pencil-square mx-2"
                                                    style={{ color: "blue", cursor: "pointer" }}
                                                    title="Editar"
                                                    onClick={() => openEditModal(act)}
                                                ></i>
                                                <i
                                                    className="bi bi-x-circle mx-2"
                                                    style={{ color: "red", cursor: "pointer" }}
                                                    title="Eliminar"
                                                    onClick={() => handleDelete(act.activity_id)}
                                                ></i>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </fieldset>

            {/* Modal (crear/editar) */}
            {showModal && (
                <>
                    {/* Overlay */}
                    <div
                        style={{
                            position: "fixed",
                            top: 0,
                            left: 0,
                            width: "100vw",
                            height: "100vh",
                            backgroundColor: "rgba(0,0,0,0.5)",
                            zIndex: 1000,
                        }}
                        onClick={() => setShowModal(false)}
                    ></div>

                    {/* Modal */}
                    <div
                        style={{
                            position: "fixed",
                            top: "50%",
                            left: "50%",
                            transform: "translate(-50%, -50%)",
                            backgroundColor: "white",
                            borderRadius: "8px",
                            padding: "1.5rem",
                            boxShadow: "0 2px 10px rgba(0,0,0,0.3)",
                            zIndex: 1001,
                            maxWidth: "600px",
                            width: "90%",
                            maxHeight: "90vh",
                            overflowY: "auto",
                        }}
                        onClick={(e) => e.stopPropagation()}
                    >
                        <form onSubmit={handleSubmit}>
                            <h3>{editingActivity ? "Editar Actividad Ambiental" : "Nueva Actividad Ambiental"}</h3>
                            <hr />

                            {formError && (
                                <p className="text-danger" style={{ fontWeight: "bold" }}>
                                    {formError}
                                </p>
                            )}

                            <div className="mb-3">
                                <label className="form-label">Proceso / Actividad *</label>
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
                                <label className="form-label">Impacto Ambiental *</label>
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
                                <label className="form-label">Medidas *</label>
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
                                <label className="form-label">Verificación *</label>
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
                                <label className="form-label">Frecuencia *</label>
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

                            <div className="text-end">
                                <button
                                    type="button"
                                    className="btn btn-secondary me-2"
                                    onClick={() => setShowModal(false)}
                                    disabled={saving}
                                >
                                    Cancelar
                                </button>
                                <button type="submit" className="btn btn-primary" disabled={saving}>
                                    {saving ? "Guardando..." : "Guardar"}
                                </button>
                            </div>
                        </form>
                    </div>
                </>
            )}
        </div>
    );
}
