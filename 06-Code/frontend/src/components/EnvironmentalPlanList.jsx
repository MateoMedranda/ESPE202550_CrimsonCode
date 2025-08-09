import React, { useState, useEffect } from "react";
import EPController from "../hooks/EPManager";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import { useNavigate } from "react-router-dom";
import PlanModal from "./PlanModal";
import ConfirmDeleteModal from "./ConfirmDeleteModal";
import ActionDropdown from "./ActionDropDown";

export default function EnvironmentalPlansList({ projectId, token }) {
    const navigate = useNavigate();
    const { environmentalPlan, loading, insertPlan, deletePlan, updatePlan } = EPController(projectId, token);

    const [showAddModal, setShowAddModal] = useState(false);
    const [showUpdateModal, setShowUpdateModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [selectedPlan, setSelectedPlan] = useState(null);
    const [progressData, setProgressData] = useState({}); 

    const [formData, setFormData] = useState({
        project_emp_name: "",
        project_emp_description: "",
        project_emp_stage: "",
        project_emp_process: "",
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleAddPlan = () => setShowAddModal(true);

    const handleOpenPlan = (plan) => {
        navigate(`/projects/${projectId}/plans/${plan.environmentalplan_id}`, {
            state: { plan }
        });
    };

    const handleUpdatePlan = (plan) => {
        setSelectedPlan(plan);
        setFormData({
            project_emp_name: plan.environmentalplan_name,
            project_emp_stage: plan.environmentalplan_stage,
            project_emp_description: plan.environmentalplan_description,
            project_emp_process: plan.environmentalplan_process,
        });
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
        } catch {
            alert("❌ Error al agregar plan");
        }
    };

    const handleDeletePlanConfirm = async (planid) => {
        try {
            await deletePlan(planid);
            setShowDeleteModal(false);
            alert("✅ Plan eliminado correctamente");
        } catch {
            alert("❌ Error al eliminar el plan");
        }
    };

    const handleUpdatePlanConfirm = async (planid) => {
        try {
            await updatePlan(planid, {
                name: formData.project_emp_name,
                description: formData.project_emp_description,
                stage: formData.project_emp_stage,
                process: formData.project_emp_process,
            });
            setShowUpdateModal(false);
            setFormData({
                project_emp_name: "",
                project_emp_description: "",
                project_emp_stage: "",
                project_emp_process: "",
            });
            alert("✅ Plan actualizado correctamente");
        } catch {
            alert("❌ Error al actualizar el plan");
        }
    };

    const getPercentageOfPlan = async (plan_id) => {
        const headers = {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`,
        };

        try {
            const response = await fetch(
                `https://sima-es01.onrender.com/environmental-plans/${plan_id}/compliance`,
                { method: "GET", headers }
            );

            if (!response.ok) throw new Error(`Error HTTP: ${response.status}`);

            const result = await response.json();
            return result.percentageSatisfy ?? 0;
        } catch (error) {
            console.error(`Error obteniendo el porcentaje completado`, error);
            return 0;
        }
    };

    useEffect(() => {
        if (!environmentalPlan || environmentalPlan.length === 0) return;

        const fetchAllProgress = async () => {
            const progressMap = {};
            for (const plan of environmentalPlan) {
                const percentage = await getPercentageOfPlan(plan.environmentalplan_id);
                progressMap[plan.environmentalplan_id] = percentage;
            }
            setProgressData(progressMap);
        };

        fetchAllProgress();
    }, [environmentalPlan]);

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
                        className="btn_add btn button_hover"
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
                <div id="plan_content_div" className="d-flex overflow-auto" style={{ whiteSpace: "nowrap" }}>
                    {environmentalPlan.map((plan) => {
                        const percentage = progressData[plan.environmentalplan_id] || 0;
                        return (
                            <div
                                key={plan.environmentalplan_id}
                                className="project_plan_card col-3 rounded m-4"
                                style={{ minWidth: "250px", cursor: "pointer" }}
                                onClick={() => handleOpenPlan(plan)}
                            >
                                <div className="px-2 pt-2">
                                    <div className="d-flex justify-content-between align-items-start">
                                        <div
                                            className="div_project_emp"
                                            style={{
                                                whiteSpace: "normal",
                                                wordWrap: "break-word",
                                                maxWidth: "80%"
                                            }}
                                        >
                                            <h5 className="mb-0 title_project">{plan.environmentalplan_name}</h5>
                                        </div>
                                        <div onClick={(e) => e.stopPropagation()}>
                                            <ActionDropdown
                                                onEdit={() => handleUpdatePlan(plan)}
                                                onDelete={() => handleDeletePlan(plan)}
                                                onView={() => handleOpenPlan(plan)}
                                            />
                                        </div>
                                    </div>
                                    <hr />
                                    <div className="plan_progress_container">
                                        <div
                                            className="plan_progress_bar"
                                            style={{ width: `${percentage}%` }}
                                        >
                                            <p className="ms-3">{percentage}%</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}

            {/* Modals */}
            <PlanModal
                show={showAddModal}
                onClose={() => setShowAddModal(false)}
                onSubmit={handleSavePlan}
                formData={formData}
                handleChange={handleChange}
                title="Nuevo Plan de Manejo Ambiental"
                submitLabel="Guardar"
            />

            <PlanModal
                show={showUpdateModal}
                onClose={() => setShowUpdateModal(false)}
                onSubmit={() => handleUpdatePlanConfirm(selectedPlan.environmentalplan_id)}
                formData={formData}
                handleChange={handleChange}
                title="Editar Plan"
                submitLabel="Actualizar"
            />

            <ConfirmDeleteModal
                show={showDeleteModal}
                onClose={() => setShowDeleteModal(false)}
                onConfirm={() => handleDeletePlanConfirm(selectedPlan.environmentalplan_id)}
                entityName="plan"
                entityLabel={`el plan "${selectedPlan?.environmentalplan_name}"`}
            />
        </div>
    );
}
