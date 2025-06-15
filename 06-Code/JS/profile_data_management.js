//get profile table
get_profiles_table();


function get_profiles_table() {
    document.getElementById("profile_name").value = "";
    fetch('http://localhost:3001/api/profiles/get', {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json'
    },
    body: JSON.stringify({})
    })
    .then(response => response.text())
    .then(html => {
        document.getElementById("table_body").innerHTML = html;
    })
    .catch(error => {
        console.error("Error al obtener los datos:", error);
        alert("Error al obtener los datos.");
    });
}

//get permits from database to show in modal
const add_button = document.getElementById("add_profile");
if (add_button && !add_button.dataset.addedevent) {
    add_button.addEventListener("click", () => {
        const modal = new bootstrap.Modal(document.getElementById("register_profile"));
        modal.show();
        document.getElementById("profile_name").value = "";

        fetch('http://localhost:3001/api/profiles/permits', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ just_permits: true })
            })
        .then(res => res.json())
        .then(permits => {
            const container = document.getElementById("permits_container");
            container.innerHTML = '';

            Object.entries(permits).forEach(([groupName, groupPermits]) => {
                const groupContainer = document.createElement("div");
                groupContainer.classList.add("permit-group");

                groupContainer.innerHTML += `<h5 class="mt-3">${groupName}</h5>`;
                const gridContainer = document.createElement("div");
                gridContainer.classList.add("permits-grid");

                Object.entries(groupPermits).forEach(([permitKey, permitObj]) => {
                    const checkboxHtml = `
                        <div class="form-check">
                            <input class="form-check-input" type="checkbox" name="permits[]"
                                value="${permitKey}" id="permit_${permitKey}" ${permitObj.value ? "checked" : ""}>
                            <label class="form-check-label" for="permit_${permitKey}">${permitObj.permit_name}</label>
                        </div>`;
                    gridContainer.innerHTML += checkboxHtml;
                });

                groupContainer.appendChild(gridContainer);
                container.appendChild(groupContainer);
            });
        })
        .catch(error => {
            console.error("Error al procesar los permisos:", error);
            alert("Error al procesar los permisos.");
        });
    });

    add_button.dataset.addedevent = "true";
}

//watch permits of a profile
document.addEventListener("click", function (event) {
    if (event.target.classList.contains("permits_view")) {
        const modal = new bootstrap.Modal(document.getElementById("permits_view"));
        modal.show();

        const id = event.target.dataset.id;
        const name = event.target.dataset.name;

        document.getElementById("profile_name_view").value = name;
        document.getElementById("profile_id_view").value = id;

        fetch('http://localhost:3001/api/profiles/permits', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ id })
            })
        .then(res => res.json())
        .then(permits => {
            const container = document.getElementById("permits_container_view");
            container.innerHTML = '';

            Object.entries(permits).forEach(([groupName, groupPermits]) => {
                const groupContainer = document.createElement("div");
                groupContainer.classList.add("permit-group");

                groupContainer.innerHTML += `<h5 class="mt-3">${groupName}</h5>`;
                const gridContainer = document.createElement("div");
                gridContainer.classList.add("permits-grid");

                Object.entries(groupPermits).forEach(([permitKey, permitObj]) => {
                    const checkboxHtml = `
                        <div class="form-check">
                            <input class="form-check-input" type="checkbox" disabled name="permits[]"
                                value="${permitKey}" id="permit_${permitKey}" ${permitObj.value ? "checked" : ""}>
                            <label class="form-check-label" for="permit_${permitKey}">${permitObj.permit_name}</label>
                        </div>`;
                    gridContainer.innerHTML += checkboxHtml;
                });

                groupContainer.appendChild(gridContainer);
                container.appendChild(groupContainer);
            });
        })
        .catch(err => console.error("Error al obtener permisos:", err));
    }
});

//Save profile data from Form
document.getElementById("insert").addEventListener("click", (event) => {
    event.preventDefault();

    const profile_name = document.getElementById("profile_name").value.trim();
    const regex = /^[A-Za-zÁÉÍÓÚáéíóúñÑ\s]+$/;

    if (!profile_name) return message("Ingrese un nombre para el perfil");
    if (!regex.test(profile_name)) return message("El Nombre del perfil solo debe contener letras y espacios");

    const selected_permits = [...document.querySelectorAll("input[name='permits[]']:checked")].map(cb => cb.value);
    if (selected_permits.length === 0) return message("Debe seleccionar al menos un permiso");

    const formData = new URLSearchParams();
    formData.append("profile_name", profile_name);
    selected_permits.forEach(p => formData.append("selected_permits", p));

    fetch('http://localhost:3001/api/profiles/create', {
        method: 'POST',
        headers: {'Content-Type': 'application/x-www-form-urlencoded'},
        body: formData.toString()
    })
    .then(response => response.text())
    .then(response => {
        if (response.trim() === "existing_user") {
            message("Un perfil con ese nombre ya existe");
        } else {
            message("Perfil generado correctamente!!!");
            get_profiles_table();
        }
        })
        .catch(() => {
            message("Error en el envio de datos!!!");
        });
});

