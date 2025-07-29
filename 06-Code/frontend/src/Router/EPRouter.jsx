import React from "react";
import EPController from "./hooks/EPManager";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";

export default function EnvironmentalPlansList({ projectId, token }) {
    const { environmentalPlan, loading } = EPController(projectId, token);

    const handleAddPlan = () => {
        console.log("Agregar Plan");
    };

    const handleOpenPlan = (id) => {
        console.log("Abrir detalles del plan", id);
    };

    const handleUpdatePlan = (projectId, id) => {
        console.log("Actualizar plan", projectId, id);
    };

    const handleDeletePlan = (id) => {
        console.log("Eliminar plan", id);
    };

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
                                                    onClick={() => handleUpdatePlan(projectId, plan.environmentalplan_id)}
                                                >
                                                    Editar
                                                </button>
                                            </li>
                                            <li>
                                                <button
                                                    className="dropdown-item"
                                                    onClick={() => handleDeletePlan(plan.environmentalplan_id)}
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
        </div>

    );
}