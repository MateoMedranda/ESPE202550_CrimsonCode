get_users();

function get_users() {
    document.getElementById("table_body").value = "";
    fetch('../PHP/get_user_list.php', {
    method: 'POST',
    headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
    },
    })
    .then(response => {
        
        if (!response.ok) {
            throw new Error("Error in the server response");
        }
        return response.text();
    }).then((data) => {
        document.getElementById("table_body").innerHTML = data;
    })
    .catch(error => {
        console.error("Error loading user list:", error);
        document.getElementById("table_body").innerHTML = "<tr><td colspan='6'>Error al cargar la lista de usuarios.</td></tr>";
    });
}

 var originalValues = {};
 document.addEventListener("click", function (event) {
    const editBtn = event.target.closest(".edit-user");
   if (editBtn) {
        const id = editBtn.dataset.id;
        const name = editBtn.dataset.name;
        const surname = editBtn.dataset.surname;
        const user = editBtn.dataset.user;
        const profile = editBtn.dataset.profile;

        get_profiles(document.getElementById('user_profile_edit'), profile);

        originalValues = {
            id: id,
            profile: profile
        };

        document.getElementById("user_id_edit").value = id;
        document.getElementById("name_edit").value = name;
        document.getElementById("surname_edit").value = surname;
        document.getElementById("username_edit").value = user;

        const modal = new bootstrap.Modal(document.getElementById("user_edit"));
        modal.show();
    }
});



    document.getElementById("update_user").addEventListener("click", function () {
        const id = document.getElementById("user_id_edit").value;
        const profile = document.getElementById("user_profile_edit").value;

        if (profile === originalValues.profile) {
            mensaje("No ha realizado cambios");
            timeout();
            return;  
        }
    fetch('../PHP/update_user.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            body: new URLSearchParams({
                id: id,
                profile: profile
            })
        })
        .then(response => {
            if (!response.ok) {
                throw new Error("Error en la respuesta del servidor");
            }
            return response.text();
        })
        .then(data => {
            message("Usuario Actualizado Correctamente!!!");
            get_users();
        })
        .catch(error => {
            console.error("Error:", error);
            message("Error en el envío de datos!!!");
        });
        });



var add_button = document.getElementById("add_user");
if (add_button&& !add_button.dataset.addedevent) {
    add_button.addEventListener("click", function () {
        get_profiles(document.getElementById('user_profile'),0);
        var modal = new bootstrap.Modal(document.getElementById("user_register"));
        reset();
        modal.show();
    });

    add_button.dataset.addedevent = "true";
}


function get_profiles(element, seting_value) {
    fetch('../PHP/get_profiles_names.php', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        }
    })
    .then(response => {
        if (!response.ok) {
            throw new Error("Error in the server response");
        }
        return response.text();
    })
    .then((data) => {
        element.innerHTML = 
           '<option value="seleccione">Seleccione...</option>' + data;
           element.value = seting_value;
    }).catch(error => {
        console.error("Error loading profiles:", error);
        alert("Error al obtener los datos de los perfiles.");
    });
}

function reset(){
        document.getElementById("name").value = "";
        document.getElementById("surname").value = "";
        document.getElementById("email").value = "";
        document.getElementById("born_date").value = "";
        document.getElementById("user_name").value = "";
        document.getElementById("personal_id").value = "";
        document.getElementById("phone_number").value = "";
        document.getElementById("user_profile").selectecdIndex = 0;
}

var insert_button = document.getElementById("submit_user");
if (insert_button) {
  insert_button.addEventListener("click", function (){
    
        let name = document.getElementById("name").value.trim();
        let surname = document.getElementById("surname").value.trim();
        let email = document.getElementById("email").value.trim();
        let born_date = document.getElementById("born_date").value.trim();
        let username = document.getElementById("user_name").value;
        let personal_id = document.getElementById("personal_id").value;
        let phone_number = document.getElementById("phone_number").value.trim();
        let user_profile = document.getElementById("user_profile").value;
        let password = personal_id;
        let regex = /^[A-Za-zÁÉÍÓÚáéíóúñÑ]+$/;
        let regex_phone = /^[0-9]{10}$/;
        console.log(name, surname, email, born_date, username, personal_id, phone_number, user_profile);

        if(name=== ""){
            message("El nombre no puede estar vacio");
            return;
        }
        if(surname === ""){
            message("El apellido no puede estar vacio");
            return;
        }
        if(email === ""){
            message("El correo no puede estar vacio");
            return;
        }
        if(born_date === ""){
            message("La fecha de nacimiento no puede estar vacia");
            return;
        }

        if(phone_number === ""){
            message("El numero de telefono no puede estar vacio");
            return;
        }

        if(username === ""){
            message("El usuario no puede estar vacio");
            return;
        }

        if(personal_id === ""){
            message("El numero de telefono no puede estar vacio");
            return;
        }
        if(user_profile === "seleccione"){
            message("Debe seleccionar un perfil de usuario");
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
        fetch('../PHP/user_data_register.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            body: new URLSearchParams({
                username: username,
                password: password,
                name: name,
                phone_number: phone_number,
                surname: surname,
                user_profile: user_profile,
                email: email,
                born_date: born_date,
                personal_id: personal_id
            })
        }).then(response => {
            if (!response.ok) {
                throw new Error("Error in the server response");
            }
            return response.text();
        }).then((data) => {
            message("Usuario ingresado correctamente!!!");
            get_users();
            reset();
        }).catch(error => {
            console.error("Error loading user list:", error);
            message("Error en el envio de datos!!!");
        });
    });
}

function test_users(username){
    let value ;
    fetch('../PHP/test_repeated_user.php', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: new URLSearchParams({
            username: username
        })
    }).then(response => {
        if (!response.ok) {
            throw new Error("Error in the server response");
        }
        return response.text();
    }).then((data) => {
        if(data){
                value = false;
            }
            else{
                value = true;
            }
        }).catch(error => {
        console.error("Error loading user list:", error);
        message("Error en la consulta de datos!!!");
    }
    );

    return value;
}

//logic delete user
document.addEventListener("click", function (event) {
  const toggleButton = event.target.closest(".toggle-state");
  if (!toggleButton) return;

  let id_user = toggleButton.dataset.id;
  let state = toggleButton.dataset.state;
  let new_state = state === "ACTIVE" ? "INACTIVE" : "ACTIVE";

  fetch('../PHP/logic_delete_users.php', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    body: `id=${encodeURIComponent(id_user)}&state=${encodeURIComponent(new_state)}`
  })
    .then(response => {
      if (!response.ok) throw new Error("Error en la respuesta del servidor");
      return response.text();
    })
    .then(() => {
      message("El cambio de estado ha sido realizado!!!");
      get_users();
    })
    .catch(() => {
      message("Error en el envío de datos!!!");
    });
});


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