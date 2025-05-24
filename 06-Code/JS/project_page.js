const btn_add_project_permission = document.getElementById('add_permission');
const modal_add_project_permission = document.getElementById('modal_add_project_permission');
const modal_update_project_permission = document.getElementById("modal_update_project_permission");
const btn_cancel_add_project_permission = document.getElementById('btn_cancel_add_project_permission');
const btn_cancel_update_project_permission = document.getElementById('btn_cancel_update_project_permission');
const btn_add_project_emp = document.getElementById('add_emp');
const modal_add_project_emp = document.getElementById('modal_add_project_EMP');
const modal_update_project_emp = document.getElementById('modal_update_project_EMP');
const btn_cancel_add_project_emp = document.getElementById('btn_cancel_add_project_EMP');
const btn_cancel_update_project_emp = document.getElementById('btn_cancel_update_project_EMP');
const btn_add_project_monitoring = document.getElementById('add_monitoring');
const modal_add_project_monitoring = document.getElementById('modal_add_project_monitoring');
const modal_update_project_monitoring = document.getElementById('modal_update_project_monitoring');
const btn_cancel_add_project_monitoring = document.getElementById('btn_cancel_add_project_monitoring');
const input_image = document.getElementById('project_monitoring_image');
const preview_div = document.getElementById('image_preview');
let project_permission_full_list = [];
let project_emp_full_list = [];
let project_monitoring_full_list = [];
const thumbnailImage = document.getElementById('thumbnail_image');
const modal = document.getElementById('image_modal');
const modalImage = document.getElementById('modal_image');
const closeBtn = document.getElementById('modal_close_btn');

const btn_close_monitoring = document.getElementById("btn_close_monitoring");
const monitoring_view_modal = document.getElementById("monitoring_view_modal");

get_full_project_permission_list();
get_full_project_emp_list();
get_full_project_monitoring_list();

btn_add_project_permission.addEventListener('click', () => {
    modal_add_project_permission.showModal();
});

btn_cancel_add_project_permission.addEventListener('click', () => {
    modal_add_project_permission.classList.add('closing');

    modal_add_project_permission.addEventListener('animationend', () => {
        modal_add_project_permission.classList.remove('closing');
        modal_add_project_permission.close();
    }, { once: true });
});

btn_close_monitoring.addEventListener('click', () => {
    monitoring_view_modal.classList.add('closing');

    monitoring_view_modal.addEventListener('animationend', () => {
        monitoring_view_modal.classList.remove('closing');
        monitoring_view_modal.close();
    }, { once: true });
});


btn_add_project_emp.addEventListener('click', () => {
    modal_add_project_emp.showModal();
});

btn_cancel_add_project_emp.addEventListener('click', () => {
    modal_add_project_emp.classList.add('closing');

    modal_add_project_emp.addEventListener('animationend', () => {
        modal_add_project_emp.classList.remove('closing');
        modal_add_project_emp.close();
    }, { once: true });
});

btn_add_project_monitoring.addEventListener('click', () => {
    modal_add_project_monitoring.showModal();
});

btn_cancel_add_project_monitoring.addEventListener('click', () => {
    modal_add_project_monitoring.classList.add('closing');

    modal_add_project_monitoring.addEventListener('animationend', () => {
        modal_add_project_monitoring.classList.remove('closing');
        modal_add_project_monitoring.close();
    }, { once: true });
});

function open_update_project_permission_modal() {
    modal_update_project_permission.showModal();
}

function open_update_project_emp_modal(){
    modal_update_project_emp.showModal();
}

function open_update_project_monitoring_modal(){
    modal_update_project_monitoring.showModal();
}

btn_cancel_update_project_permission.addEventListener('click', () => {
    modal_update_project_permission.classList.add('closing');

    modal_update_project_permission.addEventListener('animationend', () => {
       modal_update_project_permission.classList.remove('closing');
        modal_update_project_permission.close();
    }, { once: true });
});

