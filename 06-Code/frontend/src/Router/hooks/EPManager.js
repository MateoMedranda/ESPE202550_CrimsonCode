import { useState, useEffect } from "react";

export default function EPController(projectId, token) {
  const [environmentalPlan, setEnvironmentalPlan] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const baseUrl = `http://localhost:3001/projects/${projectId}/environmental-plans`;

  useEffect(() => {
    if (!token) {
      setError("No autorizado");
      setLoading(false);
      return;
    }

    fetch(baseUrl, {
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

  const getPlanById = async (id) => {
  try {
    const res = await fetch(`${baseUrl}/${id}`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
    if (!res.ok) throw new Error("Error al obtener plan");
    return await res.json();
  } catch (err) {
    setError(err.message);
    return null;
  }
};

  const insertPlan = async (newPlan) => {
    try {
      const res = await fetch(baseUrl, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(newPlan)
      });
      if (!res.ok) throw new Error("Error al insertar plan");
      const createdPlan = await res.json();
      setEnvironmentalPlan((prev) => [...prev, createdPlan]);
    } catch (err) {
      setError(err.message);
    }
  };

  const updatePlan = async (id, updatedData) => {
    try {
      const res = await fetch(`${baseUrl}/${id}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(updatedData)
      });
      if (!res.ok) throw new Error("Error al actualizar plan");
      const updatedPlan = await res.json();
      setEnvironmentalPlan((prev) =>
        prev.map((plan) => (plan.id === id ? updatedPlan : plan))
      );
    } catch (err) {
      setError(err.message);
    }
  };

  const deletePlan = async (id) => {
    try {
      const res = await fetch(`${baseUrl}/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (!res.ok) throw new Error("Error al eliminar plan");
      setEnvironmentalPlan((prev) => prev.filter((plan) => plan.id !== id));
    } catch (err) {
      setError(err.message);
    }
  };

  return { 
    environmentalPlan, 
    loading, 
    error,
    getPlanById, 
    insertPlan, 
    updatePlan, 
    deletePlan 
  };
}
