import React from "react";
import { useParams, useLocation } from "react-router-dom";
import { usePlanActivities } from "./hooks/usePlanActivities"; // Ajusta el path si es necesario

export default function EnvironmentalPlanDetail({ token }) {
    const { planId } = useParams();
    const location = useLocation();
    const plan = location.state?.plan;

    const { activities, loading, error } = usePlanActivities(planId, token);

    return (
        <div className="container mt-4">
            <div className="d-flex">
                <div className="col">
                    <h2 style={{ color: "white" }}>{plan?.environmentalplan_name}</h2>
                </div>
                <div className="col text-end">
                    <button className="btn bg-info-subtle border-black">
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
                                            <div className="d-flex">
                                                <button className="btn bg-success-subtle btn-sm mx-2">
                                                    <i className="bi bi-clipboard-check-fill me-2"></i> Controles
                                                </button>
                                                <i className="bi bi-pencil-square mx-2" style={{ color: "blue", cursor: "pointer" }}></i>
                                                <i className="bi bi-x-circle mx-2" style={{ color: "red", cursor: "pointer" }}></i>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </fieldset>
        </div>
    );
}
