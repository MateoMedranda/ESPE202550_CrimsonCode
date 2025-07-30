import { useEffect, useState } from "react";
import axios from "axios";

export function usePlanActivities(planId, token) {
    const [activities, setActivities] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (!planId) return;

        const fetchActivities = async () => {
            setLoading(true);
            try {
                const response = await axios.get(
                    `http://localhost:3001/environmental-plans/${planId}/activities/`,
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    }
                );
                setActivities(response.data);
            } catch (err) {
                setError(err);
            } finally {
                setLoading(false);
            }
        };

        fetchActivities();
    }, [planId, token]);

    return { activities, loading, error };
}
