import React, { useEffect, useState } from "react";
import { useAuth } from "../Context/AuthContext";
export default function RemindersRouter({ projectId, Token }) {
  const [reminders, setReminders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAdd, setShowAdd] = useState(false);
  const [showEdit, setShowEdit] = useState(false);
  const [selected, setSelected] = useState(null);
  const {token} =useAuth();
  const [formData, setFormData] = useState({
    reminder_title: "",
    reminder_content: "",
    reminder_torememberdate: "",
    reminder_state: "Pendiente"
  });

  const baseUrl = `http://localhost:3001/api/reminder`;

  const fetchReminders = async () => {
    try {
      const res = await fetch(`${baseUrl}/${projectId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      setReminders(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Error al obtener recordatorios:", err);
      setReminders([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReminders();
  }, [projectId]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSave = async (e) => {
    e.preventDefault();
    const reminder_registerdate = new Date().toISOString().split("T")[0];
    try {
      const res = await fetch(baseUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          ...formData,
          reminder_registerdate,
          project_id: projectId
        })
      });
      if (!res.ok) throw new Error("Error al crear recordatorio");
      await fetchReminders();
      setShowAdd(false);
      setFormData({
        reminder_title: "",
        reminder_content: "",
        reminder_torememberdate: "",
        reminder_state: "Pendiente"
      });
    } catch (err) {
      console.error(err);
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`${baseUrl}/${selected.reminder_id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          title: formData.reminder_title,
          description: formData.reminder_content,
          date: formData.reminder_torememberdate,
          project_id: projectId
        })
      });
      const result = await res.json().catch(() => ({}));
        console.log("Respuesta del servidor:", result);
  
      if (!res.ok) throw new Error("Error al actualizar");
  
      await fetchReminders();
      setShowEdit(false);
      setSelected(null);
    } catch (err) {
      console.error(err);
    }
  };
  

  if (loading) return <h2>Cargando recordatorios...</h2>;

  return (
    <div>
      <div className="d-flex">
        <div className="col">
          <h3 className="title inter-title">Recordatorios</h3>
        </div>
        <div className="col text-end">
          <button className="btn bg-info-subtle border-black" onClick={() => setShowAdd(true)}>
            <i className="bi bi-plus-circle"></i> Agregar Recordatorio
          </button>
        </div>
      </div>
      <hr />
      {reminders.length === 0 ? (
        <div className="text-center text-muted">
          <i className="bi bi-bell-slash" style={{ fontSize: "2rem" }}></i>
          <p>No hay recordatorios registrados aún.</p>
        </div>
      ) : (
        <div className="row">
          {reminders.map((r) => (
            <div key={r.reminder_id} className="card m-2 p-3 shadow col-3">
              <h5 className="fw-bold">{r.reminder_title}</h5>
              <p>{r.reminder_content}</p>
              <small><b>Recordar el:</b> {r.reminder_torememberdate}</small>
              <div className="d-flex justify-content-end mt-2">
                <i className="bi bi-pencil-square mx-2 text-primary" style={{ cursor: "pointer" }}
                  onClick={() => {
                    setSelected(r);
                    setFormData({
                      reminder_title: r.reminder_title,
                      reminder_content: r.reminder_content,
                      reminder_torememberdate: r.reminder_torememberdate,
                      reminder_state: r.reminder_state
                    });
                    setShowEdit(true);
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
                  <h3 className="fw-bold">Nuevo Recordatorio</h3>
                  <hr />
                  <div className="row mb-3">
                    <div className="col-md-6 mb-3">
                      <label className="form-label">Título *</label>
                      <input
                        name="reminder_title"
                        type="text"
                        className="form-control shadow-sm"
                        value={formData.reminder_title}
                        onChange={handleChange}
                        required
                      />
                    </div>
                    <div className="col-md-6 mb-3">
                      <label className="form-label">Fecha a Recordar *</label>
                      <input
                        name="reminder_torememberdate"
                        type="date"
                        className="form-control shadow-sm"
                        value={formData.reminder_torememberdate}
                        onChange={handleChange}
                        required
                      />
                    </div>
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Contenido *</label>
                    <textarea
                      name="reminder_content"
                      className="form-control shadow-sm"
                      value={formData.reminder_content}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Estado *</label>
                    <select
                      name="reminder_state"
                      className="form-select"
                      value={formData.reminder_state}
                      onChange={handleChange}
                    >
                      <option>Pendiente</option>
                      <option>Completado</option>
                      <option>Vencido</option>
                    </select>
                  </div>
                  <hr />
                  <div className="d-flex justify-content-end gap-2">
                    <button type="submit" className="btn px-4" style={{ backgroundColor: '#cde7d8' }}>
                      Guardar
                    </button>
                    <button type="button" className="btn px-4" style={{ backgroundColor: '#f3caca' }}
                      onClick={() => setShowAdd(false)}>Cancelar</button>
                  </div>
                </fieldset>
              </form>
            </div>
          </div>
        </div>
      )}

      {showEdit && (
        <ModalForm
          title="Editar Recordatorio"
          formData={formData}
          setFormData={setFormData}
          onSubmit={handleUpdate}
          onClose={() => setShowEdit(false)}
        />
      )}
    </div>
  );
}

function ModalForm({ title, formData, setFormData, onSubmit, onClose }) {
  return (
    <div className="modal d-block bg-dark bg-opacity-50" onClick={onClose}>
      <div className="modal-dialog modal-lg" onClick={(e) => e.stopPropagation()}>
        <div className="modal-content bg-light rounded shadow border-0">
          <form onSubmit={onSubmit}>
            <fieldset className="border-0 p-4">
              <h3 className="fw-bold">{title}</h3>
              <hr />
              <div className="row mb-3">
                <div className="col-md-6">
                  <label className="form-label">Título *</label>
                  <input
                    type="text"
                    name="reminder_title"
                    className="form-control"
                    value={formData.reminder_title}
                    onChange={(e) => setFormData({ ...formData, reminder_title: e.target.value })}
                    required
                  />
                </div>
                <div className="col-md-6">
                  <label className="form-label">Fecha a Recordar *</label>
                  <input
                    type="date"
                    name="reminder_torememberdate"
                    className="form-control"
                    value={formData.reminder_torememberdate}
                    onChange={(e) => setFormData({ ...formData, reminder_torememberdate: e.target.value })}
                    required
                  />
                </div>
              </div>
              <div className="mb-3">
                <label className="form-label">Contenido *</label>
                <textarea
                  name="reminder_content"
                  className="form-control"
                  value={formData.reminder_content}
                  onChange={(e) => setFormData({ ...formData, reminder_content: e.target.value })}
                  required
                />
              </div>
              <div className="mb-3">
                <label className="form-label">Estado *</label>
                <select
                  name="reminder_state"
                  className="form-select"
                  value={formData.reminder_state}
                  onChange={(e) => setFormData({ ...formData, reminder_state: e.target.value })}
                >
                  <option>Pendiente</option>
                  <option>Completado</option>
                  <option>Vencido</option>
                </select>
              </div>
              <hr />
              <div className="d-flex justify-content-end gap-2">
                <button type="submit" className="btn px-4" style={{ backgroundColor: '#cde7d8' }}>Guardar</button>
                <button type="button" className="btn px-4" style={{ backgroundColor: '#f3caca' }} onClick={onClose}>Cancelar</button>
              </div>
            </fieldset>
          </form>
        </div>
      </div>
    </div>
  );
}
