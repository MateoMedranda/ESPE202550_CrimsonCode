import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {useAuth } from '../Context/AuthContext'
export default function ProjectList({ Token }) {
  const [projects, setProjects] = useState([]);
  const navigate = useNavigate();
  const {permits,token } = useAuth();
  const canEdit = permits?.Proyectos?.profiles_updateprojects?.value === true;
  const canCreate = permits?.Proyectos?.profiles_createprojects?.value === true;
  const canView = permits?.Proyectos?.profiles_readprojects?.value === true;
  const canDelete = permits?.Proyectos?.profiles_deleteprojects?.value === true;
  useEffect(() => {
    fetch('https://sima-es01.onrender.com/projects/', {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(res => res.json())
      .then(data => setProjects(data))
      .catch(err => console.error('Error al cargar proyectos:', err));
  }, []);

  return (
    <div className="container mt-4">
      <div className="d-flex justify-content-between">
        <h2 className="title text-white">Vista General de Proyectos</h2>
        {canCreate && 
        (
          <button className="btn bg-info-subtle border-black">
          <i className="bi bi-plus-circle"></i> Agregar Proyecto
        </button>
        )}
      </div>
      
        {canView && (
          <><hr />
      <div className="bg-white rounded shadow p-4">
        {projects.length === 0 ? (
          <div className="text-center my-5">
            <h1><i className="bi bi-stars"></i></h1>
            <h1><i className="bi bi-archive"></i> Aún no hay nada aquí</h1>
          </div>
        ) : (
          
            <div className="row">
            {projects.map((p) => (
              <div key={p.project_id} className="col-md-3 m-3">
                <div className="card shadow h-100 p-3">
                  <h5 className="fw-bold">{p.project_name}</h5>
                  <p className="text-muted mb-1">Ubicación: {p.project_location}</p>
                  <small className="mb-3 d-block">Estado: {p.project_state}</small>
                  <div className="text-end mt-auto">
                    {canEdit && (
                    <button
                      className="btn btn-outline-success"
                      onClick={() => navigate(`/projects/${p.project_id}`)}
                    >
                      <i className="bi bi-eye"></i> Ver Detalles
                    </button>
                    )}
                    
                  </div>
                </div>
              </div>
            ))}
          </div>        
        )}
      </div>
      </>
        )
  }
    </div>
  );
}
