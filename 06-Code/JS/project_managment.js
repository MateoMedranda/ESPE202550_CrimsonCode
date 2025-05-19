const btn_add_project = document.getElementById('add_project');
const modal_add_project = document.getElementById('modal_add_project');
const btn_cancel_add_project = document.getElementById('btn_cancel_add_project');
const project_image_file = document.getElementById('project_image_input');
const preview_image_box = document.getElementById('image_preview');

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


