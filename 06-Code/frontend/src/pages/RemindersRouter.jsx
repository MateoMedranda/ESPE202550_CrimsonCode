import React, { useEffect, useMemo, useState } from "react";
import { useAuth } from "../Context/AuthContext"; 

export default function RemindersRouter({ projectId, token: tokenProp }) {
  const auth = (() => {
    try {
      return useAuth?.();
    } catch {
      return {};
    }
  })();
  const token = tokenProp || auth?.token || "";

  const [reminders, setReminders] = useState([]);
  const [loading, setLoading] = useState(true);

  const [modal, setModal] = useState({ mode: null });
  const [selected, setSelected] = useState(null);

  const initialForm = useMemo(
    () => ({
      reminder_title: "",
      reminder_content: "",
      reminder_torememberdate: "",
      reminder_state: "Pendiente",
    }),
    []
  );
  const [formData, setFormData] = useState(initialForm);

  const API_BASE = `https://sima-es01.onrender.com`;
  const baseUrl = `${API_BASE}/api/reminder`;

  const reminderApi = {
    async list(projectId) {
      const res = await fetch(`${baseUrl}/${projectId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("Error al obtener recordatorios");
      return res.json();
    },
    async create(payload) {
      const res = await fetch(baseUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error("Error al crear recordatorio");
      return res.json().catch(() => ({}));
    },
    async update(id, payload) {
      const res = await fetch(`${baseUrl}/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });
      const result = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(result?.message || "Error al actualizar");
      return result;
    },
  };

  const fetchReminders = async () => {
    try {
      setLoading(true);
      const data = await reminderApi.list(projectId);
      setReminders(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error(err);
      setReminders([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!projectId || !token) return;
    fetchReminders();
  }, [projectId, token]);


  const handleChange = (e) => {
    setFormData((f) => ({ ...f, [e.target.name]: e.target.value }));
  };

  const openAdd = () => {
    setFormData(initialForm);
    setModal({ mode: "add" });
  };

  const openEdit = (r) => {
    setSelected(r);
    setFormData({
      reminder_title: r.reminder_title || "",
      reminder_content: r.reminder_content || "",
      reminder_torememberdate: r.reminder_torememberdate || "",
      reminder_state: r.reminder_state || "Pendiente",
    });
    setModal({ mode: "edit" });
  };

  const openDetails = (r) => {
    setSelected(r);
    setModal({ mode: "details" });
  };

  const closeModal = () => {
    setModal({ mode: null });
    setSelected(null);
  };

  const handleSave = async (e) => {
    e?.preventDefault?.();
    const reminder_registerdate = new Date().toISOString().split("T")[0];
    try {
      await reminderApi.create({
        ...formData,
        reminder_registerdate,
        project_id: projectId,
      });
      await fetchReminders();
      closeModal();
      setFormData(initialForm);
    } catch (err) {
      console.error(err);
      alert(err.message || "No se pudo crear el recordatorio");
    }
  };

  const handleUpdate = async (e) => {
    e?.preventDefault?.();
    if (!selected) return;
    try {
      await reminderApi.update(selected.reminder_id, {
        ...formData,
        project_id: projectId,
      });
      await fetchReminders();
      closeModal();
    } catch (err) {
      console.error(err);
      alert(err.message || "No se pudo actualizar el recordatorio");
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
          <button className="btn bg-info-subtle border-black" onClick={openAdd}>
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
        <div className="row g-3">
          {reminders.map((r) => (
            <div key={r.reminder_id} className="col-12 col-md-6 col-lg-6">
              <div className="reminder-pill d-flex align-items-center justify-content-between shadow-sm px-3 py-2 rounded-3 border">
                <span className="reminder-pill__title text-truncate">{r.reminder_title}</span>

                <div className="dropdown">
                  <button
                    className="btn btn-link text-dark p-0"
                    data-bs-toggle="dropdown"
                    aria-expanded="false"
                    title="Opciones"
                  >
                    <i className="bi bi-list" style={{ fontSize: "1.35rem" }}></i>
                  </button>
                  <ul className="dropdown-menu dropdown-menu-end">
                    <li>
                      <button className="dropdown-item" onClick={() => openDetails(r)}>
                        Mostrar detalles
                      </button>
                    </li>
                    <li>
                      <button className="dropdown-item" onClick={() => openEdit(r)}>
                        Editar
                      </button>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {(modal.mode === "add" || modal.mode === "edit") && (
        <ModalShell title={modal.mode === "add" ? "Nuevo Recordatorio" : "Editar Recordatorio"} onClose={closeModal}>
          <ReminderForm
            formData={formData}
            onChange={handleChange}
            onSubmit={modal.mode === "add" ? handleSave : handleUpdate}
            onCancel={closeModal}
          />
        </ModalShell>
      )}


      {modal.mode === "details" && selected && (
        <ModalShell title="Detalle del recordatorio" onClose={closeModal}>
          <div className="mb-3">
            <h4 className="mb-1">{selected.reminder_title}</h4>
            <p className="text-muted mb-2">
              <i className="bi bi-calendar2-date me-1"></i>
              Recordar el: <b>{selected.reminder_torememberdate}</b>
            </p>
            <hr />
            <p className="mb-0">{selected.reminder_content}</p>
          </div>
          <div className="d-flex justify-content-end">
            <button className="btn btn-secondary" onClick={closeModal}>
              Cerrar
            </button>
          </div>
        </ModalShell>
      )}
    </div>
  );
}


function ModalShell({ title, children, onClose }) {
  return (
    <div className="modal d-block bg-dark bg-opacity-50" onClick={onClose}>
      <div className="modal-dialog modal-lg" onClick={(e) => e.stopPropagation()}>
        <div className="modal-content bg-light rounded shadow border-0">
          <div className="modal-header">
            <h5 className="modal-title">{title}</h5>
            <button className="btn-close" onClick={onClose}></button>
          </div>
          <div className="modal-body">{children}</div>
        </div>
      </div>
    </div>
  );
}

function ReminderForm({ formData, onChange, onSubmit, onCancel }) {
  return (
    <form onSubmit={onSubmit}>
      <fieldset className="border-0">
        <div className="row mb-3">
          <div className="col-md-6 mb-3">
            <label className="form-label">Título *</label>
            <input
              name="reminder_title"
              type="text"
              className="form-control shadow-sm"
              value={formData.reminder_title}
              onChange={onChange}
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
              onChange={onChange}
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
            onChange={onChange}
            required
          />
        </div>
        <div className="mb-3">
          <label className="form-label">Estado *</label>
          <select
            name="reminder_state"
            className="form-select"
            value={formData.reminder_state}
            onChange={onChange}
          >
            <option>Pendiente</option>
            <option>Completado</option>
            <option>Vencido</option>
          </select>
        </div>
        <hr />
        <div className="d-flex justify-content-end gap-2">
          <button type="submit" className="btn px-4" style={{ backgroundColor: "#cde7d8" }}>
            Guardar
          </button>
          <button type="button" className="btn px-4" style={{ backgroundColor: "#f3caca" }} onClick={onCancel}>
            Cancelar
          </button>
        </div>
      </fieldset>
    </form>
  );
}
