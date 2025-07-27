import { useRef } from "react";
import bootstrap from "bootstrap/dist/js/bootstrap.bundle";
import { useState } from "react";
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';

export default function useProfilesController(Token) {
  const profilesTableRef = useRef(null);
  const permitsContainerRef = useRef(null);
  const permitsContainerEditRef = useRef(null);
  const [beforeEditProfile, setBeforeEditProfile] = useState(null);
    const permitsContainerViewRef = useRef(null);
    const [loading, setLoading] = useState(true);
    const [profileName, setProfileName] = useState("");
    const [permits, setPermits] = useState([]); 
    const [message, setMessage] = useState("");
  const [profiles, setProfiles] = useState([]);
  
    
   const ProfileTableGet = async () => {
    setLoading(true);
    try {
      const response = await fetch("http://localhost:3001/api/profile/profiles", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${Token}`,
        },
      });

      if (!response.ok) throw new Error("Error al obtener perfiles");

      const data = await response.json();
      setProfiles(data);
    } catch (error) {
      console.error("Error al obtener los datos:", error);
      
    } finally {
      setLoading(false);
    }
  };


  const handleAddPermits = () => {
    const modalEl = document.getElementById("register_profile");
    const modal = new bootstrap.Modal(modalEl);
    modal.show();
      setProfileName("");
      permitsContainerRef.current.innerHTML = "";
    setLoading(true);
    try {
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
      })
      .catch((error) => {
        console.error("Error al obtener los permisos:", error);
        handleMessage("Error al obtener los permisos");
      });
    }finally{
      setLoading(false);
    }

  };

  const handleSaveProfile = () => {
    const profile_name = document.getElementById("profile_name").value.trim();
    const selected_permits = [
      ...permitsContainerRef.current.querySelectorAll(
        "input[type=checkbox]:checked"
      ),
    ].map((cb) => cb.value);

    if (!profile_name) {
      handleMessage("El nombre no puede estar vacío");
      return;
    }
    if (!selected_permits.length) {
      handleMessage("Seleccione al menos un permiso");
      return;
    }

    fetch("http://localhost:3001/api/profile/profiles", {
      method: "POST",
      headers: { "Content-Type": "application/json" ,
        "Authorization": `Bearer ${Token}`},
      body: JSON.stringify({  profile_name, selected_permits: selected_permits }),
    })
      .then(() => {
         bootstrap.Modal.getInstance(
          document.getElementById("register_profile")
        ).hide();
        handleMessage("Perfil guardado correctamente");
        ProfileTableGet();
      })
      .catch(() => alert("Error al guardar"));
  };

  const handleEditPermits = (id,name) => {
    const modalEl = document.getElementById("edit_modal");
    const modal = new bootstrap.Modal(modalEl);
    modal.show();

    setProfileName("");
    permitsContainerEditRef.current.innerHTML = "";

    const profileNameEdit = document.getElementById("profile_name_edit");
    profileNameEdit.value = name;

    const profileIdEdit = document.getElementById("profile_id_edit");
    profileIdEdit.value = id;

    setLoading(true);
    try {
      fetch("http://localhost:3001/api/profile/permits", {
        method: "POST", 
        headers: { 
          "Content-Type": "application/json",
          "Authorization": `Bearer ${Token}` 
        },
        body: JSON.stringify({ id: id })
      })
      .then((res) => res.json())
      .then((permits) => {
          
          const groupNames = Object.keys(permits);
          const selectedPermits = [];
           
          groupNames.forEach((groupName) => {
            const groupPermits = Object.entries(permits[groupName]);
            groupPermits.forEach(([key, obj]) => {
              if (obj.value) {
                selectedPermits.push(key);
              }
            });
          });
          setBeforeEditProfile({name,permits: selectedPermits,
          });
                  
        const container = permitsContainerEditRef.current;
        container.innerHTML = "";

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
      })
      .catch((error) => {
        console.error("Error al obtener los permisos:", error);
        handleMessage("Error al obtener los permisos");
      });
    }finally{
      setLoading(false);
    }

  };

  const Allpermits = [
  "profiles_readprojects", "profiles_createprojects", "profiles_updateprojects", "profiles_deleteprojects",
  "profiles_readambientalplans", "profiles_createambientalplans", "profiles_updateambientalplans", "profiles_deleteambientalplans",
  "profiles_readmonitorings", "profiles_writemonitorings", "profiles_updatemonitorings", "profiles_deletemonitorings",
  "profiles_createactivities", "profiles_readactivities", "profiles_updateactivities", "profiles_deleteactivities",
  "profiles_createevents", "profiles_readevents", "profiles_updateevents", "profiles_deleteevents",
  "profiles_createusers", "profiles_readusers", "profiles_updateusers", "profiles_deleteusers",
  "profiles_createprofiles", "profiles_updateprofiles", "profiles_readprofiles", "profiles_deleteprofiles",
  "profiles_readactions",
  "profiles_readsupervisionperiod", "profiles_createsupervisionperiod", "profiles_deletesupervisionperiod", "profiles_updatesupervisionperiod",
  "profiles_readpermit", "profiles_createpermit", "profiles_updatepermit", "profiles_deletepermit",
  "profiles_readreminder", "profiles_createreminder", "profiles_deletereminder", "profiles_updatereminder"
];

  const handleEditProfile = () => {
  const profile_name = document.getElementById("profile_name_edit").value.trim();
  const selected_permits = [
      ...permitsContainerEditRef.current.querySelectorAll("input[type=checkbox]:checked")
    ].map(cb => cb.value);

    const permitObject = {};
    Allpermits.forEach(p => {
      permitObject[p] = selected_permits.includes(p);
    });

  if (!profile_name) {
    handleMessage("El nombre no puede estar vacío");
    return;
  }

  if (!selected_permits.length) {
    handleMessage("Seleccione al menos un permiso");
    return;
  }

  
  const nameChanged = beforeEditProfile?.name !== profile_name;
  const permitsChanged = JSON.stringify(beforeEditProfile?.permits.sort()) !== JSON.stringify(selected_permits.sort());

  if (!nameChanged && !permitsChanged) {
    handleMessage("No se realizaron cambios.");
    return;
  }

  const id = document.getElementById("profile_id_edit").value;
  
  const payload = {
    name: profile_name,
    permits: permitObject
  };

  fetch(`http://localhost:3001/api/profile/profiles/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${Token}`
    },
    body: JSON.stringify(payload)
  })
  .then((res) => res.json())
  .then((response) => {
    bootstrap.Modal.getInstance(
          document.getElementById("edit_modal")
        ).hide();
    handleMessage("Perfil Actualizado correctamente");
    ProfileTableGet();
  })
  .catch((error) => {
    console.error("Error al actualizar el perfil:", error);
    handleMessage("Error al actualizar el perfil");
  });
};


  const handleViewPermits = (id, name) => {
     const modalEl = document.getElementById("permits_view");
    const modal = new bootstrap.Modal(modalEl);
    modal.show();
      setProfileName("");
      permitsContainerViewRef.current.innerHTML = "";
      const profileNameEdit = document.getElementById("profile_name_view");
    profileNameEdit.value = name;
    setLoading(true);
    try {
      fetch("http://localhost:3001/api/profile/permits", {
        method: "POST", 
        headers: { 
          "Content-Type": "application/json",
          "Authorization": `Bearer ${Token}` 
        },
        body: JSON.stringify({ id: id })
      })
      .then((res) => res.json())
      .then((permits) => {
        const container = permitsContainerViewRef.current;
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
            } disabled>
              <label class="form-check-label">${obj.permit_name}</label>
            `;
            col.appendChild(div);
          });

          row.appendChild(col);
        });

        container.appendChild(row);
      })
      .catch((error) => {
        console.error("Error al obtener los permisos:", error);
        handleMessage("Error al obtener los permisos");
      });
    }finally{
      setLoading(false);
    }

  }
  const handleToggleState = (id, state) => {
    const nuevoEstado = state === "ACTIVE" ? "INACTIVE" : "ACTIVE";
    fetch(`http://localhost:3001/api/profile/profiles/${id}/state`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${Token}`
      },
      body: JSON.stringify({ state: nuevoEstado })
    })
      .then(() => {
        handleMessage(`Perfil cambiado correctamente`);
        ProfileTableGet();
      })
      .catch((error) => {
        console.error("Error al cambiar el estado del perfil:", error);
        handleMessage("Error al cambiar el estado del perfil");
      }
    );

  }

  const handleMessage = (msg) => {
  setMessage(msg);

  const modalEl = document.getElementById("information_container");
  const modal = new bootstrap.Modal(modalEl);
  modal.show();

  setTimeout(() => {
    modal.hide();
  }, 3000);
};

  return {
    ProfileTableGet,
    profilesTableRef,  
    permitsContainerRef,
    handleAddPermits,
    handleViewPermits,
    handleEditPermits,
    handleSaveProfile,
    profiles,
    permitsContainerViewRef,
    permitsContainerEditRef,
    handleEditProfile,
    profileName,
    setProfileName,
    permits,
    setPermits,
    message,
    setMessage,
    handleToggleState,
    loading
  };
}
