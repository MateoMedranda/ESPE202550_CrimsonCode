//get profile table
$(document).ready(function () {
        document.getElementById("profile_name").value = "";
        $.ajax({
        url: '../PHP/get_profiles.php',
        method: 'POST',
        data: {},
        success: function(response) {
          document.getElementById("table_body").innerHTML = response;
        },
            error: function(xhr, status, error) {
            console.error("AJAX request failed: " + error);
            alert("Error al obtener los datos.");
            }   
        });
});


//get permits from database to show in modal
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
                            <input class="form-check-input" type="checkbox" name="permits[]" 
                                value="${permitKey}" id="permit_${permitKey}" ${permitvalue ? "checked" : ""}>
                            <label class="form-check-label" for="permit_${permitKey}">${permitLabel}</label>
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

//Save profile data from Form

if (add_button && !add_button.dataset.eventoAgregado) {
    document.getElementById("insert").addEventListener("click", function(event) {
        event.preventDefault(); 
        
        let profile_name = document.getElementById("profile_name").value;
        let letters_only = /^[A-Za-zÁÉÍÓÚáéíóúñÑ\s]+$/;

        if (profile_name === "") {
            message("Ingrese un nombre para el perfil");
            return;
        }

        if (!letters_only.test(profile_name)) {
            message("El Nombre del perfil solo debe contener letras y espacios");
            return;
        }

        let selected_permits= [];
        document.querySelectorAll("input[name='permits[]']:checked").forEach((checkbox) => {
            selected_permits.push(checkbox.value);
        });
        
        if (selected_permits.length === 0) {
            message("Debe seleccionar al menos un permiso para el perfil");
            return;
        }
        console.log("Permisos seleccionados:", selected_permits);
        $.ajax({
            url: '../PHP/profile_data_register.php',
            method: 'POST',
            data: {
                profile_name: profile_name, 
                "selected_permits[]": selected_permits, 
            },
            success: function(response) {
                message("Perfil generado correctamente!!!");

            },
            error: function() {
                message("Error en el envio de datos!!!");
            }
        });
    });

    add_button.dataset.eventoAgregado = "true";
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