btn_cancel_update_project_emp.addEventListener('click', () => {
    modal_update_project_emp.classList.add('closing');

    modal_update_project_emp.addEventListener('animationend', () => {
       modal_update_project_emp.classList.remove('closing');
        modal_update_project_emp.close();
    }, { once: true });
});

function load_preview_file(input_id,preview_id){
    let file_input = document.getElementById(input_id);
    let file_preview = document.getElementById(preview_id);
    const selected_file = file_input.files[0];

    file_preview.innerHTML = '';

    if (selected_file && selected_file.type === 'application/pdf') {
        const file_url = URL.createObjectURL(selected_file);

        const embed_element = document.createElement('embed');
        embed_element.src = file_url;
        embed_element.type = 'application/pdf';
        embed_element.width = '100%';
        embed_element.height = '100%';

        file_preview.appendChild(embed_element);
    } else {
        const error_message = document.createElement('p');
        error_message.textContent = 'Por favor selecciona un archivo PDF válido.';
        error_message.classList.add('text-danger', 'm-2');
        file_preview.appendChild(error_message);
    }
}

input_image.addEventListener('change', () => {
    const file = input_image.files[0];
    preview_div.innerHTML = '';

    if (file && file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onload = e => {
            const img = document.createElement('img');
            img.src = e.target.result;
            img.style.maxWidth = '100%';
            img.style.maxHeight = '100%';
            preview_div.appendChild(img);
        };
        reader.readAsDataURL(file);
    } else {
        preview_div.textContent = 'No se seleccionó una imagen válida';
    }
});

function get_full_project_permission_list() {
    fetch("../PHP/project_managment/project_permission_full_list.php")
        .then(response => response.json())
        .then(data => {
            console.log("Permissions were catch:", data);
            if (data.error) {
                console.error("[ERROR load_fill_project_list]: ", data.error);
            } else {
                project_permission_full_list = data;
                load_full_project_permission_list();
            }
        })
        .catch(error => console.error("Error en la solicitud fetch:", error));
}

function load_full_project_permission_list() {
    if (project_permission_full_list.length) {
        let project_permission_content_div = document.getElementById("project_permission_content_div");
        let string_divs = "";
        project_permission_full_list.forEach((permission) => {
            let new_div_permission = `
            <div class="project_permission_card col-3 m-auto bg-dark-subtle rounded mx-4">
                <div class="px-2">
                    <div class="d-flex justify-content-between align-items-center py-2 position-relative">
                        <div class="div_project_permission" onClick="open_project_permission(${permission.id},${permission.project})">
                            <h5 class="mb-0 title_project fw-bold">${permission.name}</h5>
                        </div>

                        <div class="dropdown">
                            <div class="project_options rounded" data-bs-toggle="dropdown" aria-expanded="false"
                                role="button">
                                <h2 class="mb-0"><i class="bi bi-list"></i></h2>
                            </div>
                            <ul class="dropdown-menu dropdown-menu-end shadow">
                                <li><a class="dropdown-item" onClick="update_project_permission(${permission.id},${permission.project})">Editar</a></li>
                                <li><a class="dropdown-item" onClick="delete_project_permission(${permission.id})">Eliminar</a></li>
                                <li><a class="dropdown-item" onClick="open_project_permission(${permission.id},${permission.project})">Ver detalles</a></li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>`;

            string_divs += new_div_permission;
        });
        project_permission_content_div.innerHTML = string_divs;
    }
}

function scrollPermissions(direction) {
    const slider = document.getElementById("project_permission_content_div");
    const scrollAmount = 250;
    slider.scrollBy({ left: direction * scrollAmount, behavior: 'smooth' });
}


