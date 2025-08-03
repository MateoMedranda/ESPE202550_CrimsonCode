import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  PieChart, Pie, Cell, Tooltip as RechartsTooltip, Legend,
  BarChart, Bar, XAxis, YAxis, CartesianGrid,
  LineChart, Line
} from "recharts";

export default function EnvironmentalCharts({ planId, token }) {
  const [compliance, setCompliance] = useState(null);
  const [pending, setPending] = useState(null);
  const [reportByDate, setReportByDate] = useState([]);
  const [evaluationStatus, setEvaluationStatus] = useState(null);

  const baseUrl = "https://sima-es01.onrender.com/environmental-plans/";

  useEffect(() => {
    const fetchData = async () => {
      try {
        const headers = { Authorization: `Bearer ${token}` };

        const [resCompliance, resPending, resReport, resEvalStatus] = await Promise.all([
          axios.get(`${baseUrl}${planId}/compliance/`, { headers }),
          axios.get(`${baseUrl}${planId}/pending/`, { headers }),
          axios.get(`${baseUrl}${planId}/reports/controls?from=2025-01-01&to=2025-12-31`, { headers }),
          axios.get(`${baseUrl}${planId}/reportPrueba`, { headers }),
        ]);

        setCompliance(resCompliance.data);
        setPending(resPending.data);
        setReportByDate(resReport.data.data);
        setEvaluationStatus(resEvalStatus.data);
      } catch (error) {
        console.error("Error al cargar datos:", error);
      }
    };

    fetchData();
  }, [planId, token]);

  const COLORS = ["#0088FE", "#FF8042", "#00C49F", "#FFBB28"];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-4">
      <div className="bg-white shadow rounded-xl p-4">
        <h3 className="text-lg font-bold mb-2">Cumplimiento (%)</h3>
        {compliance && (
          <BarChart width={300} height={200} data={[compliance]}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="totalActivities" hide />
            <YAxis domain={[0, 100]} />
            <RechartsTooltip />
            <Bar dataKey="percentageSatisfy" fill="#00C49F" />
          </BarChart>
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
  );
}
