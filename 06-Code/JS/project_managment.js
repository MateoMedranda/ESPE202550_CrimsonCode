const btn_add_project = document.getElementById('add_project');
const modal_add_project = document.getElementById('modal_add_project');
const btn_cancel_add_project = document.getElementById('btn_cancel_add_project');
const project_image_file = document.getElementById('project_image_input');
const preview_image_box = document.getElementById('image_preview');
let  project_full_list = [];

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


function get_full_project_list(){
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

function load_full_project_list(){
    let project_content_div = document.getElementById("project_content_div");
    let string_divs = "";
    project_full_list.forEach((project) =>{
        let new_div_project = `
            <div class="col-md-4 col-sm-12 mt-4 mb-4">
                    <div class="card-proyecto col-md-10 col-sm-12 m-auto rounded p-0">
                        <div class="px-2 pt-2">
                            <div class="d-flex justify-content-between align-items-center">
                                <div class="div_project_title" onclick="open_project(${project.id})">
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
                                        <li><a class="dropdown-item" onclick="update_project(${project.id})">Editar</a></li>
                                        <li><a class="dropdown-item" onclick="delete_project(${project.id})">Eliminar</a></li>
                                        <li><a class="dropdown-item" onclick="open_project(${project.id})">Ver detalles</a></li>
                                    </ul>
                                </div>
                            </div>

                            <h6 class="mt-2">Inicio: ${project.begin_date}</h6>
                        </div>
                        <div class="div_project_image w-100 d-sm-none d-md-block" onclick="open_project(${project.id})"><img src="../${project.image}" width="100%"></div>
                    </div>
                </div>
            `;

        string_divs +=new_div_project;
    });
    project_content_div.innerHTML = string_divs;
}