import { useState, useEffect } from "react";

export default function ProjectController(projectId, token) {
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);

  console.log("token: "+ token);

  useEffect(() => {
    fetch(`http://localhost:3001/projects/${projectId}`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    })
      .then((res) => {
        if (!res.ok) {
          throw new Error(`Error ${res.status}: ${res.statusText}`);
        }
        return res.json();
      })
      .then((data) => setProject(data))
      .catch((err) => console.error("Error fetching project:", err))
      .finally(() => setLoading(false));
  }, [projectId]);

  return { project, loading };
}
