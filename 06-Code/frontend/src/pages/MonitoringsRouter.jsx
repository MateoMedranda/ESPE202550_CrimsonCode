import React, { useEffect, useMemo, useState } from "react";
import { useAuth } from "../Context/AuthContext";

export default function MonitoringsRouter({ projectId }) {
  const { permits, token } = useAuth();

  const canView   = Boolean(permits?.Monitoreos?.profiles_readmonitorings?.value);
  const canCreate = Boolean(permits?.Monitoreos?.profiles_writemonitorings?.value);
  const canEdit   = Boolean(permits?.Monitoreos?.profiles_updatemonitorings?.value);
  const canDelete = Boolean(permits?.Monitoreos?.profiles_deletemonitorings?.value);

  const [monitorings, setMonitorings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errMsg, setErrMsg] = useState("");

  const [showAdd, setShowAdd] = useState(false);
  const [showEdit, setShowEdit] = useState(false);
  const [showDelete, setShowDelete] = useState(false);
  const [showDetail, setShowDetail] = useState(false);

  const [selected, setSelected] = useState(null);
  const [detail, setDetail] = useState(null);

  const [formData, setFormData] = useState({
    monitoring_name: "",
    monitoring_description: "",
    monitoring_observations: "",
    monitoring_date: "",
    monitoring_image: "",
    monitoring_evidence: "",
    monitoring_folder: ""
  });
  const [imageFile, setImageFile] = useState(null);
  const [evidenceFile, setEvidenceFile] = useState(null);

  const fitCloudinary = (url, w = 1000, h = 600) =>
    url?.includes("/upload/")
      ? url.replace("/upload/", `/upload/f_auto,q_auto,w_${w},h_${h},c_fill,g_auto/`)
      : url;

  const toInputDate = (iso) => {
    if (!iso) return "";
    const d = new Date(iso);
    if (isNaN(d)) return iso; 
    const yyyy = d.getFullYear();
    const mm = String(d.getMonth() + 1).padStart(2, "0");
    const dd = String(d.getDate()).padStart(2, "0");
    return `${yyyy}-${mm}-${dd}`;
  };


  const API_BASE =`https://sima-es01.onrender.com`;
  const baseListUrl = useMemo(() => `${API_BASE}/projects/${projectId}/monitorings`, [API_BASE, projectId]);
  const baseCrudUrl = `${API_BASE}/monitorings`;
  const uploadUrl   = `${API_BASE}/upload`;

  const fetchMonitorings = async () => {
    setLoading(true);
    setErrMsg("");
    try {
      const res = await fetch(baseListUrl, { headers: { Authorization: `Bearer ${token}` } });
      if (!res.ok) throw new Error("No se pudo obtener monitoreos");
      const data = await res.json();
      setMonitorings(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Error al obtener monitoreos:", err);
      setErrMsg("Error al obtener monitoreos.");
      setMonitorings([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (projectId && token && canView) fetchMonitorings();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [projectId, token, canView]);


  const handleChange = (e) => setFormData((s) => ({ ...s, [e.target.name]: e.target.value }));

  const resetForm = () => {
    setFormData({
      monitoring_name: "",
      monitoring_description: "",
      monitoring_observations: "",
      monitoring_date: "",
      monitoring_image: "/img/monitoring_default.jpg",
      monitoring_evidence: "/files/demo.pdf",
      monitoring_folder: "/monitorings/folder/"
    });
    setImageFile(null);
    setEvidenceFile(null);
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


  const handleSave = async (e) => {
    e.preventDefault();
    setErrMsg("");
    try {
      const imageUrl = imageFile ? await uploadOne(imageFile) : "";
      const fileUrl  = evidenceFile ? await uploadOne(evidenceFile) : "";
      const folder   = "/monitorings/folder/";

      const payload = {
        idProject: projectId,                 
        project_id: projectId,               
        name: formData.monitoring_name,
        description: formData.monitoring_description,
        observations: formData.monitoring_observations,
        image: imageUrl,
        file: fileUrl,
        folder,
      };

      const res = await fetch(baseCrudUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify(payload)
      });
      if (!res.ok) throw new Error("Error al crear monitoreo");

      await fetchMonitorings();
      setShowAdd(false);
      resetForm();
    } catch (err) {
      console.error(err);
      setErrMsg("Fallo al crear el monitoreo.");
    }
  };


  const handleUpdate = async () => {
    if (!selected) return;
    setErrMsg("");
    try {
      let imageUrl = formData.monitoring_image || null;
      let fileUrl  = formData.monitoring_evidence || null;

      if (imageFile)   imageUrl = await uploadOne(imageFile);
      if (evidenceFile) fileUrl = await uploadOne(evidenceFile);

      const payload = {
        name: formData.monitoring_name,
        description: formData.monitoring_description,
        observations: formData.monitoring_observations,
        ...(imageUrl ? { image: imageUrl } : {}),
        ...(fileUrl  ? { file: fileUrl }  : {}),

      };

      const res = await fetch(`${baseCrudUrl}/${selected.monitoring_id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify(payload)
      });
      if (!res.ok) throw new Error("Error al actualizar monitoreo");

      await fetchMonitorings();
      setShowEdit(false);
      setSelected(null);
      setImageFile(null);
      setEvidenceFile(null);
    } catch (err) {
      console.error(err);
      setErrMsg("Fallo al actualizar el monitoreo.");
    }
  };


  const handleDelete = async () => {
    if (!selected) return;
    setErrMsg("");
    try {
      const res = await fetch(`${baseCrudUrl}/${selected.monitoring_id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` }
      });
      if (!res.ok) throw new Error("Error al eliminar");
      await fetchMonitorings();
      setShowDelete(false);
      setSelected(null);
    } catch (err) {
      console.error(err);
      setErrMsg("Fallo al eliminar el monitoreo.");
    }
  };


  if (!canView) return <p className="text-muted">No tienes permisos para ver Monitoreos.</p>;
  if (loading)   return <h2>Cargando monitoreos...</h2>;

  return (
    <div>
      <div className="d-flex">
        <div className="col">
          <h3 className="title inter-title">Monitoreos</h3>
        </div>
        <div className="col text-end">
          {canCreate && (
            <button className="btn bg-info-subtle border-black" onClick={() => setShowAdd(true)}>
              <i className="bi bi-plus-circle"></i> Agregar Monitoreo
            </button>
          )}
        </div>
      </div>

      <hr />

      {errMsg && <div className="alert alert-danger py-2 mb-3">{errMsg}</div>}

      {Array.isArray(monitorings) && monitorings.length === 0 ? (
        <div className="text-center text-muted">
          <i className="bi bi-camera-video-off" style={{ fontSize: "2rem" }}></i>
          <p>No hay monitoreos registrados aún.</p>
        </div>
      ) : (
        <div className="row">
          {monitorings.map((m) => (
            <div key={m.monitoring_id} className="col-12 col-md-6 col-lg-4 mb-4">
              <div className="monitor-card">

                <div className="monitor-card__header">
                  <h5 className="monitor-card__title">{m.monitoring_name}</h5>

                  <div className="dropdown monitor-card__actions">
                    <button className="monitor-card__menu" type="button" data-bs-toggle="dropdown" aria-expanded="false">
                      <i className="bi bi-list" />
                    </button>
                    <ul className="dropdown-menu dropdown-menu-end">
                      <li>
                        <button
                          className="dropdown-item"
                          onClick={() => {
                            setDetail(m);
                            setShowDetail(true);
                          }}
                        >
                          Ver detalles
                        </button>
                      </li>
                      {canEdit && (
                        <li>
                          <button
                            className="dropdown-item"
                            onClick={() => {
                              setSelected(m);
                              setFormData({
                                monitoring_name: m.monitoring_name || "",
                                monitoring_description: m.monitoring_description || "",
                                monitoring_observations: m.monitoring_observations || "",
                                monitoring_image: m.monitoring_image || "",
                                monitoring_evidence: m.monitoring_evidence || "",
                                monitoring_date: toInputDate(m.monitoring_date) || ""
                              });
                              setShowEdit(true);
                            }}
                          >
                            Editar
                          </button>
                        </li>
                      )}
                      {canDelete && (
                        <>
                          <li><hr className="dropdown-divider" /></li>
                          <li>
                            <button className="dropdown-item text-danger" onClick={() => { setSelected(m); setShowDelete(true); }}>
                              Eliminar
                            </button>
                          </li>
                        </>
                      )}
                    </ul>
                  </div>
                </div>


                <img
                  className="monitor-card__image"
                  src={m.monitoring_image || "/img/monitoreo.jpg"}
                  alt={m.monitoring_name}
                  loading="lazy"
                  onError={(e) => { e.currentTarget.onerror = null; e.currentTarget.src = "/img/monitoreo.jpg"; }}
                />


                <div className="monitor-card__body">
                  <p className="monitor-card__desc">{m.monitoring_description}</p>
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
                  <h3 className="fw-bold">Nuevo Monitoreo</h3>
                  <hr />
                  <div className="row mb-3">
                    <div className="col-md-6">
                      <label className="form-label">Nombre *</label>
                      <input
                        name="monitoring_name"
                        type="text"
                        className="form-control"
                        value={formData.monitoring_name || ""}
                        onChange={handleChange}
                        required
                      />
                    </div>
                  </div>

                  <div className="mb-3">
                    <label className="form-label">Descripción *</label>
                    <textarea
                      name="monitoring_description"
                      className="form-control"
                      value={formData.monitoring_description || ""}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  <div className="mb-3">
                    <label className="form-label">Observaciones *</label>
                    <textarea
                      name="monitoring_observations"
                      className="form-control"
                      value={formData.monitoring_observations || ""}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  <div className="row mb-3">
                    <div className="col-md-6">
                      <label className="form-label">Imagen (subir archivo)</label>
                      <input
                        type="file"
                        accept="image/*"
                        className="form-control"
                        onChange={(e) => setImageFile(e.target.files[0] || null)}
                      />
                    </div>
                    <div className="col-md-6">
                      <label className="form-label">Evidencia (PDF u otro)</label>
                      <input
                        type="file"
                        accept="application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document,image/*"
                        className="form-control"
                        onChange={(e) => setEvidenceFile(e.target.files[0] || null)}
                      />
                    </div>
                  </div>

                  <input type="hidden" name="monitoring_folder" value="/monitorings/folder/" />

                  <hr />
                  <div className="text-end">
                    <button type="submit" className="btn btn-success me-2">Guardar</button>
                    <button type="button" className="btn btn-secondary" onClick={() => setShowAdd(false)}>Cancelar</button>
                  </div>
                </fieldset>
              </form>
            </div>
          </div>
        </div>
      )}


      {showDetail && detail && (
        <div className="modal d-block bg-dark bg-opacity-50" onClick={() => setShowDetail(false)}>
          <div className="modal-dialog modal-lg modal-dialog-centered" onClick={(e) => e.stopPropagation()}>
            <div className="modal-content border-0 rounded-4 overflow-hidden">
              <div className="ratio ratio-16x9 bg-light">
                <img
                  src={fitCloudinary(detail.monitoring_image)}
                  alt={detail.monitoring_name}
                  style={{ objectFit: "cover" }}
                  onError={(e) => { e.currentTarget.onerror = null; e.currentTarget.src = "/img/monitoreo.jpg"; }}
                />
              </div>
              <div className="p-4">
                <h4 className="fw-bold mb-1">{detail.monitoring_name}</h4>
                <p className="mb-0" style={{ whiteSpace: "pre-wrap" }}>
                  {detail.monitoring_description}
                </p>
              </div>
              <div className="px-4 pb-4 d-flex justify-content-end">
                <button className="btn btn-secondary" onClick={() => setShowDetail(false)}>
                  Cerrar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}


      {showEdit && selected && (
        <div className="modal d-block bg-dark bg-opacity-50" onClick={() => setShowEdit(false)}>
          <div className="modal-dialog modal-lg" onClick={(e) => e.stopPropagation()}>
            <div className="modal-content bg-light rounded shadow border-0">
              <div className="p-4">
                <h3 className="fw-bold">Editar Monitoreo</h3>
                <hr />
                <div className="row mb-3">
                  <div className="col-md-6">
                    <label className="form-label">Nombre *</label>
                    <input
                      name="monitoring_name"
                      type="text"
                      className="form-control"
                      value={formData.monitoring_name || ""}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>

                <div className="mb-3">
                  <label className="form-label">Descripción *</label>
                  <textarea
                    name="monitoring_description"
                    className="form-control"
                    value={formData.monitoring_description || ""}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="mb-3">
                  <label className="form-label">Observaciones *</label>
                  <textarea
                    name="monitoring_observations"
                    className="form-control"
                    value={formData.monitoring_observations || ""}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="row mb-3">
                  <div className="col-md-6">
                    <label className="form-label">Imagen (subir nueva para reemplazar)</label>
                    <input
                      type="file"
                      accept="image/*"
                      className="form-control"
                      onChange={(e) => setImageFile(e.target.files[0] || null)}
                    />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label">Evidencia (subir nueva)</label>
                    <input
                      type="file"
                      accept="application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document,image/*"
                      className="form-control"
                      onChange={(e) => setEvidenceFile(e.target.files[0] || null)}
                    />
                  </div>
                </div>

                <hr />
                <div className="text-end">
                  <button className="btn btn-success me-2" onClick={handleUpdate}>Actualizar</button>
                  <button className="btn btn-secondary" onClick={() => setShowEdit(false)}>Cancelar</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}


      {showDelete && selected && (
        <div className="modal d-block bg-dark bg-opacity-50" onClick={() => setShowDelete(false)}>
          <div className="modal-dialog modal-dialog-centered" onClick={(e) => e.stopPropagation()}>
            <div className="modal-content border-0 rounded-4 shadow">
              <div className="modal-header border-0">
                <h5 className="modal-title">¿Eliminar Monitoreo?</h5>
                <button type="button" className="btn-close" onClick={() => setShowDelete(false)}></button>
              </div>
              <div className="modal-footer border-0">
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
