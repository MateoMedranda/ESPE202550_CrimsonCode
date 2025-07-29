import React, { useState } from "react";
import EPController from "./hooks/EPManager";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";

export default function EnvironmentalPlansList({ projectId, token }) {
    const { environmentalPlan, loading, fetchPlans, insertPlan, deletePlan } = EPController(projectId, token);
    const today = new Date();
    const formattedDate = today.toISOString().split("T")[0];

    const [showAddModal, setShowAddModal] = useState(false);
    const [showUpdateModal, setShowUpdateModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [selectedPlan, setSelectedPlan] = useState(null);

    const [formData, setFormData] = useState({
        project_emp_name: "",
        project_emp_description: "",
        project_emp_stage: "",
        project_emp_process: "",
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleAddPlan = () => {
        setShowAddModal(true);
    };

    const handleOpenPlan = (id) => {
        console.log("Abrir detalles del plan", id);
    };

    const handleUpdatePlan = (plan) => {
        setSelectedPlan(plan);
        setShowUpdateModal(true);
    };

    const handleDeletePlan = (plan) => {
        setSelectedPlan(plan);
        setShowDeleteModal(true);
    };

    const handleSavePlan = async (e) => {
        e.preventDefault();
        try {
            await insertPlan({
                name: formData.project_emp_name,
                description: formData.project_emp_description,
                stage: formData.project_emp_stage,
                process: formData.project_emp_process,
            });
            setShowAddModal(false);
            setFormData({
                project_emp_name: "",
                project_emp_description: "",
                project_emp_stage: "",
                project_emp_process: "",
            });
            alert("✅ Plan agregado correctamente");
        } catch (error) {
            alert("❌ Error al agregar plan");
        }

    };

    const handleDeletePlanConfirm = async (planid) => {
        try{
            await deletePlan(planid);
            setShowDeleteModal(false);
            alert("✅ Plan eliminado correctamente");
        }catch(error) {
            alert("❌ Error al eliminar el plan");
        }
    }

    if (loading) return <h2>Cargando planes ambientales...</h2>;

    return (
        <div>
            {/* Encabezado */}
            <div className="d-flex">
                <div className="col">
                    <h3 className="title inter-title">Plan De Manejo Ambiental</h3>
                </div>
                <div className="col text-end">
                    <button
                        id="add_emp"
                        className="btn_add btn bg-info-subtle border-black"
                        onClick={handleAddPlan}
                    >
                        <i className="bi bi-plus-circle"></i> Agregar Plan
                    </button>
                </div>
            </div>
            <hr />

            {/* Si no hay planes */}
            {(!environmentalPlan || environmentalPlan.length === 0) ? (
                <div id="project_emp_content_div" className="row pt-4 pb-4">
                    <div className="col-12 text-center my-1 py-1">
                        <h1><i className="bi bi-stars"></i></h1>
                        <h1><i className="bi bi-bar-chart-steps"></i> Aun no hay planes de manejo aquí</h1>
                    </div>
                </div>
            ) : (
                <div
                    id="plan_content_div"
                    className="d-flex overflow-auto"
                    style={{ whiteSpace: "nowrap" }}
                >
                    {environmentalPlan.map((plan) => (
                        <div
                            key={plan.environmentalplan_id}
                            className="project_plan_card col-3 rounded m-4"
                            style={{ minWidth: "250px" }}
                        >
                            <div className="px-2 pt-2">
                                <div className="d-flex justify-content-between align-items-start">
                                    <div
                                        onClick={() => handleOpenPlan(plan.environmentalplan_id)}
                                        className="div_project_emp"
                                        style={{
                                            cursor: "pointer",
                                            whiteSpace: "normal",
                                            wordWrap: "break-word",
                                            maxWidth: "80%"
                                        }}
                                    >
                                        <h5 className="mb-0 title_project">{plan.environmentalplan_name}</h5>
                                    </div>
                                    <div className="dropdown">
                                        <div
                                            className="project_options rounded"
                                            data-bs-toggle="dropdown"
                                            aria-expanded="false"
                                            role="button"
                                        >
                                            <h2 className="mb-0"><i className="bi bi-list"></i></h2>
                                        </div>
                                        <ul className="dropdown-menu dropdown-menu-end shadow">
                                            <li>
                                                <button
                                                    className="dropdown-item"
                                                    onClick={() => handleUpdatePlan(plan)}
                                                >
                                                    Editar
                                                </button>
                                            </li>
                                            <li>
                                                <button
                                                    className="dropdown-item"
                                                    onClick={() => handleDeletePlan(plan)}
                                                >
                                                    Eliminar
                                                </button>
                                            </li>
                                            <li>
                                                <button
                                                    className="dropdown-item"
                                                    onClick={() => handleOpenPlan(plan.environmentalplan_id)}
                                                >
                                                    Ver detalles
                                                </button>
                                            </li>
                                        </ul>
                                    </div>
                                </div>
                                <hr />
                                <div className="plan_progress_container">
                                    <div className="plan_progress_bar" id="plan_progress_bar">
                                        0%
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Modal Agregar */}
            {showAddModal && (
                <div className="modal-overlay addEMP" onClick={() => setShowAddModal(false)}>
                    <div
                        className="modal-content bg-light rounded shadow p-3"
                        onClick={(e) => e.stopPropagation()}
                        style={{ minWidth: "400px", maxWidth: "90vw" }}
                    >
                        <form onSubmit={handleSavePlan}>
                            <input type="hidden" name="project_id_emp" value={projectId} />
                            <fieldset className="border p-2 bg-light border-0">
                                <h3 className="titulo">Nuevo Plan de Manejo Ambiental</h3>
                                <hr />
                                <div className="row px-4">
                                    <div className="col-3 px-2">
                                        <label className="mb-0">Nombre del Plan: *</label>
                                        <input
                                            name="project_emp_name"
                                            type="text"
                                            className="form-control mb-3 shadow"
                                            value={formData.project_emp_name}
                                            onChange={handleChange}
                                            required
                                        />
                                    </div>
                                    <div className="col-9 px-2">
                                        <label>Descripción: *</label>
                                        <input
                                            name="project_emp_description"
                                            type="text"
                                            className="form-control mb-3 shadow"
                                            value={formData.project_emp_description}
                                            onChange={handleChange}
                                            required
                                        />
                                    </div>
                                </div>
                                <div className="row px-4">
                                    <div className="col-3 px-2">
                                        <label className="mb-0">Etapa del Proyecto: *</label>
                                        <input
                                            name="project_emp_stage"
                                            type="text"
                                            className="form-control mb-3 shadow"
                                            value={formData.project_emp_stage}
                                            onChange={handleChange}
                                            required
                                        />
                                    </div>
                                    <div className="col-9 px-2">
                                        <label>Proceso: *</label>
                                        <input
                                            name="project_emp_process"
                                            type="text"
                                            className="form-control mb-3 shadow"
                                            value={formData.project_emp_process}
                                            onChange={handleChange}
                                            required
                                        />
                                    </div>
                                </div>
                                <hr />
                                <button type="submit" className="btn bg-success-subtle me-2">
                                    Guardar
                                </button>
                                <button
                                    type="button"
                                    className="btn bg-danger-subtle"
                                    onClick={() => setShowAddModal(false)}
                                >
                                    Cancelar
                                </button>
                            </fieldset>
                        </form>
                    </div>
                </div>
            )}

            {/* Modal Editar */}
            {showUpdateModal && (
                <div className="modal d-block bg-dark bg-opacity-50">
                    <div className="modal-dialog">
                        <div className="modal-content">
                            <div className="modal-header bg-warning">
                                <h5>Editar Plan</h5>
                                <button className="btn-close" onClick={() => setShowUpdateModal(false)}></button>
                            </div>
                            <div className="modal-body">
                                <form>
                                    <div className="mb-3">
                                        <label>Nombre</label>
                                        <input type="text" className="form-control" defaultValue={selectedPlan?.environmentalplan_name} />
                                    </div>
                                    <div className="mb-3">
                                        <label>Descripción</label>
                                        <input type="text" className="form-control" defaultValue={selectedPlan?.environmentalplan_description} />
                                    </div>
                                    <button className="btn btn-warning">Actualizar</button>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Modal Eliminar */}
            {showDeleteModal && (
                <div className="modal d-block bg-dark bg-opacity-50">
                    <div className="modal-dialog">
                        <div className="modal-content">
                            <div className="modal-header bg-danger text-white">
                                <h5>¿Eliminar Plan?</h5>
                                <button className="btn-close" onClick={() => setShowDeleteModal(false)}></button>
                            </div>
                            <div className="modal-body">
                                ¿Estás seguro de eliminar el plan <strong>{selectedPlan?.environmentalplan_name}</strong>?
                            </div>
                            <div className="modal-footer">
                                <button className="btn btn-secondary" onClick={() => setShowDeleteModal(false)}>Cancelar</button>
                                <button className="btn btn-danger" onClick={() => handleDeletePlanConfirm(selectedPlan.environmentalplan_id)}>Eliminar</button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
