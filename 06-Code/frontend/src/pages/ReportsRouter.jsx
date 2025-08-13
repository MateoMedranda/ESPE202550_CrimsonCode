import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  PieChart, Pie, Cell, Tooltip as RechartsTooltip, Legend,
  BarChart, Bar, XAxis, YAxis, CartesianGrid,
  LineChart, Line
} from "recharts";
import { useAuth } from "../Context/AuthContext";

function EnvironmentalCharts() {
  const [projects, setProjects] = useState([]);
  const [plans, setPlans] = useState([]);
  const [selectedProject, setSelectedProject] = useState("");
  const [selectedPlan, setSelectedPlan] = useState("");
  const [loading, setLoading] = useState(true);
  const {token} = useAuth();
  const [compliance, setCompliance] = useState(null);
  const [pending, setPending] = useState(null);
  const [reportByDate, setReportByDate] = useState([]);
  const [evaluationStatus, setEvaluationStatus] = useState(null);

  const baseUrl = "https://sima-es01.onrender.com";

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        setLoading(true);
        const headers = { Authorization: `Bearer ${token}` };
        const res = await axios.get(`${baseUrl}/projects/`, { headers });
        setProjects(res.data);
        setLoading(false);
      } catch (error) {
        console.error("Error al cargar proyectos:", error);
      }
    };
    fetchProjects();
  }, []);

  useEffect(() => {
    const fetchPlans = async () => {
      if (!selectedProject) {
        setPlans([]);
        setSelectedPlan("");
        return;
      }
      try {
        const headers = { Authorization: `Bearer ${token}` };
        const res = await axios.get(`${baseUrl}/projects/${selectedProject}/environmental-plans`, { headers });
        setPlans(res.data);
      } catch (error) {
        console.error("Error al cargar planes:", error);
      }
    };
    fetchPlans();
  }, [selectedProject]);

  useEffect(() => {
    const fetchData = async () => {
      if (!selectedPlan) return;
      try {
        setLoading(true);
        const headers = { Authorization: `Bearer ${token}` };

        const [resCompliance, resPending, resReport, resEvalStatus] = await Promise.all([
          axios.get(`${baseUrl}/environmental-plans/${selectedPlan}/compliance/`, { headers }),
          axios.get(`${baseUrl}/environmental-plans/${selectedPlan}/pending/`, { headers }),
          axios.get(`${baseUrl}/environmental-plans/${selectedPlan}/reports/controls?from=2025-01-01&to=2025-12-31`, { headers }),
          axios.get(`${baseUrl}/environmental-plans/${selectedPlan}/reportPrueba`, { headers }),
        ]);

        console.log(resCompliance.data);

        setCompliance(resCompliance.data);
        setPending(resPending.data);
        setReportByDate(resReport.data.data);
        setEvaluationStatus(resEvalStatus.data);
        setLoading(false);
      } catch (error) {
        console.error("Error al cargar datos del plan:", error);
      }
    };
    fetchData();
  }, [selectedPlan]);

  const COLORS = ["#0088FE", "#FF8042", "#00C49F", "#FFBB28"];

  if (loading) return (
    <div className="text-center py-4 bg-light my-4 w-75 m-auto rounded shadow">
      <h2>Cargando Datos..</h2>
      <div className="spinner-border text-success-emphasis fs-6" role="status">
      </div>
    </div>
  );

  return (
    <div className="p-4 w-100">
      <div className="flex gap-4 mb-6 m-auto w-100 bg-white rounded shadow p-4">
        <label>Proyecto: </label>
        <select
          value={selectedProject}
          onChange={(e) => setSelectedProject(e.target.value)}
          className="border rounded p-2 mx-4"
        >
          <option value="">Seleccione Proyecto</option>
          {projects.map((proj) => (
            <option key={proj.project_id} value={proj.project_id}>
              {proj.project_name}
            </option>
          ))}
        </select>

        <label>Plan Ambiental: </label>
        <select
          value={selectedPlan}
          onChange={(e) => setSelectedPlan(e.target.value)}
          className="border rounded p-2 mx-4"
          disabled={!selectedProject}
        >
          <option value="">Seleccione Plan Ambiental</option>
          {plans.map((plan) => (
            <option key={plan.environmentalplan_id} value={plan.environmentalplan_id}>
              {plan.environmentalplan_name}
            </option>
          ))}
        </select>
      </div>

      {selectedPlan && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-4 w-100 m-auto">
          <div className="bg-white p-4 rounded p-4 shadow m-auto mb-5">
            <h3 className="text-lg font-bold mb-3">Reporte de Actividades</h3>
            <hr></hr>
            {compliance && (
              <div className="d-flex flex-column flex-md-row align-items-center justify-content-center gap-3">
                <div className="me-3 col align-items-center align-content-center text-center gap-5" >
                  <h2
                    style={{
                      fontWeight: "600",
                      fontSize: "1.25rem",
                      color: "#333",
                      margin: 0,
                      userSelect: "none",
                    }}
                  >
                    Porcentaje Cumple
                  </h2>
                  <br></br>

                  <div className="m-auto"
                    style={{
                      width: 200,
                      height: 200,
                      borderRadius: "50%",
                      backgroundColor: "#28a745",
                      border: "5px solid #1e7e34",
                      color: "white",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontWeight: "700",
                      fontSize: "2rem",
                      boxShadow: "0 4px 10px rgba(40, 167, 69, 0.4)",
                      userSelect: "none",
                    }}
                  >
                    {compliance.percentageSatisfy} %
                  </div>
                </div>

                <div className="" style={{ minWidth: 0, maxWidth: "100%" }}>
                  <BarChart
                    width={900}
                    height={400}
                    data={[
                      { name: "Actividades del PMA", value: compliance.totalActivities },
                      { name: "Actividades Evaluadas", value: compliance.activitiesEvaluated },
                      { name: "Actividades que cumplen el PMA", value: compliance.activitiesSatisfy },
                      { name: "Actividades que no cumplen el PMA", value: compliance.activitiesNoSatisfy },
                      { name: "Actividades que no aplica su análisis", value: compliance.activitiesNotApply },
                    ]}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis
                      dataKey="name"
                      interval={0}
                      tick={({ x, y, payload }) => {
                        const words = payload.value.split(" ");
                        const mid = Math.ceil(words.length / 2);
                        const firstLine = words.slice(0, mid).join(" ");
                        const secondLine = words.slice(mid).join(" ");
                        return (
                          <text x={x} y={y + 10} textAnchor="middle" fontSize={12}>
                            <tspan x={x} dy={0}>
                              {firstLine}
                            </tspan>
                            {secondLine && <tspan x={x} dy={15}>{secondLine}</tspan>}
                          </text>
                        );
                      }}
                    />
                    <YAxis domain={[0, (dataMax) => dataMax + 5]} />
                    <RechartsTooltip />
                    <Bar dataKey="value">
                      <Cell fill="#956CF5" />
                      <Cell fill="#6CF5DC" />
                      <Cell fill="#66E36E" />
                      <Cell fill="#E36666" />
                    </Bar>
                  </BarChart>
                </div>
              </div>
            )}

          </div>

          <div className="bg-white shadow p-4 rounded mb-5">
            <h3 className="text-lg font-bold mb-2">Actividades Pendientes</h3>
            <hr></hr>
            <div className="table-responsive">
              <table className="table table-striped table-hover align-middle">
                <thead className="table-dark">
                  <tr>
                    <th>ID</th>
                    <th>Medida de Actividad</th>
                    <th>Frecuencia</th>
                    <th>Último Control</th>
                    <th>Días desde último control</th>
                  </tr>
                </thead>
                <tbody>
                  {pending && pending.details && pending.details.length > 0 ? (
                    pending.details.map(({ activity_id, activity_measure, activity_frecuency, lastControlDate, daysSinceLastControl }) => (
                      <tr key={activity_id}>
                        <td>{"P"+selectedPlan +"C"+activity_id}</td>
                        <td
                          style={{
                            maxWidth: 400,
                            whiteSpace: "nowrap",
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            cursor: "default",
                            maxHeight: "1.5rem", 
                          }}
                          title={activity_measure} 
                        >
                          {activity_measure}
                        </td>
                        <td>{activity_frecuency}</td>
                        <td>{lastControlDate}</td>
                        <td>{daysSinceLastControl}</td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="5" className="text-center">
                        No hay actividades pendientes
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

        </div>
      )}
    </div>
  );
}

export default EnvironmentalCharts;