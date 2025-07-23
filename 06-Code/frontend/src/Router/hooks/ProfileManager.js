import { useRef } from "react";
import bootstrap from "bootstrap/dist/js/bootstrap.bundle";
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';

export default function useProfilesController(Token) {
  const profilesTableRef = useRef(null);
  const permitsContainerRef = useRef(null);
  
  const ProfileTableGet = () => {
     const input = document.getElementById("profile_table");
      if (input) input.value = "";

  fetch("http://localhost:3001/api/profile/profilesTable", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
        "Authorization": `Bearer ${Token}`
    }
  })
    .then((response) => response.text())
    .then((html) => {
      if (profilesTableRef.current) {
        profilesTableRef.current.innerHTML = html;
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
        headers: { 
          "Content-Type": "application/json",
          "Authorization": `Bearer ${Token}` 
        },
        body: JSON.stringify({ just_permits: true })
      })
      .then((res) => res.json())
      .then((permits) => {
        const container = permitsContainerRef.current;
        container.innerHTML = "";

        const groupNames = Object.keys(permits);

        const row = document.createElement("div");
        row.className = "row";

        groupNames.forEach((groupName) => {
          const col = document.createElement("div");
          col.className = "col-md-4 col-sm-6 mb-3"; 

          const title = document.createElement("h5");
          title.textContent = groupName;
          col.appendChild(title);

          const groupPermits = Object.entries(permits[groupName]);
          groupPermits.forEach(([key, obj]) => {
            const div = document.createElement("div");
            div.className = "form-check";
            div.innerHTML = `
              <input class="form-check-input" type="checkbox" value="${key}" ${
              obj.value ? "checked" : ""
            }>
              <label class="form-check-label">${obj.permit_name}</label>
            `;
            col.appendChild(div);
          });

          row.appendChild(col);
        });

        container.appendChild(row);
      });

  };

  const handleSaveProfile = () => {
    const profile_name = document.getElementById("profile_name").value.trim();
    const selected_permits = [
      ...permitsContainerRef.current.querySelectorAll(
        "input[type=checkbox]:checked"
      ),
    ].map((cb) => cb.value);

    if (!profile_name) {
      alert("El nombre no puede estar vacío");
      return;
    }
    if (!selected_permits.length) {
      alert("Seleccione al menos un permiso");
      return;
    }

    fetch("http://localhost:3001/api/profile/profiles", {
      method: "POST",
      headers: { "Content-Type": "application/json" ,
        "Authorization": `Bearer ${Token}`},
      body: JSON.stringify({  profile_name, selected_permits: selected_permits }),
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
    profilesTableRef,  
    permitsContainerRef,
    handleAddProfile,
    handleSaveProfile,
  };
}
