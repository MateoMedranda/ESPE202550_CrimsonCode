var add_button = document.getElementById("add_profile");
if (add_button&& !add_button.dataset.addedevent) {
    add_button.addEventListener("click", function () {
        var modal = new bootstrap.Modal(document.getElementById("register_profile"));
        modal.show();
        document.getElementById("profile_name").value = "";
        $.ajax({
        url: '../PHP/get_permits.php',
        method: 'POST',
        data: {},
        success: function(response) {
            try {
                let permits = JSON.parse(response);
                let container = $("#permits_container");

                container.html(''); 

                 Object.entries(permits).forEach(([permitKey, permitObj]) => {
                    let permitLabel = permitObj.permit_name;
                    let permitvalue = permitObj.value;

                    let checkboxHtml = `
                        <div class="form-check">
                            <input class="form-check-input" type="checkbox" name="permisos[]" 
                                value="${permitKey}" id="permiso_${permitKey}" ${permitvalue ? "checked" : ""}>
                            <label class="form-check-label" for="permiso_${permitKey}">${permitLabel}</label>
                        </div>`;
                    
                    container.append(checkboxHtml);
                });

            } catch (e) {
                console.error("Error al procesar los permisos: " + e.message);
                alert("Error al procesar los permisos.");
            }
        },
            error: function(xhr, status, error) {
            console.error("AJAX request failed: " + error);
            alert("Error al obtener los datos.");
            }   
        });

    });

    add_button.dataset.addedevent = "true";
}