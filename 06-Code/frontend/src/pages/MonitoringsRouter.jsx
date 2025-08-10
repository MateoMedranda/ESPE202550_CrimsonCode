import React, { useEffect, useState } from "react";

export default function MonitoringsRouter({ projectId, token }) {
    const [monitorings, setMonitorings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showAdd, setShowAdd] = useState(false);
    const [showEdit, setShowEdit] = useState(false);
    const [showDelete, setShowDelete] = useState(false);
    const [selected, setSelected] = useState(null);

    const [formData, setFormData] = useState({
        monitoring_type: "",
        monitoring_description: "",
        monitoring_date: ""
    });

    const baseListUrl = `https://sima-es01.onrender.com/projects/${projectId}/monitorings`;
    const baseCrudUrl = `https://sima-es01.onrender.com/monitorings`;

    const fetchMonitorings = async () => {
        try {
            const res = await fetch(baseListUrl, {
                headers: { Authorization: `Bearer ${token}` }
            });
            const data = await res.json();
            setMonitorings(Array.isArray(data) ? data : []);
        } catch (err) {
            console.error("Error al obtener monitoreos:", err);
            setMonitorings([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchMonitorings();
    }, [projectId]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSave = async (e) => {
        e.preventDefault();
        try {
            const res = await fetch(baseCrudUrl, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify({ ...formData, project_id: projectId })
            });
            if (!res.ok) throw new Error("Error al crear monitoreo");
            await fetchMonitorings();
            setShowAdd(false);
            setFormData({ monitoring_type: "", monitoring_description: "", monitoring_date: "" });
        } catch (err) {
            console.error(err);
        }
    };

    const handleUpdate = async () => {
        try {
            const res = await fetch(`${baseCrudUrl}/${selected.monitoring_id}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify(formData)
            });
            if (!res.ok) throw new Error("Error al actualizar");
            await fetchMonitorings();
            setShowEdit(false);
        } catch (err) {
            console.error(err);
        }
    };

    const handleDelete = async () => {
        try {
            const res = await fetch(`${baseCrudUrl}/${selected.monitoring_id}`, {
                method: "DELETE",
                headers: { Authorization: `Bearer ${token}` }
            });
            if (!res.ok) throw new Error("Error al eliminar");
            await fetchMonitorings();
            setShowDelete(false);
        } catch (err) {
            console.error(err);
        }
    };

    if (loading) return <h2>Cargando monitoreos...</h2>;

    return (
        <div>
            <div className="d-flex">
                <div className="col">
                    <h3 className="title inter-title">Monitoreos</h3>
                </div>
                <div className="col text-end">
                    <button className="btn bg-info-subtle border-black" onClick={() => setShowAdd(true)}>
                        <i className="bi bi-plus-circle"></i> Agregar Monitoreo
                    </button>
                </div>
            </div>
            <hr />
            {Array.isArray(monitorings) && monitorings.length === 0 ? (
                <div className="text-center text-muted">
                    <i className="bi bi-camera-video-off" style={{ fontSize: "2rem" }}></i>
                    <p>No hay monitoreos registrados aún.</p>
                </div>
            ) : (
                <div className="row">
                    {monitorings.map((m) => (
                        <div key={m.monitoring_id} className="card m-2 p-3 shadow col-3">
                            <h5>{m.monitoring_type}</h5>
                            <p>{m.monitoring_description}</p>
                            <small><b>Fecha:</b> {m.monitoring_date}</small>
                            <div className="d-flex justify-content-end mt-2">
                                <i className="bi bi-pencil-square mx-2 text-primary" style={{ cursor: "pointer" }}
                                    onClick={() => {
                                        setSelected(m);
                                        setFormData({
                                            monitoring_type: m.monitoring_type,
                                            monitoring_description: m.monitoring_description,
                                            monitoring_date: m.monitoring_date
                                        });
                                        setShowEdit(true);
                                    }}></i>
                                <i className="bi bi-x-circle mx-2 text-danger" style={{ cursor: "pointer" }}
                                    onClick={() => {
                                        setSelected(m);
                                        setShowDelete(true);
                                    }}></i>
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
              <div className="col-md-6 mb-3">
                <label className="form-label">Tipo de Monitoreo: *</label>
                <input
                  name="monitoring_type"
                  type="text"
                  className="form-control shadow-sm"
                  value={formData.monitoring_type}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="col-md-6 mb-3">
                <label className="form-label">Fecha: *</label>
                <input
                  name="monitoring_date"
                  type="date"
                  className="form-control shadow-sm"
                  value={formData.monitoring_date}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>
            <div className="mb-3">
              <label className="form-label">Descripción: *</label>
              <textarea
                name="monitoring_description"
                className="form-control shadow-sm"
                value={formData.monitoring_description}
                onChange={handleChange}
                required
              />
            </div>
            <hr />
            <div className="d-flex justify-content-end gap-2">
              <button type="submit" className="btn px-4" style={{ backgroundColor: '#cde7d8' }}>
                Guardar
              </button>
              <button
                type="button"
                className="btn px-4"
                style={{ backgroundColor: '#f3caca' }}
                onClick={() => setShowAdd(false)}
              >
                Cancelar
              </button>
            </div>
          </fieldset>
        </form>
      </div>
    </div>
  </div>
)}
        </div>
    );
}

function ModalForm({ title, formData, setFormData, onSubmit, onClose }) {
    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content bg-light p-3 rounded shadow" onClick={(e) => e.stopPropagation()}>
                <h5>{title}</h5>
                <form onSubmit={onSubmit}>
                    <input type="text" className="form-control mb-2" placeholder="Tipo"
                           name="monitoring_type" value={formData.monitoring_type}
                           onChange={(e) => setFormData({ ...formData, monitoring_type: e.target.value })} required />
                    <textarea className="form-control mb-2" placeholder="Descripción"
                              name="monitoring_description" value={formData.monitoring_description}
                              onChange={(e) => setFormData({ ...formData, monitoring_description: e.target.value })} required />
                    <input type="date" className="form-control mb-2"
                           name="monitoring_date" value={formData.monitoring_date}
                           onChange={(e) => setFormData({ ...formData, monitoring_date: e.target.value })} required />
                    <button className="btn btn-success me-2" type="submit">Guardar</button>
                    <button className="btn btn-secondary" type="button" onClick={onClose}>Cancelar</button>
                </form>
            </div>
        </div>
    );
}

function ModalDelete({ name, onConfirm, onCancel }) {
    return (
        <div className="modal-overlay" onClick={onCancel}>
            <div className="modal-content bg-light p-3 rounded shadow" onClick={(e) => e.stopPropagation()}>
                <h5>¿Eliminar Monitoreo?</h5>
                <p><strong>{name}</strong></p>
                <button className="btn btn-danger me-2" onClick={onConfirm}>Eliminar</button>
                <button className="btn btn-secondary" onClick={onCancel}>Cancelar</button>
            </div>
        </div>
    );
}