function load_project_permission_to_update(permission_id, project_id) {
    console.log("permission_id:", permission_id, "project_id:", project_id);

    const form_data = new FormData();
    form_data.append("permission_id", permission_id);
    form_data.append("project_id", project_id);

    fetch("../PHP/project_managment/get_project_permission_by_id.php", {
        method: "POST",
        body: form_data
    })
    .then(response => response.json())
    .then(data => {
        console.log("permission catch:", data);

        if (data.error) {
            console.error("[ERROR]:", data.error);
        } else {
            const folder = document.getElementById("update_project_folder").value;

            document.getElementById("update_permission_id").value = permission_id;
            document.getElementById("update_project_permission_name").value = data.PERMIT_NAME;
            document.getElementById("update_project_permission_Description").value = data.PERMIT_DESCRIPTION;
            document.getElementById("update_permission_file_preview").innerHTML = `
                <embed src="../PROJECTS/${folder}/PERMITS/${data.PERMIT_ARCHIVE}" type="application/pdf" width="100%" height="100%"/>
            `;
        }
    })
    .catch(error => {
        console.error("Error en la solicitud fetch:", error);
    });
}

function update_project_permission(permission_id, project_id) {
    open_update_project_permission_modal();
    load_project_permission_to_update(permission_id, project_id);
}


function get_full_project_emp_list() {
    fetch("../PHP/project_managment/project_emp_full_list.php")
        .then(response => response.json())
        .then(data => {
            console.log("EMPs were catch:", data);
            if (data.error) {
                console.error("[ERROR load_fill_project_emp_list]: ", data.error);
            } else {
                project_emp_full_list = data;
                load_full_project_emp_list();
            }
        })
        .catch(error => console.error("Error en la solicitud fetch:", error));
}

function load_full_project_emp_list() {
    if (project_emp_full_list.length) {
        let project_emp_content_div = document.getElementById("project_emp_content_div");
        let string_divs = "";
        project_emp_full_list.forEach((emp) => {
            let new_div_emp = `
            <div class="project_plan_card col-3 m-auto rounded">
                    <div class="px-2 pt-2">
                        <div class="d-flex justify-content-between align-items-center">
                            <div onClick="open_emp(${emp.id})" class="div_project_emp">
                                <h5 class="mb-0 title_project">${emp.name}</h5>
                            </div>
                            <div class="dropdown">
                                <div class="project_options rounded" data-bs-toggle="dropdown" aria-expanded="false"
                                    role="button">
                                    <h2 class="mb-0"><i class="bi bi-list"></i></h2>
                                </div>
                                <ul class="dropdown-menu dropdown-menu-end shadow">
                                    <li><a class="dropdown-item" onClick="update_project_emp(${emp.project},${emp.id})">Editar</a></li>
                                    <li><a class="dropdown-item" onClick="delete_emp(${emp.id})">Eliminar</a></li>
                                    <li><a class="dropdown-item" onClick="open_emp(${emp.id})">Ver detalles</a></li>
                                </ul>
                            </div>
                        </div>
                        <hr>
                        <div class="plan_progress_container">
                            <div class="plan_progress_bar" id="plan_progress_bar">0%</div>
                        </div>
                    </div>
                </div>`;

            string_divs += new_div_emp;
        });
        project_emp_content_div.innerHTML = string_divs;
    }
}


function open_monitoring_view(project_id,monitoring_id) {
    monitoring_view_modal.showModal();
    load_project_monitoring_view(project_id, monitoring_id);
}

