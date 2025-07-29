import { useState, useEffect } from "react";

export default function EPController(projectId, token) {
  const [environmentalPlan, setEnvironmentalPlan] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

    console.log("id:"+projectId);
    console.log("token:"+token);

  useEffect(() => {
    if (!token) {
      setError("No autorizado");
      setLoading(false);
      return;
    }


    fetch(`http://localhost:3001/projects/${projectId}/environmental-plans/`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    })
      .then((res) => {
        if (!res.ok) {
          if (res.status === 403) throw new Error("Acceso denegado");
          throw new Error("Error al cargar planes");
        }
        return res.json();
      })
      .then((data) => setEnvironmentalPlan(Array.isArray(data) ? data : []))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [projectId, token]);

  return { environmentalPlan, loading, error };
}
