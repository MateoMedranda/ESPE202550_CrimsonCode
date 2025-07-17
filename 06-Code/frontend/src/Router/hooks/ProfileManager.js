import { useRef } from "react";
import bootstrap from "bootstrap/dist/js/bootstrap.bundle";
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';

export default function useProfilesController() {
  const profilesTableRef = useRef(null);
  const permitsContainerRef = useRef(null);

  const ProfileTableGet = () => {
     const input = document.getElementById("profile_table");
      if (input) input.value = "";

  fetch("http://localhost:3001/api/profile/profiles", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },body:{
      token: localStorage.getItem("token"),
    }
  })
    .then((response) => response.text())
    .then((html) => {
      if (tableBodyRef.current) {
        tableBodyRef.current.innerHTML = html;
      }
    })
    .catch((error) => {
      console.error("Error al obtener los datos:", error);
      alert("Error al obtener los datos.");
    });
  }

  const handleAddProfile = () => {
    const modalEl = document.getElementById("register_profile");
    const modal = new bootstrap.Modal(modalEl);
    modal.show();

    const container = permitsContainerRef.current;
    container.innerHTML = "";

    fetch("http://localhost:3001/api/profile/permits", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ just_permits: true }),
    })
      .then((res) => res.json())
      .then((permits) => {
        Object.entries(permits).forEach(([groupName, groupPermits]) => {
          const group = document.createElement("div");
          group.innerHTML = `<h5>${groupName}</h5>`;
          Object.entries(groupPermits).forEach(([key, obj]) => {
            const div = document.createElement("div");
            div.className = "form-check";
            div.innerHTML = `
              <input class="form-check-input" type="checkbox" value="${key}" ${
              obj.value ? "checked" : ""
            } />
              <label class="form-check-label">${obj.permit_name}</label>
            `;
            group.appendChild(div);
          });
          container.appendChild(group);
        });
      });
  };

  const handleSaveProfile = () => {
    const name = document.getElementById("profile_name").value.trim();
    const selected = [
      ...permitsContainerRef.current.querySelectorAll(
        "input[type=checkbox]:checked"
      ),
    ].map((cb) => cb.value);

    if (!name) {
      alert("El nombre no puede estar vacío");
      return;
    }
    if (!selected.length) {
      alert("Seleccione al menos un permiso");
      return;
    }

    fetch("http://localhost:3001/api/profile/profiles", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, permits: selected }),
    })
      .then(() => {
        alert("Perfil creado!");
        bootstrap.Modal.getInstance(
          document.getElementById("register_profile")
        ).hide();

      })
      .catch(() => alert("Error al guardar"));
  };

  return {
    ProfileTableGet,
    permitsContainerRef,
    handleAddProfile,
    handleSaveProfile,
  };
}
