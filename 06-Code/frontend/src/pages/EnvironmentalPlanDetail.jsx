import React, { useState, useEffect, useMemo } from "react";
import { useParams, useLocation } from "react-router-dom";
import { usePlanActivities } from "../hooks/usePlanActivities";
import ActivityModal from "../components/ActivityModal";
import * as bootstrap from "bootstrap";
import { useNavigate } from 'react-router-dom';
import ControlModal from "../components/ControlModal";

export default function EnvironmentalPlanDetail() {
    const token = sessionStorage.getItem('token');
    const navigate = useNavigate();
    const { planId } = useParams();
    const location = useLocation();
    const plan = location.state?.plan;
    const [formError, setFormError] = useState(null);
    const [saving, setSaving] = useState(false);
    const [filterText, setFilterText] = useState("");
    const [sortConfig, setSortConfig] = useState({ key: null, direction: "asc" });
    const [showModal, setShowModal] = useState(false);
    const [editingActivity, setEditingActivity] = useState(null);
    const [showControlModal, setShowControlModal] = useState(false);

    const {
        activities,
        loading,
        error,
        createActivity,
        updateActivity,
        deleteActivity,
    } = usePlanActivities(planId, token);


    const [formData, setFormData] = useState({
        aspect: "",
        impact: "",
        measure: "",
        verification: "",
        frecuency: "",
    });

    const resetForm = () => ({
        aspect: "",
        impact: "",
        measure: "",
        verification: "",
        frecuency: "",
    });

    const openCreateModal = () => {
        setEditingActivity(null);
        setFormData(resetForm());
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

    useEffect(() => {
        const prevTooltips = bootstrap.Tooltip.getInstance(document.body);
        if (prevTooltips) prevTooltips.dispose();

        const tooltipTriggerList = document.querySelectorAll('[data-bs-toggle="tooltip"]');
        tooltipTriggerList.forEach((el) => {
            new bootstrap.Tooltip(el, { trigger: 'hover' });
        });

        return () => {
            tooltipTriggerList.forEach((el) => {
                const instance = bootstrap.Tooltip.getInstance(el);
                if (instance) instance.dispose();
            });
        };
    }, [activities]);


    const sortedFilteredActivities = useMemo(() => {
        if (!activities) return [];

        const text = filterText.toLowerCase();
        let filtered = activities.filter((act) =>
            act.activity_aspect.toLowerCase().includes(text) ||
            act.activity_impact.toLowerCase().includes(text) ||
            act.activity_measure.toLowerCase().includes(text) ||
            act.activity_frecuency.toLowerCase().includes(text)
        );

        if (sortConfig.key) {
            filtered.sort((a, b) => {
                let aValue = a[sortConfig.key];
                let bValue = b[sortConfig.key];

                if (sortConfig.key === "updatedat") {
                    aValue = new Date(aValue);
                    bValue = new Date(bValue);
                } else {
                    aValue = String(aValue).toLowerCase();
                    bValue = String(bValue).toLowerCase();
                }

                if (aValue < bValue) return sortConfig.direction === "asc" ? -1 : 1;
                if (aValue > bValue) return sortConfig.direction === "asc" ? 1 : -1;
                return 0;
            });
        }

        return filtered;
    }, [activities, filterText, sortConfig]);

    const requestSort = (key) => {
        let direction = "asc";
        if (sortConfig.key === key && sortConfig.direction === "asc") {
            direction = "desc";
        }
        setSortConfig({ key, direction });
    };

    const getSortIndicator = (key) => {
        if (sortConfig.key !== key) return <span className="text-muted ms-1">⇅</span>;
        return sortConfig.direction === "asc" ? (
            <span className="ms-1">▲</span>
        ) : (
            <span className="ms-1">▼</span>
        );
    };

    const openControlsModal = (activity) => {
        setEditingActivity(activity);
        setShowControlModal(true);
    }

    return (
        <div className="container mt-4 position-relative bg-light p-4">
            <div className="d-flex">
                <div className="col">
                    <h2 className="fw-bold text-dark">{plan?.environmentalplan_name}</h2>
                </div>
                <button className="btn btn-outline-danger px-4 py-2 rounded-pill shadow-sm" onClick={() => navigate(`/projects/${plan.project_id}`)}>
                    <i className="bi bi-arrow-left me-2"></i> Regresar
                </button>

            </div>

            {/* Filtro con icono lupa y tamaño pequeño */}
            <div className="input-group input-group-sm mb-3 mt-3" style={{ maxWidth: "300px" }}>
                <span className="input-group-text bg-white border-end-0" id="search-addon">
                    <i className="bi bi-search"></i>
                </span>
                <input
                    type="text"
                    className="form-control border-start-0"
                    placeholder="Filtrar actividades..."
                    aria-label="Filtrar actividades"
                    aria-describedby="search-addon"
                    value={filterText}
                    onChange={(e) => setFilterText(e.target.value)}
                />
            </div>

            <hr />
            <div className="d-flex">
                <div className="col">
                    <p>Para ordenar haga click en el nombre de la columna</p>
                </div>

                <div className="col text-end">
                    <button
                        className="btn button_hover"
                        onClick={openCreateModal}
                    >
                        <i className="bi bi-plus-circle"></i> Agregar Actividad
                    </button>
                </div>

            </div>

            <fieldset className="project_activities_container rounded shadow p-2 mt-3">
                {loading ? (
                    <p className="text-dark">Cargando actividades...</p>
                ) : error ? (
                    <p className="text-danger">
                        Error al cargar actividades: {error?.message || "Error desconocido"}
                    </p>
                ) : (
                    <div className="table-responsive">
                        <table className="table text-center table-striped rounded align-middle">
                            <thead className="table-dark">
                                <tr>
                                    {[
                                        { key: "activity_id", label: "Código" },
                                        { key: "activity_aspect", label: "Proceso / Actividad" },
                                        { key: "activity_impact", label: "Impacto Ambiental" },
                                        { key: "activity_measure", label: "Medidas" },
                                        { key: "activity_frecuency", label: "Frecuencia" },
                                        { key: "updatedat", label: "Actualización" },
                                    ].map(({ key, label }) => (
                                        <th
                                            key={key}
                                            onClick={() => requestSort(key)}
                                            style={{ cursor: "pointer", userSelect: "none" }}
                                            title={`Ordenar por ${label}`}
                                        >
                                            {label} {getSortIndicator(key)}
                                        </th>
                                    ))}
                                    <th>Acciones</th>
                                </tr>
                            </thead>
                            <tbody>
                                {sortedFilteredActivities.length === 0 && (
                                    <tr>
                                        <td colSpan="7" className="text-center text-muted">
                                            No se encontraron actividades.
                                        </td>
                                    </tr>
                                )}
                                {sortedFilteredActivities.map((act) => (
                                    <tr key={act.activity_id}>
                                        <td>P{planId}C{act.activity_id}</td>
                                        <td
                                            className="text-truncate"
                                            style={{ maxWidth: "150px" }}
                                            data-bs-toggle="tooltip"
                                            data-bs-placement="top"
                                            title={act.activity_aspect}
                                        >
                                            {act.activity_aspect}
                                        </td>
                                        <td
                                            className="text-truncate"
                                            style={{ maxWidth: "150px" }}
                                            data-bs-toggle="tooltip"
                                            data-bs-placement="top"
                                            title={act.activity_impact}
                                        >
                                            {act.activity_impact}
                                        </td>
                                        <td
                                            className="text-truncate"
                                            style={{ maxWidth: "150px" }}
                                            data-bs-toggle="tooltip"
                                            data-bs-placement="top"
                                            title={act.activity_measure}
                                        >
                                            {act.activity_measure}
                                        </td>
                                        <td>{act.activity_frecuency}</td>
                                        <td>{new Date(act.updatedat).toLocaleDateString()}</td>
                                        <td>
                                            <div className="d-flex justify-content-center">
                                                <button
                                                    className="btn bg-success-subtle btn-sm mx-2 icon-hover"
                                                    title="Controles"
                                                    onClick={() => openControlsModal(act)}
                                                >
                                                    <i className="bi bi-clipboard-check-fill me-2"></i> Controles
                                                </button>

                                                <i
                                                    className="bi bi-pencil-square mx-2 fs-3 icon-hover"
                                                    style={{ color: "blue", cursor: "pointer" }}
                                                    title="Editar"
                                                    onClick={() => openEditModal(act)}
                                                ></i>
                                                <i
                                                    className="bi bi-x-circle mx-2 fs-3 icon-hover"
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

            <ActivityModal
                show={showModal}
                onClose={() => setShowModal(false)}
                onSubmit={handleSubmit}
                formData={formData}
                handleChange={handleChange}
                formError={formError}
                saving={saving}
                title={editingActivity ? "Editar Actividad Ambiental" : "Nueva Actividad Ambiental"}
                submitLabel={editingActivity ? "Actualizar" : "Guardar"}
            />

            <ControlModal
                show={showControlModal}
                onClose={() => setShowControlModal(false)}
                token={token}
                activity={editingActivity}
            />

        </div>
    );
}
