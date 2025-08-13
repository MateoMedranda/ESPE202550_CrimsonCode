import React, { useState, useEffect } from "react";
import { useAuth } from "../Context/AuthContext";

export default function PermitsRouter({ projectId, API_BASE = "https://sima-es01.onrender.com" }) {

  const { token, permits } = useAuth();
  const canEdit   = permits?.Permisos?.profiles_updatepermit?.value === true;
  const canCreate = permits?.Permisos?.profiles_createpermit?.value === true;
  const canView   = permits?.Permisos?.profiles_readpermit?.value   === true;
  const canDelete = permits?.Permisos?.profiles_deletepermit?.value === true;


  const [permitsList, setPermitsList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAdd, setShowAdd] = useState(false);
  const [showEdit, setShowEdit] = useState(false);
  const [showDelete, setShowDelete] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const [selected, setSelected] = useState(null);

  const [formData, setFormData] = useState({
    permit_name: "",
    permit_description: "",
    permit_archive: "" 
  });


  const [permitFile, setPermitFile] = useState(null);


  const baseUrl          = `${API_BASE}/projects/${projectId}/permits`;
  const permitActionsUrl = `${API_BASE}/permits`;
  const uploadUrl        = `${API_BASE}/upload`;


  const fetchPermits = async () => {
    try {
      const res = await fetch(baseUrl, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setPermitsList(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Error al obtener permisos:", err);
      setPermitsList([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPermits();
  }, [projectId]);

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };


  const uploadOne = async (file) => {
    const fd = new FormData();
    fd.append("file", file);
    const res = await fetch(uploadUrl, {
      method: "POST",
      headers: { Authorization: `Bearer ${token}` },
      body: fd
    });
    if (!res.ok) throw new Error("Error subiendo archivo");
    const data = await res.json(); 
    return data.url;
  };

  const toCloudinaryDownload = (url, filename = "archivo") => {
    if (!url) return "";
    if (!url.includes("/upload/")) return url; 
    if (url.includes("fl_attachment")) return url; 

    const safe =
      String(filename)
        .toLowerCase()
        .replace(/\s+/g, "_")
        .replace(/[^a-z0-9._-]/g, "") || "archivo";

    return url.replace("/upload/", `/upload/fl_attachment:${safe}/`);
  };


  const handleSave = async (e) => {
    e.preventDefault();
    try {

      const fileUrl = permitFile ? await uploadOne(permitFile) : "";


      const res = await fetch(permitActionsUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          name: formData.permit_name,
          description: formData.permit_description,
          file: fileUrl,
          idProject: projectId
        }),
      });

      if (!res.ok) throw new Error("Error al crear permiso");

      await fetchPermits();
      setShowAdd(false);
      setFormData({ permit_name: "", permit_description: "", permit_archive: "" });
      setPermitFile(null);
    } catch (err) {
      console.error(err);
      alert("No se pudo crear el permiso");
    }
  };

  const handleUpdate = async () => {
    try {

      let fileUrl = formData.permit_archive || selected?.permit_archive || "";

      if (permitFile) fileUrl = await uploadOne(permitFile);

      const res = await fetch(`${permitActionsUrl}/${selected.permit_id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          name: formData.permit_name,
          description: formData.permit_description,
          file: fileUrl,
          idProject: projectId,
        }),
      });

      if (!res.ok) throw new Error("Error al actualizar permiso");

      await fetchPermits();
      setShowEdit(false);
      setPermitFile(null);
    } catch (err) {
      console.error(err);
      alert("No se pudo actualizar el permiso");
    }
  };

  const handleDelete = async () => {
    try {
      const res = await fetch(`${permitActionsUrl}/${selected.permit_id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) throw new Error("Error al eliminar permiso");

      await fetchPermits();
      setShowDelete(false);
    } catch (err) {
      console.error(err);
      alert("No se pudo eliminar el permiso");
    }
  };

  if (loading) return <h2>Cargando permisos...</h2>;

  if (!canView) {
    return (
      <div className="text-muted">
        <i className="bi bi-shield-lock me-2"></i>No tienes permisos para ver esta sección.
      </div>
    );
  }

  return (
    <div>
      <div className="d-flex">
        <div className="col">
          <h3 className="title inter-title">Permisos</h3>
        </div>
        <div className="col text-end">
          {canCreate && (
            <button className="btn bg-info-subtle border-black" onClick={() => setShowAdd(true)}>
              <i className="bi bi-plus-circle"></i> Agregar Permiso
            </button>
          )}
        </div>
      </div>
      <hr />

      {Array.isArray(permitsList) && permitsList.length === 0 ? (
        <div className="text-center text-muted">
          <i className="bi bi-shield-slash" style={{ fontSize: "2rem" }}></i>
          <p>No hay permisos registrados aún.</p>
        </div>
      ) : (
        <div className="row">
          {permitsList.map((p) => (
            <div key={p.permit_id} className="col-12 col-md-6 mb-3">
              <div className="permit-pill d-flex align-items-center justify-content-between px-4 py-3">
                <span className="permit-pill__title text-truncate">{p.permit_name}</span>

                <div className="dropdown">
                  <button
                    className="btn btn-light btn-sm rounded-3"
                    type="button"
                    data-bs-toggle="dropdown"
                    aria-expanded="false"
                    aria-label="acciones permiso"
                  >
                    <i className="bi bi-list fs-5"></i>
                  </button>
                  <ul className="dropdown-menu dropdown-menu-end">
                    <li>
                      <button
                        className="dropdown-item"
                        onClick={() => {
                          setSelected(p);
                          setShowDetails(true);
                        }}
                      >
                        <i className="bi bi-card-text me-2"></i> Mostrar detalles
                      </button>
                    </li>

                    {canEdit && (
                      <li>
                        <button
                          className="dropdown-item"
                          onClick={() => {
                            setSelected(p);
                            setFormData({
                              permit_name: p.permit_name,
                              permit_description: p.permit_description,
                              permit_archive: p.permit_archive || p.file || ""
                            });
                            setShowEdit(true);
                          }}
                        >
                          <i className="bi bi-pencil-square me-2"></i> Editar
                        </button>
                      </li>
                    )}

                    {canDelete && (
                      <>
                        <li><hr className="dropdown-divider" /></li>
                        <li>
                          <button
                            className="dropdown-item text-danger"
                            onClick={() => {
                              setSelected(p);
                              setShowDelete(true);
                            }}
                          >
                            <i className="bi bi-trash me-2"></i> Eliminar
                          </button>
                        </li>
                      </>
                    )}
                  </ul>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {showAdd && (
        <div className="modal d-block bg-dark bg-opacity-50" onClick={() => setShowAdd(false)}>
          <div className="modal-dialog modal-lg" onClick={(e) => e.stopPropagation()}>
            <div className="modal-content bg-light rounded shadow border-0">
              <form onSubmit={handleSave}>
                <fieldset className="border-0 p-4">
                  <h3 className="fw-bold">Nuevo Permiso</h3>
                  <hr />
                  <div className="row mb-3">
                    <div className="col-md-6 mb-3">
                      <label className="form-label">Nombre del Permiso: *</label>
                      <input
                        name="permit_name"
                        type="text"
                        className="form-control shadow-sm"
                        value={formData.permit_name}
                        onChange={handleChange}
                        required
                      />
                    </div>
                    <div className="col-md-6 mb-3">
                      <label className="form-label">Descripción: *</label>
                      <input
                        name="permit_description"
                        type="text"
                        className="form-control shadow-sm"
                        value={formData.permit_description}
                        onChange={handleChange}
                        required
                      />
                    </div>
                    <div className="col-md-12 mb-3">
                      <label className="form-label">Archivo (PDF/imagen/doc): *</label>
                      <input
                        type="file"
                        className="form-control shadow-sm"
                        onChange={(e) => setPermitFile(e.target.files?.[0] || null)}
                        required
                      />
                    </div>
                  </div>
                  <hr />
                  <div className="d-flex justify-content-end gap-2">
                    <button type="submit" className="btn btn-success px-4">Guardar</button>
                    <button type="button" className="btn btn-secondary px-4" onClick={() => setShowAdd(false)}>
                      Cancelar
                    </button>
                  </div>
                </fieldset>
              </form>
            </div>
          </div>
        </div>
      )}

      {showDetails && selected && (
        <div className="modal d-block bg-dark bg-opacity-50" onClick={() => setShowDetails(false)}>
          <div className="modal-dialog" onClick={(e) => e.stopPropagation()}>
            <div className="modal-content rounded-4 border-0">
              <div className="modal-header bg-light">
                <h5 className="modal-title">Detalles del Permiso</h5>
                <button className="btn-close" onClick={() => setShowDetails(false)}></button>
              </div>
              <div className="modal-body">
                <div className="mb-2">
                  <div className="fw-semibold text-muted">Nombre</div>
                  <div className="fs-5">{selected.permit_name}</div>
                </div>
                <div className="mb-3">
                  <div className="fw-semibold text-muted">Descripción</div>
                  <div>{selected.permit_description || "Sin descripción"}</div>
                </div>
                {(selected.permit_archive || selected.file) && (
                  <div className="mb-2">
                    <div className="fw-semibold text-muted">Archivo</div>
                    <a
                      href={toCloudinaryDownload(selected.permit_archive || selected.file, selected.permit_name)}
                      target="_blank"
                      rel="noreferrer"
                      className="btn btn-outline-primary btn-sm"
                    >
                      <i className="bi bi-box-arrow-down me-2" /> Descargar
                    </a>
                  </div>
                )}
              </div>
              <div className="modal-footer">
                <button className="btn btn-secondary" onClick={() => setShowDetails(false)}>Cerrar</button>
              </div>
            </div>
          </div>
        </div>
      )}


      {showEdit && (
        <div className="modal d-block bg-dark bg-opacity-50" onClick={() => setShowEdit(false)}>
          <div className="modal-dialog" onClick={(e) => e.stopPropagation()}>
            <div className="modal-content">
              <div className="modal-header bg-warning">
                <h5 className="modal-title">Editar Permiso</h5>
                <button className="btn-close" onClick={() => setShowEdit(false)}></button>
              </div>
              <div className="modal-body">
                <div className="mb-3">
                  <label>Nombre</label>
                  <input
                    type="text"
                    name="permit_name"
                    className="form-control"
                    value={formData.permit_name}
                    onChange={handleChange}
                  />
                </div>
                <div className="mb-3">
                  <label>Descripción</label>
                  <textarea
                    name="permit_description"
                    className="form-control"
                    value={formData.permit_description}
                    onChange={handleChange}
                  />
                </div>
                <div className="mb-3">
                  <label>Reemplazar archivo (opcional)</label>
                  <input
                    type="file"
                    className="form-control"
                    onChange={(e) => setPermitFile(e.target.files?.[0] || null)}
                  />
                </div>
                <div className="text-end">
                  <button className="btn btn-warning me-2" onClick={handleUpdate}>Actualizar</button>
                  <button className="btn btn-secondary" onClick={() => setShowEdit(false)}>Cancelar</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {showDelete && (
        <div className="modal d-block bg-dark bg-opacity-50" onClick={() => setShowDelete(false)}>
          <div className="modal-dialog" onClick={(e) => e.stopPropagation()}>
            <div className="modal-content">
              <div className="modal-header bg-danger text-white">
                <h5 className="modal-title">¿Eliminar Permiso?</h5>
                <button className="btn-close" onClick={() => setShowDelete(false)}></button>
              </div>
              <div className="modal-body">
                ¿Estás seguro de eliminar el permiso <strong>{selected?.permit_name}</strong>?
              </div>
              <div className="modal-footer">
                <button className="btn btn-secondary" onClick={() => setShowDelete(false)}>Cancelar</button>
                <button className="btn btn-danger" onClick={handleDelete}>Eliminar</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