function load_project_monitoring_view(project_id, monitoring_id) {
    const form_data = new FormData();
    form_data.append("project_id", project_id);
    form_data.append("monitoring_id", monitoring_id);

    fetch("../PHP/project_managment/get_project_monitoring_by_id.php", {
        method: "POST",
        body: form_data
    })
        .then(response => response.json())
        .then(data => {
            if (data.error) {
                console.error("[ERROR]:", data.error);
                return;
            }

            const folder = document.getElementById("view_project_folder_monitoring").value;

            document.getElementById("view_monitoring_title").textContent = data.MONITORING_NAME || "-";
            document.getElementById("view_monitoring_description").textContent = data.MONITORING_DESCRIPTION || "-";
            document.getElementById("view_monitoring_observation").textContent = data.MONITORING_OBSERVATIONS || "-";

            const image_url = `../PROJECTS/${folder}/MONITORINGS/${data.MONITORING_FOLDER}/imagen_monitoreo/${data.MONITORING_IMAGE}`;
            document.getElementById("view_monitoring_image").src = image_url;

            const pdf_url = `../PROJECTS/${folder}/MONITORINGS/${data.MONITORING_FOLDER}/archivo_monitoreo/${data.MONITORING_EVIDENCE}`;
            document.getElementById("view_monitoring_pdf_viewer").src = pdf_url;

        })
        .catch(error => {
            console.error("Error loading monitoring view:", error);
        });
}

function get_full_project_monitoring_list() {
    fetch("../PHP/project_managment/project_monitoring_full_list.php")
        .then(response => response.json())
        .then(data => {
            console.log("Monitorings fetched:", data);
            if (data.error) {
                console.error("[ERROR get_full_project_monitoring_list]:", data.error);
            } else {
                project_monitoring_full_list = data;
                load_full_project_monitoring_list(); 
            }
        })
        .catch(error => console.error("Fetch error:", error));
}


function load_full_project_monitoring_list() {
    if (project_monitoring_full_list.length) {
        let project_monitoring_content_div = document.getElementById("project_monitoring_content_div");
        let string_divs = "";
        project_monitoring_full_list.forEach((monitoring) => {
            const folder = document.getElementById("update_project_folder_monitoring").value;
            let new_div_emp = `
           <div class="project_monitoring_card col-3 m-auto rounded mx-4">
                    <div class="px-2 pt-2">
                        <div class="d-flex justify-content-between align-items-center">
                            <div class="div_project_monitoring" onClick="open_monitoring_view(${monitoring.project}, ${monitoring.id})">
                                <h5 class="mb-0 title_project fw-bold">${monitoring.name}</h5>
                            </div>
                            <div class="dropdown">
                                <div class="project_options rounded" data-bs-toggle="dropdown" aria-expanded="false"
                                    role="button">
                                    <h2 class="mb-0"><i class="bi bi-list"></i></h2>
                                </div>
                                <ul class="dropdown-menu dropdown-menu-end shadow">
                                    <li><a class="dropdown-item" onClick="update_project_monitoring(${monitoring.project}, ${monitoring.id})">Editar</a></li>
                                    <li><a class="dropdown-item" onClick="delete_monitoring(${monitoring.id})">Eliminar</a></li>
                                    <li><a class="dropdown-item" onClick="open_monitoring_view(${monitoring.project}, ${monitoring.id})">Ver detalles</a></li>
                                </ul>
                            </div>
                        </div>
                        <div>
                            <h6 class="mt-2 text-truncate">${monitoring.description}</h6>
                        </div>
                        
                    </div>
                    <div class="div_project_image w-100 d-sm-none d-md-block" onclick="open_monitoring_view(${monitoring.project}, ${monitoring.id})"><img src="../PROJECTS/${folder}/MONITORINGS/${monitoring.folder}/imagen_monitoreo/${monitoring.image}" width="100%"></div>
                </div>`;

            string_divs += new_div_emp;
        });
        project_monitoring_content_div.innerHTML = string_divs;
    }
}

function scrollMonitorings(direction) {
    const slider = document.getElementById("project_monitoring_content_div");
    const scrollAmount = 250;
    slider.scrollBy({ left: direction * scrollAmount, behavior: 'smooth' });
}

function open_emp(plan_id){
    window.location.href = `../HTML/project_activities_managment.php?plan_id=${plan_id}`;
}

function update_project_emp(project_id, ambientalplan_id) {
    open_update_project_emp_modal(); 
    load_project_emp_to_update(project_id,ambientalplan_id);
}


