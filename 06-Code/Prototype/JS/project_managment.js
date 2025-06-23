const btn_add_project = document.getElementById('add_project');
const btn_update_project = document.getElementById('update_project');
const modal_add_project = document.getElementById('modal_add_project');
const modal_update_project = document.getElementById('modal_update_project');
const btn_cancel_add_project = document.getElementById('btn_cancel_add_project');
const btn_cancel_update_project = document.getElementById('btn_cancel_update_project');
const project_image_file = document.getElementById('project_image_input');
const update_project_image_file = document.getElementById('update_project_image_input');
const preview_image_box = document.getElementById('image_preview');
const update_preview_image_box = document.getElementById('update_image_preview');
let project_full_list = [];

get_full_project_list();

btn_add_project.addEventListener('click', () => {
    modal_add_project.showModal();
});

btn_cancel_add_project.addEventListener('click', () => {
    modal_add_project.classList.add('closing');

    modal_add_project.addEventListener('animationend', () => {
        modal_add_project.classList.remove('closing');
        modal_add_project.close();
    }, { once: true });
});

btn_cancel_update_project.addEventListener('click', () => {
    modal_update_project.classList.add('closing');

    modal_update_project.addEventListener('animationend', () => {
        modal_update_project.classList.remove('closing');
        modal_update_project.close();
    }, { once: true });
});

function open_update_project_modal() {
    modal_update_project.showModal();
}

project_image_file.addEventListener('change', (event) => {
    const file = event.target.files[0];

    if (file && file.type.startsWith('image/')) {
        const reader = new FileReader();

        reader.onload = (e) => {
            preview_image_box.innerHTML = '';
            const img = document.createElement('img');
            img.src = e.target.result;
            img.style.width = '100%';
            img.style.height = '100%';
            img.style.objectFit = 'cover';
            img.style.borderRadius = '4px';
            preview_image_box.appendChild(img);
        };

        reader.readAsDataURL(file);
    } else {
        preview_image_box.innerHTML = '<p class="text-white text-center">Archivo no válido</p>';
    }
});


function get_full_project_list() {
    fetch("../PHP/project_managment/project_full_list.php")
        .then(response => response.json())
        .then(data => {
            console.log("Projects were catch:", data);
            if (data.error) {
                console.error("[ERROR load_fill_project_list]: ", data.error);
            } else {
                project_full_list = data;
                load_full_project_list();
            }
        })
        .catch(error => console.error("Error en la solicitud fetch:", error));
}

function load_full_project_list() {
    if (project_full_list.length) {
        let project_content_div = document.getElementById("project_content_div");
        let string_divs = "";
        project_full_list.forEach((project) => {
            const project_folder_name = project.name.replace(/[^A-Za-z0-9\-]/g, '_');
            let new_div_project = `
            <div class="col-md-4 col-sm-12 mt-4 mb-4">
                    <div class="card-proyecto col-md-10 col-sm-12 m-auto rounded p-0">
                        <div class="px-2 pt-2">
                            <div class="d-flex justify-content-between align-items-center">
                                <div class="div_project_title fade-link" onclick="open_project(${project.id})">
                                    <h5 class="mb-0 title_project fw-bold">${project.name}</h5>
                                    <hr class="m-0">
                                </div>

                                <!-- Dropdown project -->
                                <div class="dropdown">
                                    <div class="project_options rounded" data-bs-toggle="dropdown" aria-expanded="false"
                                        role="button">
                                        <h2 class="mb-0"><i class="bi bi-list"></i></h2>
                                    </div>
                                    <ul class="dropdown-menu dropdown-menu-end">
                                        <li><a class="sub_option dropdown-item" onclick="update_project(${project.id})">Editar</a></li>
                                        <li><a class="sub_option dropdown-item" onclick="delete_project(${project.id})">Eliminar</a></li>
                                        <li><a class="sub_option dropdown-item fade-link" onclick="open_project(${project.id})">Ver detalles</a></li>
                                    </ul>
                                </div>
                            </div>

                            <h6 class="mt-2">Inicio: ${project.begin_date}</h6>
                        </div>
                        <div class="div_project_image w-100 d-sm-none d-md-block fade-link" onclick="open_project(${project.id})"><img src="../PROJECTS/${project_folder_name}/imagen_proyecto/${project.image}" width="100%"></div>
                    </div>
                </div>
            `;

            string_divs += new_div_project;
        });
        project_content_div.innerHTML = string_divs;
    }
}


function load_project_to_update(project_id) {
    const form_data = new FormData();
    form_data.append("project_id", project_id);

    fetch("../PHP/project_managment/get_project_by_id.php", {
        method: "POST",
        body: form_data
    })
        .then(response => response.json())
        .then(data => {
            console.log("project catch:", data);

            if (data.error) {
                console.error("[ERROR]:", data.error);
            } else {
                const project_folder_name = data[0].PROJECT_NAME.replace(/[^A-Za-z0-9\-]/g, '_');

                document.getElementById("update_project_id").value = data[0].PROJECT_ID;
                document.getElementById("update_project_name_input").value = data[0].PROJECT_NAME;
                document.getElementById("update_project_begin_date").value = data[0].PROJECT_STARTDATE;
                document.getElementById("update_project_ubication").value = data[0].PROJECT_LOCATION;
                document.getElementById("update_project_description").value = data[0].PROJECT_DESCRIPTION;
                document.getElementById("update_image_preview").innerHTML = `<img style="width:100%;height:100%;object-fit:cover;border-radius:4px;" src="../PROJECTS/${project_folder_name}/imagen_proyecto/${data[0].PROJECT_IMAGE}">`;
            }
        })
        .catch(error => {
            console.error("Error en la solicitud fetch:", error);
        });
}

function update_project(project_id) {
    open_update_project_modal();
    load_project_to_update(project_id);
}

function open_project(project_id) {
    window.location.href = `../HTML/project_page.php?project_id=${project_id}`;
}

let selectedProjectIdToDelete = null;

function delete_project(project_id) {
    console.log("Abriendo modal para eliminar:", project_id); // DEBUG
    selectedProjectIdToDelete = project_id;

    const deleteModal = new bootstrap.Modal(document.getElementById('deleteProjectModal'));
    deleteModal.show();
}

document.addEventListener("DOMContentLoaded", () => {
    const deleteBtn = document.getElementById("confirmDeleteBtn");

    if (deleteBtn) {
        deleteBtn.addEventListener("click", () => {
            if (selectedProjectIdToDelete !== null) {
                const formData = new FormData();
                formData.append("project_id", selectedProjectIdToDelete);

                fetch("../PHP/project_managment/project_delete.php", {
                    method: "POST",
                    body: formData
                })
                .then(response => response.json())
                .then(data => {
                    console.log("Respuesta del servidor:", data);
                    if (data.success) {
                        bootstrap.Modal.getInstance(document.getElementById('deleteProjectModal')).hide();
                        get_full_project_list(); // Recarga los proyectos
                    } else {
                        alert("Error al eliminar: " + (data.error || "Error desconocido"));
                    }
                })
                .catch(error => {
                    console.error("Error en la solicitud:", error);
                    alert("No se pudo eliminar el proyecto.");
                });

                selectedProjectIdToDelete = null;
            }
        });
    }
});

