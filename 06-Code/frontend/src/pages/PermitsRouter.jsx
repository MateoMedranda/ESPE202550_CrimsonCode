import React, { useState, useEffect } from "react";

export default function PermitsRouter({ projectId, token }) {
  const [permits, setPermits] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAdd, setShowAdd] = useState(false);
  const [showEdit, setShowEdit] = useState(false);
  const [showDelete, setShowDelete] = useState(false);
  const [selected, setSelected] = useState(null);

  const [formData, setFormData] = useState({
    permit_name: "",
    permit_description: ""
  });

  const baseUrl = `https://sima-es01.onrender.com/projects/${projectId}/permits`;
  const permitActionsUrl = `https://sima-es01.onrender.com/permits`;

  const fetchPermits = async () => {
    try {
      const res = await fetch(baseUrl, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setPermits(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Error al obtener permisos:", err);
      setPermits([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPermits();
  }, [projectId]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(permitActionsUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ ...formData, project_id: projectId }),
      });

      if (!res.ok) throw new Error("Error al crear permiso");

      await fetchPermits();
      setShowAdd(false);
      setFormData({ permit_name: "", permit_description: "" });
    } catch (err) {
      console.error(err);
    }
  };

  const handleUpdate = async () => {
    try {
      const res = await fetch(`${permitActionsUrl}/${selected.permit_id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      if (!res.ok) throw new Error("Error al actualizar permiso");

      await fetchPermits();
      setShowEdit(false);
    } catch (err) {
      console.error(err);
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
    }
  };

  if (loading) return <h2>Cargando permisos...</h2>;

  return (
    <div>
      <div className="d-flex">
        <div className="col">
          <h3 className="title inter-title">Permisos</h3>
        </div>
        <div className="col text-end">
          <button className="btn bg-info-subtle border-black" onClick={() => setShowAdd(true)}>
            <i className="bi bi-plus-circle"></i> Agregar Permiso
          </button>
        </div>
      </div>
      <hr />

      {Array.isArray(permits) && permits.length === 0 ? (
        <div className="text-center text-muted">
          <i className="bi bi-shield-slash" style={{ fontSize: "2rem" }}></i>
          <p>No hay permisos registrados aún.</p>
        </div>
      ) : (
        <div className="row">
          {permits.map((p) => (
            <div key={p.permit_id} className="card m-2 p-3 shadow col-3">
              <h5>{p.permit_name}</h5>
              <p>{p.permit_description}</p>
              <div className="d-flex justify-content-end">
                <i
                  className="bi bi-pencil-square mx-2 text-primary"
                  style={{ cursor: "pointer" }}
                  onClick={() => {
                    setSelected(p);
                    setFormData({
                      permit_name: p.permit_name,
                      permit_description: p.permit_description
                    });
                    setShowEdit(true);
                  }}
                ></i>
                <i
                  className="bi bi-x-circle mx-2 text-danger"
                  style={{ cursor: "pointer" }}
                  onClick={() => {
                    setSelected(p);
                    setShowDelete(true);
                  }}
                ></i>
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


      {/* Modal Editar */}
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
                <div className="text-end">
                  <button className="btn btn-warning me-2" onClick={handleUpdate}>Actualizar</button>
                  <button className="btn btn-secondary" onClick={() => setShowEdit(false)}>Cancelar</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal Eliminar */}
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
