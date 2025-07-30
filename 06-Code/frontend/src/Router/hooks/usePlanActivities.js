import { useEffect, useState } from "react";
import axios from "axios";

export function usePlanActivities(planId, token) {
    const [activities, setActivities] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const baseUrl = `http://localhost:3001/environmental-plans/${planId}/activities`;

    useEffect(() => {
        if (!planId) return;

        const fetchActivities = async () => {
            setLoading(true);
            try {
                const response = await axios.get(baseUrl, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                setActivities(response.data);
                setError(null);
            } catch (err) {
                setError(err);
            } finally {
                setLoading(false);
            }
        };

        fetchActivities();
    }, [planId, token]);

    // Crear actividad
    const createActivity = async (activityData) => {
        try {
            const response = await axios.post(baseUrl, activityData, {
                headers: { Authorization: `Bearer ${token}` },
            });
            setActivities((prev) => [...prev, response.data]);
            return response.data;
        } catch (err) {
            throw err;
        }
    };

    // Actualizar actividad
    const updateActivity = async (activityId, activityData) => {
        try {
            const url = `${baseUrl}/${activityId}`;
            const response = await axios.put(url, activityData, {
                headers: { Authorization: `Bearer ${token}` },
            });
            setActivities((prev) =>
                prev.map((a) => (a.activity_id === activityId ? response.data : a))
            );
            return response.data;
        } catch (err) {
            throw err;
        }
    };

    // Eliminar actividad
    const deleteActivity = async (activityId) => {
        try {
            const url = `${baseUrl}/${activityId}`;
            await axios.delete(url, {
                headers: { Authorization: `Bearer ${token}` },
            });
            setActivities((prev) => prev.filter((a) => a.activity_id !== activityId));
        } catch (err) {
            throw err;
        }
    };

    return {
        activities,
        loading,
        error,
        createActivity,
        updateActivity,
        deleteActivity,
    };
}
