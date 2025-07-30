import { useState, useEffect } from "react";

export default function ProjectController(projectId) {
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`https://sima-es01.onrender.com/projects`)
      .then((res) => res.json())
      .then((data) => setProject(data))
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, [projectId]);

  return { project, loading };
}
