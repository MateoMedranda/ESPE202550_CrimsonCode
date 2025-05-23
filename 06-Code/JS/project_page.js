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
            <div class="project_permission_card col-3 m-auto bg-dark-subtle rounded">
                <div class="px-2">
                    <div class="d-flex justify-content-between align-items-center py-2 position-relative">
                        <div class="div_project_permission" onClick="open_project_permission(${permission.id})">
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
                                <li><a class="dropdown-item" onClick="open_project_permission(${permission.id})">Ver detalles</a></li>
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
           <div class="project_monitoring_card col-3 m-auto rounded">
                    <div class="px-2 pt-2">
                        <div class="d-flex justify-content-between align-items-center">
                            <div class="div_project_monitoring" onClick="open_monitoring(${monitoring.id})">
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
                                    <li><a class="dropdown-item" onClick="open_monitoring(${monitoring.id})">Ver detalles</a></li>
                                </ul>
                            </div>
                        </div>
                        <div>
                            <h6 class="mt-2 text-truncate">${monitoring.description}</h6>
                        </div>
                        
                    </div>
                    <div class="div_project_image w-100 d-sm-none d-md-block" onclick="open_monitoring(${monitoring.id})"><img src="../PROJECTS/${folder}/MONITORINGS/${monitoring.folder}/imagen_monitoreo/${monitoring.image}" width="100%"></div>
                </div>`;

            string_divs += new_div_emp;
        });
        project_monitoring_content_div.innerHTML = string_divs;
    }
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