function load_project_emp_to_update(project_id, ambientalplan_id) {
    console.log("Loading EMP:", ambientalplan_id, "for project:", project_id);

    const form_data = new FormData();
    form_data.append("project_id", project_id);
    form_data.append("ambientalplan_id", ambientalplan_id);

    fetch("../PHP/project_managment/get_project_emp_by_id.php", {
        method: "POST",
        body: form_data
    })
    .then(response => response.json())
    .then(data => {
        if (data.error) {
            console.error("[ERROR]:", data.error);
        } else {
            document.getElementById("update_project_id_emp").value = project_id
            document.getElementById("update_project_emp_name").value = data.AMBIENTALPLAN_NAME;
            document.getElementById("update_project_emp_description").value = data.AMBIENTALPLAN_DESCRIPTION;
            document.getElementById("update_emp_id").value = data.AMBIENTALPLAN_ID;
        }
    })
    .catch(error => {
        console.error("Fail in the fetch request:", error);
    });
}

function update_project_monitoring(project_id, monitoring_id) {
    open_update_project_monitoring_modal(); 
    load_project_monitoring_to_update(project_id,monitoring_id);
}

function load_project_monitoring_to_update(project_id, monitoring_id) {
    const formData = new FormData();
    formData.append("project_id", project_id);
    formData.append("monitoring_id", monitoring_id);

    fetch("../PHP/project_managment/get_project_monitoring_by_id.php", {
        method: "POST",
        body: formData
    })
    .then(response => response.json())
    .then(data => {
        if (data.error) {
            console.error("[ERROR]:", data.error);
            return;
        }

        const folder = document.getElementById("update_project_folder_monitoring").value;
        document.getElementById("update_monitoring_id").value = monitoring_id;
        document.getElementById("update_project_id_monitoring").value = project_id;
        document.getElementById("update_project_monitoring_name").value = data.MONITORING_NAME;
        document.getElementById("update_project_monitoring_description").value = data.MONITORING_DESCRIPTION;
        document.getElementById("update_project_monitoring_observation").value = data.MONITORING_OBSERVATIONS;

        const preview = document.getElementById("update_monitoring_image_preview");
        const imageUrl = `../PROJECTS/${folder}/MONITORINGS/${data.MONITORING_FOLDER}/imagen_monitoreo/${data.MONITORING_IMAGE}`;
        preview.innerHTML = `<img src="${imageUrl}" style="width: 100%; height: 100%; object-fit: cover;">`;
    })
    .catch(error => {
        console.error("Error en la carga del monitoreo:", error);
    });
}


thumbnailImage.addEventListener('click', () => {
    modal.style.display = 'flex';
    modalImage.src = thumbnailImage.src;
    modalImage.alt = thumbnailImage.alt;
});

closeBtn.addEventListener('click', () => {
    modal.style.display = 'none';
    modalImage.src = ''; 
});

modal.querySelector('.modal_overlay').addEventListener('click', () => {
    modal.style.display = 'none';
    modalImage.src = '';
});

let selected_permit_id_to_delete = null;

function delete_project_permission(permit_id) {
    console.log("Abriendo modal para eliminar permiso:", permit_id);
    selected_permit_id_to_delete = permit_id;
    const modal = new bootstrap.Modal(document.getElementById('delete_permit_modal'));
    modal.show();
}

document.addEventListener("DOMContentLoaded", () => {
    const confirm_delete_permit_btn = document.getElementById("confirm_delete_permit_btn");

    if (confirm_delete_permit_btn) {
        confirm_delete_permit_btn.addEventListener("click", () => {
            if (selected_permit_id_to_delete !== null) {
                const form_data = new FormData();
                form_data.append("permit_id", selected_permit_id_to_delete);

                fetch("../PHP/project_managment/permit_delete.php", {
                    method: "POST",
                    body: form_data
                })
                .then(response => response.json())
                .then(data => {
                    console.log("Respuesta al eliminar permiso:", data);
                    if (data.success) {
                        bootstrap.Modal.getInstance(document.getElementById('delete_permit_modal')).hide();
                        get_full_project_permission_list(); // recarga la lista
                    } else {
                        alert("Error al eliminar el permiso: " + (data.error || "Intenta nuevamente."));
                    }
                })
                .catch(error => {
                    console.error("Error al eliminar el permiso:", error);
                    alert("No se pudo eliminar el permiso.");
                });

                selected_permit_id_to_delete = null;
            }
        });
    }
});