var originalValues = {};
//Update profile data
document.addEventListener("click", function (event) {
    
    if (event.target.classList.contains("edit-profile")) {
        const id = event.target.dataset.id;
        const name = event.target.dataset.name;

        document.getElementById("profile_name_edit").value = name;
        document.getElementById("profile_id_edit").value = id;

        fetch('http://localhost:3001/api/profiles/permits', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ id })
            })
        .then(res => res.json())
        .then(permits => {
            const container = document.getElementById("permits_container_edit");
            container.innerHTML = '';
            originalValues = { profile: name, permits: {} };

            Object.entries(permits).forEach(([groupName, groupPermits]) => {
                const groupContainer = document.createElement("div");
                groupContainer.classList.add("permit-group");

                groupContainer.innerHTML += `<h5 class="mt-3">${groupName}</h5>`;
                const gridContainer = document.createElement("div");
                gridContainer.classList.add("permits-grid");

                Object.entries(groupPermits).forEach(([permitKey, permitObj]) => {
                    originalValues.permits[permitKey] = permitObj.value;

                    const checkboxHtml = `
                        <div class="form-check">
                            <input class="form-check-input" type="checkbox" name="permits_edit[]"
                                value="${permitKey}" id="permit_${permitKey}" ${permitObj.value ? "checked" : ""}>
                            <label class="form-check-label" for="permit_${permitKey}">${permitObj.permit_name}</label>
                        </div>`;
                    gridContainer.innerHTML += checkboxHtml;
                });

                groupContainer.appendChild(gridContainer);
                container.appendChild(groupContainer);
            });

            const modal = new bootstrap.Modal(document.getElementById("edit_modal"));
            modal.show();
        })
        .catch(error => console.error("Error al procesar permisos:", error));
    }
});

document.getElementById("update_profile").addEventListener("click", () => {
    const newName = document.getElementById("profile_name_edit").value.trim();
    const profile = document.getElementById("profile_id_edit").value;

    const selected_permits = {};
    document.querySelectorAll("input[name='permits_edit[]']").forEach(cb => {
        selected_permits[cb.value] = cb.checked;
    });

    const atLeastOne = Object.values(selected_permits).some(v => v);
    if (!atLeastOne) return message("Debe seleccionar al menos un permiso.");
    if (!newName) return message("El nombre del perfil no puede estar vacío.");

    const changed = newName !== originalValues.profile ||
        Object.keys(originalValues.permits).some(k => originalValues.permits[k] !== selected_permits[k]);

    if (!changed) return message("No ha realizado cambios");

    fetch('http://localhost:3001/api/profiles/update', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            profile_id: profile,
            name: newName,
            permits: selected_permits
        })
    })
    .then(res => res.text())
    .then(msg => {
        message("Perfil Acutalizado Correctamente");
        get_profiles_table();
    })
    .catch(() => message("Error en el envío de datos."));
});



function permisosCambiaron(original, actual) {
    let value = 0;
    let lenght = Object.keys(original).length;
    for (let key in original) {
        if (original[key] === actual[key]) {
            value++;
        }
    }

    if (value === lenght) {
        return false;
    }else {
        return true;
    }
}
//logic elimination
document.addEventListener("click", function (event) {
    if (event.target.classList.contains("toggle-state")) {
        const profile = event.target.dataset.id;
        const currentState = event.target.dataset.state;
        const newState = currentState === "ACTIVE" ? "INACTIVE" : "ACTIVE";

        fetch('http://localhost:3001/api/profiles/toggle', {
            method: 'POST',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body: new URLSearchParams({ profile, state: newState })
        })
        .then(res => res.text())
        .then(response => {
            if (response === "success") {
                message("El cambio de estado ha sido realizado!!!");
                get_profiles_table();
            } else {
                message("El perfil está asignado a un usuario, no se puede desactivar.");
            }
        }).catch(() => message("Error en el envío de datos!!!"));
        
    }
});



//message function
function message(msg) {
    var modal = bootstrap.Modal.getInstance(document.getElementById("information_container"));
    document.getElementById("message").innerHTML = msg;
    var modal = new bootstrap.Modal(document.getElementById("information_container"));
    modal.show();
    setTimeout(function() {
        modal.hide();
    }, 1000);
}