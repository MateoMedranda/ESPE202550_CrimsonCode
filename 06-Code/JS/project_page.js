const file_input = document.getElementById('project_permission_file');
const file_preview = document.getElementById('file_preview');
const btn_add_project_permission = document.getElementById('add_permission');
const modal_add_project_permission = document.getElementById('modal_add_project_permission');
const btn_cancel_add_project_permission = document.getElementById('btn_cancel_add_project_permission');

const btn_add_project_emp = document.getElementById('add_emp');
const modal_add_project_emp = document.getElementById('modal_add_project_EMP');
const btn_cancel_add_project_emp = document.getElementById('btn_cancel_add_project_EMP');

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



file_input.addEventListener('change', function () {
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
});