let selected_emp_id_to_delete = null;

function delete_emp(emp_id) {
    console.log("Abriendo modal para eliminar EMP:", emp_id);
    selected_emp_id_to_delete = emp_id;
    const modal = new bootstrap.Modal(document.getElementById('delete_emp_modal'));
    modal.show();
}

document.addEventListener("DOMContentLoaded", () => {
    const confirm_delete_emp_btn = document.getElementById("confirm_delete_emp_btn");

    if (confirm_delete_emp_btn) {
        confirm_delete_emp_btn.addEventListener("click", () => {
            if (selected_emp_id_to_delete !== null) {
                const form_data = new FormData();
                form_data.append("emp_id", selected_emp_id_to_delete);

                fetch("../PHP/project_managment/emp_delete.php", {
                    method: "POST",
                    body: form_data
                })
                .then(response => response.json())
                .then(data => {
                    console.log("Respuesta al eliminar EMP:", data);
                    if (data.success) {
                        bootstrap.Modal.getInstance(document.getElementById('delete_emp_modal')).hide();
                        get_full_project_emp_list();
                    } else {
                        alert("Error al eliminar el EMP: " + (data.error || "Intenta nuevamente."));
                    }
                })
                .catch(error => {
                    console.error("Error al eliminar el EMP:", error);
                    alert("No se pudo eliminar el EMP.");
                });

                selected_emp_id_to_delete = null;
            }
        });
    }
});

let selected_monitoring_id_to_delete = null;

function delete_monitoring(monitoring_id) {
    console.log("Abriendo modal para eliminar monitoreo:", monitoring_id);
    selected_monitoring_id_to_delete = monitoring_id;
    const modal = new bootstrap.Modal(document.getElementById('delete_monitoring_modal'));
    modal.show();
}

document.addEventListener("DOMContentLoaded", () => {

    const confirm_delete_monitoring_btn = document.getElementById("confirm_delete_monitoring_btn");

    if (confirm_delete_monitoring_btn) {
        confirm_delete_monitoring_btn.addEventListener("click", () => {
            if (selected_monitoring_id_to_delete !== null) {
                const form_data = new FormData();
                form_data.append("monitoring_id", selected_monitoring_id_to_delete);

                fetch("../PHP/project_managment/monitoring_delete.php", {
                    method: "POST",
                    body: form_data
                })
                .then(response => response.json())
                .then(data => {
                    console.log("Respuesta al eliminar monitoreo:", data);
                    if (data.success) {
                        bootstrap.Modal.getInstance(document.getElementById('delete_monitoring_modal')).hide();
                        get_full_project_monitoring_list();
                    } else {
                        alert("Error al eliminar el monitoreo: " + (data.error || "Intenta nuevamente."));
                    }
                })
                .catch(error => {
                    console.error("Error al eliminar el monitoreo:", error);
                    alert("No se pudo eliminar el monitoreo.");
                });

                selected_monitoring_id_to_delete = null;
            }
        });
    }
});

