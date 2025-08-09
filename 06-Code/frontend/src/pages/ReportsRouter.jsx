import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  PieChart, Pie, Cell, Tooltip as RechartsTooltip, Legend,
  BarChart, Bar, XAxis, YAxis, CartesianGrid,
  LineChart, Line
} from "recharts";

function EnvironmentalCharts() {
  const [projects, setProjects] = useState([]);
  const [plans, setPlans] = useState([]);
  const [selectedProject, setSelectedProject] = useState("");
  const [selectedPlan, setSelectedPlan] = useState("");
  const [loading, setLoading] = useState(true);

  const [compliance, setCompliance] = useState(null);
  const [pending, setPending] = useState(null);
  const [reportByDate, setReportByDate] = useState([]);
  const [evaluationStatus, setEvaluationStatus] = useState(null);

  const baseUrl = "https://sima-es01.onrender.com";

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        setLoading(true);
        const headers = { Authorization: `Bearer ${sessionStorage.getItem('token')}` };
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
        const headers = { Authorization: `Bearer ${sessionStorage.getItem('token')}` };
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
        const headers = { Authorization: `Bearer ${sessionStorage.getItem('token')}` };

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
    <div className="p-4">
      <div className="flex gap-4 mb-6 m-auto w-75 bg-white rounded shadow p-4">
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
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-4 w-75 m-auto">
          <div className="bg-white p-4 rounded p-4 shadow m-auto mb-4">
            <h3 className="text-lg font-bold mb-3">Reporte de Actividades</h3>
            <hr></hr>
            {compliance && (
              <div className="d-flex justify-content-center">
                <BarChart
                  width={1100}
                  height={300}
                  data={[
                    { name: "Actividades del PMA", value: compliance.totalActivities },
                    { name: "Actividades Evaluadas", value: compliance.activitiesEvaluated },
                    { name: "Actividades que -cumplen el PMA", value: compliance.activitiesSatisfy },
                    { name: "Actividades que no -cumplen el PMA", value: compliance.activitiesNoSatisfy },
                    { name: "Actividades que no -aplica su -análisis", value: compliance.activitiesNotApply }
                  ]}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis
                    dataKey="name"
                    tick={({ x, y, payload }) => {
                      const words = payload.value.split("-");
                      return (
                        <text x={x} y={y + 10} textAnchor="middle">
                          {words.map((word, index) => (
                            <tspan key={index} x={x} dy={index === 0 ? 0 : 15}>
                              {word}
                            </tspan>
                          ))}
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
            )}
          </div>

          <div className="bg-white shadow rounded-xl p-4">
            <h3 className="text-lg font-bold mb-2">Actividades Pendientes</h3>
            {pending && (
              <BarChart width={300} height={200} data={[pending]}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="totalActivities" />
                <YAxis />
                <RechartsTooltip />
                <Legend />
                <Bar dataKey="pendingActivities" fill="#FF8042" />
              </BarChart>
            )}
          </div>

          <div className="bg-white shadow rounded-xl p-4 col-span-1 md:col-span-2">
            <h3 className="text-lg font-bold mb-2">Controles por Fecha</h3>
            <LineChart width={600} height={300} data={reportByDate}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="createdat" tickFormatter={(date) => date.split("T")[0]} />
              <YAxis />
              <RechartsTooltip />
              <Line type="monotone" dataKey="control_id" stroke="#0088FE" />
            </LineChart>
          </div>

          <div className="bg-white shadow rounded-xl p-4 col-span-1 md:col-span-2">
            <h3 className="text-lg font-bold mb-2">Evaluación de Actividades</h3>
            {evaluationStatus && (
              <PieChart width={400} height={300}>
                <Pie
                  data={[
                    { name: "Evaluadas", value: evaluationStatus.activitiesEvaluated.length },
                    { name: "No Evaluadas", value: evaluationStatus.activitiesNoEvaluated.length },
                  ]}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {COLORS.map((color, index) => (
                    <Cell key={`cell-${index}`} fill={color} />
                  ))}
                </Pie>
                <RechartsTooltip />
                <Legend />
              </PieChart>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default EnvironmentalCharts;