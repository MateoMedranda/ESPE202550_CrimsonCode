import React from "react";
import { useParams, useLocation } from "react-router-dom";

export default function EnvironmentalPlanDetail({ token }) {
    const { planId } = useParams();
    const location = useLocation();
    const plan = location.state?.plan;

    console.log(plan);

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
                        <tbody id="table-body">
                            <tr className="align-middle">
                                <td>P1C1</td>
                                <td>Construcción de tomas</td>
                                <td>Degradación ambiental</td>
                                <td>Mantener cumplimiento del PMA</td>
                                <td>Permanente</td>
                                <td>19-05-2025</td>
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
                        </tbody>
                    </table>
                </div>
            </fieldset>
        </div>
    );
}
