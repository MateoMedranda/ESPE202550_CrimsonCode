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
        $.ajax({
            url: '../PHP/profile_data_register.php',
            method: 'POST',
            data: {
                profile_name: profile_name, 
                "selected_permits[]": selected_permits, 
            },
            success: function(response) {

                if (response != "existing_user") {
                    message("Un perfil con ese nombre ya existe");
                } else {
                    message("Perfil generado correctamente!!!");
                }

            },
            error: function() {
                message("Error en el envio de datos!!!");
            }
        });
    });

    add_button.dataset.eventoAgregado = "true";
}

//Update profile data
let originalValues;
    $(document).on("click", ".edit-profile", function () {
        let profile = $(this).data("id");
        let name = $(this).data("name");
        document.getElementById("profile_name_edit").value = name;
        document.getElementById("profile_id_edit").value = profile;
        $.ajax({
            url: "../PHP/get_permits_UPDATE.php",
            method: "POST",
            data: { id: profile },
            success: function (response) {
                try {
                    let permits = JSON.parse(response);
                    let container = $("#permits_container_edit");
                    originalValues = { profile: name, permits: {} };
                    container.html('');

                    Object.entries(permits).forEach(([permitKey, permitObj]) => {
                        let permitLabel = permitObj.permit_name;
                        let permitValue = permitObj.value;

                        let checkboxHtml = `
                            <div class="form-check">
                                <input class="form-check-input" type="checkbox" name="permits[]" 
                                    value="${permitKey}" id="permit_${permitKey}" ${permitValue ? "checked" : ""}>
                                <label class="form-check-label" for="permit_${permitKey}">${permitLabel}</label>
                            </div>`;
                        originalValues.permits[permitKey] = permitValue;
                        container.append(checkboxHtml);
                        
                    });
                    $("#edit_modal").modal("show");
                } catch (error) {
                    console.error("Error al procesar los permisos:", error);
                }

            },
            error: function () {
                alert("Error al obtener permisos desde el servidor");
            },
        });
        

    });

    $("#update_profile").click(function () {
        let new_profile_name = document.getElementById("profile_name_edit").value.trim();
        let profile = document.getElementById("profile_id_edit").value;
        let selected_permits = {};
        $("input[name='permits[]']").each(function () {
        selected_permits[$(this).val()] = $(this).is(":checked") ? true : false;
        });

        const firstKey = Object.keys(selected_permits)[0];
        if (firstKey !== undefined) {
            delete selected_permits[firstKey];
        }

        const permisosSeleccionados = Object.values(selected_permits).some(value => value === true);
        if (!permisosSeleccionados) {
            message("Debe seleccionar al menos un permiso.");
            return;
        }

        if (new_profile_name === "") {
            message("El nombre del perfil no puede estar vacío.");
            return;
        }

        if (new_profile_name === originalValues.profile &&
            !permisosCambiaron(originalValues.permits, selected_permits)) {
            message("No ha realizado cambios");
            return;
        }
        $.ajax({
            url: "../PHP/update_profile.php",
            method: "POST",
            data: {
                profile_id: profile,
                name: new_profile_name,
                permits: JSON.stringify(selected_permits),
            },
            success: function (response) {
                message(response)
                
            },
            error: function () {
                message("Error en el envío de datos.");
            },
        });

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