function open_project_permission(permission_id, project_id) {
    const folder = document.getElementById("update_project_folder")?.value || "default_project";

    console.log(project_id);
    console.log(folder);
    console.log(permission_id);

    const formData = new FormData();
    formData.append("permission_id", permission_id);
    formData.append("project_id", project_id);

    fetch("../PHP/project_managment/get_project_permission_by_id.php", {
        method: "POST",
        body: formData
    })
    .then(response => response.json())
    .then(data => {
        if (data.error) {
            console.error("[ERROR]:", data.error);
            return;
        }

        document.getElementById("view_project_permission_name").value = data.PERMIT_NAME;
        document.getElementById("view_project_permission_description").value = data.PERMIT_DESCRIPTION;

        const pdf_url = `../PROJECTS/${folder}/PERMITS/${data.PERMIT_ARCHIVE}`;
        document.getElementById("view_permission_file_preview").innerHTML = `<embed src="${pdf_url}" type="application/pdf" width="100%" height="100%">`;

        document.getElementById("modal_view_project_permission").showModal();
    })
    .catch(error => {
        console.error("Error al cargar detalles del permiso:", error);
    });
}

function close_view_permission_modal() {
    const dialog = document.getElementById("modal_view_project_permission");
    dialog.classList.add("closing");
    dialog.addEventListener("animationend", () => {
        dialog.classList.remove("closing");
        dialog.close();
    }, { once: true });
}


//Get reminders list
function get_reminders_list() {
    const id = document.getElementById("project_id_reminders").value;
    fetch("../PHP/get_reminders.php", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id_project: id })
    })  
                 .then(response => response.json())
    .then(data => {

        let container =document.getElementById("reminders_carousel");
        container.innerHTML = ''; 
 
                   data.forEach((group, index) => {
                    const isActive = index === 0 ? ' active' : '';
                    const groupContainer = document.createElement("div");
                    groupContainer.className = `carousel-item${isActive}`;

                        const row = document.createElement("div");
                        row.className = "row justify-content-center align-items-center text-white p-4";
                        row.style.minHeight = "210px";

                    group.forEach(reminder => {
                        const col = document.createElement("div");
                        col.className = "col-md-4";
                        col.innerHTML = `
                            <div class="card bg-light text-black slide_card">
                                <div class="card-body">
                                    <h4 class="card-title">${reminder.REMINDER_TITLE}</h4>
                                    <h5 class="card-title">Para el: ${reminder.REMINDER_TOREMEMBERDATE}</h5>
                                    <input type="hidden" id="reminder_id_${reminder.REMINDER_ID}" value="${reminder.REMINDER_ID}">
                                    <input type="hidden" id="reminder_project_id_${reminder.REMINDER_ID}" value="${reminder.PROJECT_ID}">
                                    <input type="hidden" id="reminder_content_${reminder.REMINDER_ID}" value="${reminder.REMINDER_CONTENT}">
                                    <input type="hidden" id="reminder_torememberdate_${reminder.REMINDER_ID}" value="${reminder.REMINDER_TOREMEMBERDATE}">
                                    <input type="hidden" id="reminder_registerdate_${reminder.REMINDER_ID}" value="${reminder.REMINDER_REGISTERDATE}">
                                    <input type="hidden" id="reminder_tittle_${reminder.REMINDER_ID}" value="${reminder.REMINDER_TITLE}">

                                    <button class="btn btn-info btn_size" onclick="see(${reminder.REMINDER_ID})">Ver</button>
                                    <button class="btn btn-primary btn_size" onclick="modify(${reminder.REMINDER_ID})">Modificar</button>

                                </div>
                            </div>
                        `;

                        row.appendChild(col);
                    });

                    groupContainer.appendChild(row);
                    container.appendChild(groupContainer);
                });
            })
        .catch(error => {
            console.error("Error al recuperar recordatorios:", error);
            alert("Error al recuperar recordatorios.");
        });

}

document.addEventListener("DOMContentLoaded", () => {
    get_reminders_list();
    
    flatpickr("#reminder_day", {
        dateFormat: "Y-m-d",
        minDate: "today" 
        });
    flatpickr("#update_reminder_day", {
        dateFormat: "Y-m-d",
        minDate: "today" 
        });
    
});

