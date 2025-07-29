import React, { useState } from "react";
import useProjectController from "./hooks/ProjectController";
import EnvironmentalPlansList from "./EPRouter";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import { useParams } from 'react-router-dom';

export default function ProjectDetail({ token }) {
    const { projectId } = useParams();
    const { project, loading } = useProjectController(projectId,token);
    const [modalImage, setModalImage] = useState(null);

    if (loading) return <h2>Cargando...</h2>;
    if (!project) return <h2>No se encontró el proyecto</h2>;

    return (
        <div className="container mt-4">
            <div className="text-center">
                <h1 className="title text-dark">{project.project_name}</h1>
            </div>

            <fieldset className="border p-4 shadow bg-light rounded">
                <button className="btn bg-danger-subtle border-black">
                    <i className="bi bi-arrow-90deg-left"></i> Regresar
                </button>
                <hr />

                <div className="row">
                    <div className="col-md-5">
                        <p>Fecha de Inicio: {project.project_startdate}</p>
                        <hr />
                        <p>Estado: <i className="bi bi-bar-chart-fill"></i>
                            <span style={{ color: "green" }}> {project.project_state}</span>
                        </p>
                        <hr />
                        <p>Ubicación: {project.project_location}</p>
                        <hr />
                        <p>Descripción: {project.project_description}</p>
                    </div>

                    <div className="col-md-7">
                        <img
                            src={`../PROJECTS/${project.project_name}/imagen_proyecto/${project.project_image}`}
                            alt="Imagen Proyecto"
                            width="100%"
                            style={{ cursor: "pointer" }}
                            onClick={() => setModalImage(project.project_image)}
                        />
                    </div>
                </div>

                {/* Modal imagen */}
                {modalImage && (
                    <div className="position-fixed top-0 start-0 w-100 h-100 d-flex justify-content-center align-items-center bg-dark bg-opacity-75">
                        <div className="position-relative">
                            <button
                                className="btn btn-light position-absolute top-0 end-0"
                                onClick={() => setModalImage(null)}
                            >
                                ×
                            </button>
                            <img
                                src={`../PROJECTS/${project.project_name}/imagen_proyecto/${modalImage}`}
                                alt="Ampliada"
                                className="img-fluid"
                            />
                        </div>
                    </div>
                )}

                <hr />

                {/* Secciones */}
                <Section title="Permisos" icon="bi-shield-exclamation" onAdd={() => { }} />
                <EnvironmentalPlansList projectId={1} token={token}/>
                <Section title="Monitoreos" icon="bi-camera2" onAdd={() => { }} />
                <Section title="Recordatorios" icon="bi-exclamation-circle" onAdd={() => { }} />
            </fieldset>
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
