import React, { useState } from "react";
import useProjectController from "./hooks/ProjectController";
import EnvironmentalPlansList from "./components/EnvironmentalPlanList";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import { useParams } from 'react-router-dom';

export default function ProjectDetail({ token }) {
    const { projectId } = useParams();
    const { project, loading } = useProjectController(projectId, token);
    const [modalImage, setModalImage] = useState(null);

    if (loading) return <h2>Cargando...</h2>;
    if (!project) return <h2>No se encontró el proyecto</h2>;

    return (
        <div className="container mt-5 bg-light p-4 mb-5">
            {/* Header */}
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h1 className="fw-bold text-dark">{project.project_name}</h1>
                <button
                    className="btn btn-outline-danger px-4 py-2 rounded-pill shadow-sm"
                >
                    <i className="bi bi-arrow-left me-2"></i> Regresar
                </button>
            </div>

            {/* Card principal */}
            <div className="card border-0 shadow-lg rounded-4 p-4">
                <div className="row g-4">
                    {/* Información */}
                    <div className="col-md-5">
                        <div className="mb-3">
                            <small className="text-muted">Fecha de Inicio</small>
                            <p className="fs-5 fw-semibold mb-0">{project.project_startdate}</p>
                        </div>
                        <div className="mb-3">
                            <small className="text-muted">Estado</small>
                            <span className="badge bg-success ms-2 px-3 py-2 rounded-pill fs-6">
                                {project.project_state}
                            </span>
                        </div>
                        <div className="mb-3">
                            <small className="text-muted">Ubicación</small>
                            <p className="fs-5 fw-semibold mb-0">{project.project_location}</p>
                        </div>
                        <div className="mb-3">
                            <small className="text-muted">Descripción</small>
                            <p className="text-secondary">{project.project_description}</p>
                        </div>
                    </div>

                    {/* Imagen */}
                    <div className="col-md-7 text-center">
                        <img
                            src={`/img/imagenProyecto.svg`}
                            alt="Imagen Proyecto"
                            className="img-fluid rounded-4 shadow-sm"
                            style={{ cursor: "pointer", maxHeight: "300px", objectFit: "cover" }}
                            onClick={() => setModalImage(project.project_image)}
                        />
                    </div>
                </div>
            </div>

            {/* Modal Imagen */}
            {modalImage && (
                <div
                    className="position-fixed top-0 start-0 w-100 h-100 d-flex justify-content-center align-items-center bg-dark bg-opacity-75"
                    style={{ zIndex: 9999 }}
                >
                    <div className="position-relative">
                        <button
                            className="btn position-absolute top-0 end-0 m-2 rounded-circle shadow"
                            onClick={() => setModalImage(null)}
                        >
                            ×
                        </button>
                        <img
                            src={`/img/imagenProyecto.svg`}
                            alt="Ampliada"
                            className="img-fluid rounded-4 shadow-lg"
                            style={{ maxHeight: "80vh" }}
                        />
                    </div>
                </div>
            )}

            {/* Secciones */}
            <div className="mt-4">
                <Section title="Permisos" icon="bi-shield-lock" onAdd={() => { }} />
                <EnvironmentalPlansList projectId={1} token={token} />
                <Section title="Monitoreos" icon="bi-camera-video" onAdd={() => { }} />
                <Section title="Recordatorios" icon="bi-bell-fill" onAdd={() => { }} />
            </div>
        </div>
    );

}

function Section({ title, icon, onAdd }) {
    return (
        <>
            <div className="d-flex">
                <div className="col">
                    <h3 className="title inter-title">{title}</h3>
                </div>
                <div className="col text-end">
                    <button className="btn bg-info-subtle border-black" onClick={onAdd}>
                        <i className="bi bi-plus-circle"></i> Agregar
                    </button>
                </div>
            </div>
            <hr />
            <div className="col-12 text-center my-1 py-1">
                <h1><i className="bi bi-stars"></i></h1>
                <h1><i className={`bi ${icon}`}></i> Aún no hay {title.toLowerCase()} aquí</h1>
            </div>
            <hr />
        </>
    );
}
