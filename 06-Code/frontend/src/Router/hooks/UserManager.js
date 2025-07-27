import { useRef, useState } from "react";
import bootstrap from "bootstrap/dist/js/bootstrap.bundle";
export default function UserManager(Token) {
    const userTableRef = useRef(null);
    const profilesContainerRef = useRef(null);
    const profilesEditContainerRef = useRef(null);
    const [beforeUserDatam, setBeforeUserData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [user, setUser] = useState([]);
    const [message, setMessage] = useState("");

    const UserTableGet = async () => {
    setLoading(true);
    try {
      const response = await fetch("http://localhost:3001/api/user/users", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${Token}`,
        },
      });

      if (!response.ok) throw new Error("Error al obtener usuarios");

        const data = await response.json();
        setUser(data);
    } catch (error) {
      console.error("Error al obtener los datos:", error);
      handleMessage("Error al obtener los datos de los usuarios");
    } finally {
      setLoading(false);
    }
  };

    const handleAddUser = async () => {

    profilesContainerRef.current.innerHTML = "";

      setLoading(true);
    try {
        const response = await fetch('http://localhost:3001/api/user/profiles', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Authorization': `Bearer ${Token}`,
        },
        });

        if (!response.ok) throw new Error("Error en la respuesta del servidor");

        const data = await response.json();

        const selectElement = profilesContainerRef.current;
        if (selectElement) {
        selectElement.innerHTML = '<option value="seleccione">Seleccione...</option>';
        data.forEach((profile) => {
            const option = document.createElement("option");
            option.value = profile.id;
            option.textContent = profile.name;
            selectElement.appendChild(option);
        });
        }

        const modalEl = document.getElementById("user_register");
        const modal = new bootstrap.Modal(modalEl);
        modal.show();

    } catch (error) {
        console.error("Error loading profiles:", error);
        alert("Error al obtener los datos de los perfiles.");
    } finally {
        setLoading(false);
            const modalEl = document.getElementById("user_register");
            const modal = new bootstrap.Modal(modalEl);
            modal.show();
    }
    }

    const handleSaveUser = async () => {
        const name = document.getElementById("name").value.trim();
  const surname = document.getElementById("surname").value.trim();
  const email = document.getElementById("email").value.trim();
  const born_date = document.getElementById("born_date").value.trim();
  const username = document.getElementById("user_name").value.trim();
  const personal_id = document.getElementById("personal_id").value.trim();
  const phone_number = document.getElementById("phone_number").value.trim();
  const user_profile = document.getElementById("user_profile").value;

  const password = personal_id;

  const regex = /^[A-Za-zÁÉÍÓÚáéíóúñÑ\s]+$/;
  const regex_phone = /^[0-9]{10}$/;

  if (!name) return handleMessage("El nombre no puede estar vacío");
  if (!regex.test(name)) return handleMessage("El nombre solo debe contener letras y espacios");

  if (!surname) return handleMessage("El apellido no puede estar vacío");
  if (!regex.test(surname)) return handleMessage("El apellido solo debe contener letras y espacios");

  if (!email) return handleMessage("El correo no puede estar vacío");

  if (!born_date) return handleMessage("La fecha de nacimiento no puede estar vacía");

  if (!phone_number) return handleMessage("El número de teléfono no puede estar vacío");
  if (!regex_phone.test(phone_number)) return handleMessage("El número debe tener 10 dígitos");

  if (!username) return handleMessage("El nombre de usuario no puede estar vacío");

  if (!personal_id) return handleMessage("La cédula no puede estar vacía");
  if (isNaN(personal_id)) return handleMessage("La cédula debe ser numérica");
  if (personal_id.length !== 10) return handleMessage("La cédula debe tener 10 dígitos");

  if (user_profile === "seleccione") return handleMessage("Debe seleccionar un perfil de usuario");

  try {

    const response = await fetch("http://localhost:3001/api/user/users", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${Token}`,
      },
      body: JSON.stringify({
        user_profile,
        name,
        surname,
        personal_id,
        born_date,
        email,
        phone_number,
        username,
        password,
      }),
    });

    const result = await response.json();

    if (!response.ok) {
      return handleMessage(result.error || "Error en el servidor");
    }

    handleMessage("Usuario registrado correctamente!");
    UserTableGet(); 
    bootstrap.Modal.getInstance(
              document.getElementById("user_register")
            ).hide();
            handleMessage("Usuario guardado correctamente");
            UserTableGet();
  } catch (error) {
    console.error("Error al registrar usuario:", error);
    handleMessage("Error al registrar usuario.");
  }

    }
    const handleMessage = (msg) => {
    setMessage(msg);
    const modalEl = document.getElementById("information_container");
    const modal = new bootstrap.Modal(modalEl);
    modal.show();
  
    setTimeout(() => {
      modal.hide();
    }, 3000);
  };

  const handleEditUser = async (id) => {
    profilesEditContainerRef.current.innerHTML = "";

      setLoading(true);
    try {
        const response = await fetch('http://localhost:3001/api/user/profiles', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Authorization': `Bearer ${Token}`,
        },
        });

        if (!response.ok) throw new Error("Error en la respuesta del servidor");

        const data = await response.json();

        const selectElement = profilesEditContainerRef.current;
        if (selectElement) {
        selectElement.innerHTML = '<option value="seleccione">Seleccione...</option>';
        data.forEach((profile) => {
            const option = document.createElement("option");
            option.value = profile.id;
            option.textContent = profile.name;
            selectElement.appendChild(option);
        });

        const responseUser = await fetch(`http://localhost:3001/api/user/users/${id}`, {
          method : "GET",
          headers : {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${Token}`
          }
          });
        
        if (!responseUser.ok) throw new Error("Error al obtener los datos del usuario");

        const user = await responseUser.json();
        setBeforeUserData(user);
        document.getElementById("user_id_edit").value = user.user_id;
        document.getElementById("name_edit").value = user.name;
        document.getElementById("surname_edit").value = user.surname;
        document.getElementById("username_edit").value = user.user;
        document.getElementById("user_profile_edit").value = user.profile_id;
        }
    } catch (error) {
        console.error("Error loading profiles:", error);
        alert("Error al obtener los datos de los perfiles.");
    } finally {
        setLoading(false);
        const modalEl = document.getElementById("user_edit");
        const modal = new bootstrap.Modal(modalEl);
        modal.show();
    }
  }

  const handleUpdateUser= async () => {

    const user_profile = document.getElementById("user_profile_edit").value;
    
    if (user_profile === "seleccione") return handleMessage("Debe seleccionar un perfil de usuario");
    if (beforeUserDatam.profile_id === user_profile) return handleMessage("No se han realizado cambios en el perfil del usuario");

    try {
      const response = await fetch(`http://localhost:3001/api/user/users/${beforeUserDatam.user_id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${Token}`,
        },
        body: JSON.stringify({
          profile: user_profile
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        return handleMessage(result.error || "Error en el servidor");
      }

      handleMessage("Usuario actualizado correctamente!");
      UserTableGet(); 
      bootstrap.Modal.getInstance(
                document.getElementById("user_edit")
              ).hide();
              handleMessage("Usuario actualizado correctamente");
              UserTableGet();
    } catch (error) {
      console.error("Error al actualizar usuario:", error);
      handleMessage("Error al actualizar usuario.");
    }
  }
  
  return {
    UserTableGet,
    handleAddUser,
    profilesContainerRef,
    user,
    handleSaveUser,
    handleEditUser,
    handleUpdateUser,
    loading,
    message,
    userTableRef,
    profilesEditContainerRef,
    message
  }

}