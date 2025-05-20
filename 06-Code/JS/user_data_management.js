var add_button = document.getElementById("add_user");
if (add_button&& !add_button.dataset.addedevent) {
    add_button.addEventListener("click", function () {
        getprofiles();
        var modal = new bootstrap.Modal(document.getElementById("user_register"));
        document.getElementById("name").value = "";
        document.getElementById("surname").value = "";
        document.getElementById("email").value = "";
        document.getElementById("born_date").value = "";
        document.getElementById("username").value = "";
        document.getElementById("personal_id").value = "";
        document.getElementById("user_profile").selectecdIndex = 0;
        modal.show();
    
    });

    add_button.dataset.addedevent = "true";
}


function getprofiles() {
        $.ajax({
        url: '../PHP/get_profiles_names.php',
        method: 'POST',
        data: {},
        success: function(response) {
           document.getElementById('user_profile').innerHTML = 
           '<option value="seleccione">Seleccione...</option>' + response;
        },
            error: function(xhr, status, error) {
            console.error("AJAX request failed: " + error);
            alert("Error al obtener los datos.");
            }   
        });
}

var insert_button = document.getElementById("submit_user");
if (insert_button) {
  insert_button.addEventListener("click", function (){
    
    let name = document.getElementById("name").value.trim();
    let surname = document.getElementById("surname").value.trim();
    let email = document.getElementById("email").value.trim();
    let born_date = document.getElementById("born_date").value.trim();
    let username = document.getElementById("username").value.trim();
    let personal_id = document.getElementById("personal_id").value;
    let phone_number = document.getElementById("phone_number").value.trim();
    let user_profile = document.getElementById("user_profile").value;
    let password = personal_id;
    let regex = /^[A-Za-zÁÉÍÓÚáéíóúñÑ]+$/;
    let regex_phone = /^[0-9]{10}$/;
    if (name === "" || surname === "" || email === "" || born_date === "" 
        || username === "" ||personal_id === "" || user_profile === "seleccione") {
        message("Todos los campos son obligatorios");
        return;
    }  
    
    if(test_users(username)){
        message("El usuario ya existe");
        return;
    }
    if (!regex_phone.test(phone_number)) {
        message("El numero de telefono solo debe contener numeros y de 10 digitos");
        return;
    }

    if (!regex.test(name)) {
        message("El Nombre solo debe contener letras y espacios");
        return;
    }

    if (!regex.test(surname)) {
        message("El Apellido solo debe contener letras y espacios");
        return;
    }

    if (personal_id.length != 10) {
        message("La cedula debe tener 10 digitos");
        return;
    }
    if (isNaN(personal_id)) {
        menssage("La cedula debe ser numerica");
        return;
    }

    $.ajax({
        url: '../PHP/user_data_register.php',
        method: 'POST',
        data: {
            username: username,
            password: password,
            name: name,
            phone_number: phone_number,
            surname: surname,
            user_profile: user_profile,
            email: email,
            born_date: born_date,
            personal_id: personal_id
        },
        success: function(response) {
            message("Usuario ingresado correctamente!!!");
        },
        error: function() {
            message("Error en el envio de datos!!!");
        }
    });
    });
}

function test_users(username){
    let value ;
    $.ajax({
        url: '../PHP/test_repeated_user.php',
        method: 'POST',
        data: {
            username: username
        },
        success: function(response) {
            if(response){
                value = false;
            }
            else{
                value = true;
            }
        },
        error: function() {
            message("Error en la consulta de datos!!!");
            value = false;
        }
    });

    return value;
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