document.getElementById("add_reminder").addEventListener("click", function(event) {
    var modal = new bootstrap.Modal(document.getElementById("insert_reminder_modal"));

    modal.show();
});

document.getElementById("insert_reminder").addEventListener("click", function(event) {
        event.preventDefault(); 
        
        let reminder_name = document.getElementById("reminder_title").value;
        let reminder_description = document.getElementById("reminder_content").value;
        let reminder_date = document.getElementById("reminder_day").value;
        let id = document.getElementById("project_id_reminders").value;

        if (reminder_name === "" ) {
            message("Por favor el campo del titulo no puede estar vacio");
            return;
        }
        if (reminder_description === "" ) {
            message("Por favor el campo descripcion no puede estar vacio");
            return;
        }
        if (reminder_date === "" ) {
            message("Por favor el campo fecha no puede estar vacio");
            return;
        }
        
        fetch("../PHP/reminder_data_register.php", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
        id_project: id,
        reminder_name : reminder_name,
        reminder_description : reminder_description,
        reminder_date : reminder_date
        })
    })  
        .then(response => response.json())
            .then(data => {
                message(data)
                get_reminders_list();
            })
        .catch(error => {
            console.error("Error al insertar el recordatorio:", error);
            alert("Error al insertar el recordatorio.");
        });
    });

let originalValues =[];
//update reminder
function modify(id) {
    let reminder_id = id;
    let project_id =document.getElementById(`reminder_project_id_${id}`).value;
    let title = document.getElementById(`reminder_tittle_${id}`).value;
    let content = document.getElementById(`reminder_content_${id}`).value;
    let date = document.getElementById(`reminder_torememberdate_${id}`).value;
    
    document.getElementById("update_reminder_id").value = reminder_id;
    document.getElementById("update_reminder_project_id").value = project_id;
    document.getElementById("update_reminder_title").value = title;
    document.getElementById("update_reminder_content").value = content;
    document.getElementById("update_reminder_day").value = date;

    let modal = new bootstrap.Modal(document.getElementById("update_reminder_modal"));
    modal.show();
}

document.getElementById("update_reminder").addEventListener("click",function(){
    event.preventDefault();
    let reminder_id = document.getElementById("update_reminder_id").value;
    let project_id = document.getElementById("update_reminder_project_id").value;
    let reminder_title = document.getElementById("update_reminder_title").value;
    let reminder_content = document.getElementById("update_reminder_content").value;
    let reminder_date = document.getElementById("update_reminder_day").value;
    if (reminder_title === "" ) {
            message("Por favor el campo del titulo no puede estar vacio");
            return;
        }
        if (reminder_content === "" ) {
            message("Por favor el campo descripcion no puede estar vacio");
            return;
        }
        if (reminder_date === "" ) {
            message("Por favor el campo fecha no puede estar vacio");
            return;
        }


    fetch("../PHP/reminder_data_update.php", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
            reminder_id:reminder_id,
            project_id:project_id,
            reminder_title:reminder_title,
            reminder_content:reminder_content,
            reminder_date:reminder_date
         })
    })  
                 .then(response => response.json())
    .then(data => {
            message(data)
            })
        .catch(error => {
            console.error("Error al recuperar recordatorios:", error);
            alert("Error al recuperar recordatorios.");
        });
})
//see reminder
function see(id) {
    let title = document.getElementById(`reminder_tittle_${id}`).value;
    let content = document.getElementById(`reminder_content_${id}`).value;
    let date = document.getElementById(`reminder_torememberdate_${id}`).value;

    document.getElementById("see_reminder_title").value = title;
    document.getElementById("see_reminder_content").value = content;
    document.getElementById("see_reminder_day").value = date;

    document.getElementById("see_reminder_title").readOnly = true;
    document.getElementById("see_reminder_content").readOnly = true;
    document.getElementById("see_reminder_day").readOnly = true;

    let modal = new bootstrap.Modal(document.getElementById("see_reminder_modal"));
    modal.show();
}
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