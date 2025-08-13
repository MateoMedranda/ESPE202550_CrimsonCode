import { useEffect, useState } from "react";
import axios from "axios";

export function useActivitiesControls(activity_id, token) {
    const [controls, setControls] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const baseUrl = `https://sima-es01.onrender.com/activities/${activity_id}/controls/`;

    useEffect(() => {
        if (!activity_id) return;

        const fetchControls = async () => {
            setLoading(true);
            try {
                const response = await axios.get(baseUrl, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                setControls(response.data);
                setError(null);
            } catch (err) {
                setError(err);
            } finally {
                setLoading(false);
            }
        };

        fetchControls();
    }, [activity_id, token]);

    const createControl = async (controlData) => {
        try {
            const formData = new FormData();
            formData.append("criterion", controlData.criterion);
            formData.append("observation", controlData.observation);
            if (controlData.evidence) {
                formData.append("evidence", controlData.evidence);
            }

            const response = await axios.post(baseUrl, formData, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "multipart/form-data",
                },
            });
            setControls((prev) => [...prev, response.data]);
            return response.data;
        } catch (err) {
            throw err;
        }
    };

    const updateControl = async (controlId, controlData) => {
        try {
            const formData = new FormData();
            if (controlData.criterion) formData.append("criterion", controlData.criterion);
            if (controlData.observation) formData.append("observation", controlData.observation);
            if (controlData.evidence) {
                formData.append("evidence", controlData.evidence);
            }

            const url = `${baseUrl}${controlId}`;
            const response = await axios.put(url, formData, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "multipart/form-data",
                },
            });
            setControls((prev) =>
                prev.map((c) => (c.control_id === controlId ? response.data : c))
            );
            return response.data;
        } catch (err) {
            throw err;
        }
    };

    const deleteControl = async (controlId) => {
        try {
            const url = `${baseUrl}${controlId}`;
            const response = await axios.patch(
                url,
                { verification: "Anulado" },
                { headers: { Authorization: `Bearer ${token}` } }
            );

            setControls((prev) =>
                prev.map((c) =>
                    c.control_id === controlId ? { ...c, control_verification: "Anulado" } : c
                )
            );

            return response.data;
        } catch (err) {
            throw err;
        }
    };

    return {
        controls,
        loading,
        error,
        createControl,
        updateControl,
        deleteControl,
    };
}
