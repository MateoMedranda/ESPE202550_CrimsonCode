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
    const [profileData,setProfiledata]=useState([]);
    const UserTableGet = async () => {
    setLoading(true);
    try {
      const response = await fetch("https://sima-es01.onrender.com/api/user/users", {
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

    const handleAddUser = () => {
      const modalEl = document.getElementById("user_register");
      const modal = new bootstrap.Modal(modalEl);
      modal.show();
    };


const handleSaveUser = async () => {
  const email = document.getElementById("email").value.trim();

  if (!email) return handleMessage("El correo no puede estar vacío");
  if (!email.endsWith("@gmail.com")) return handleMessage("Debe ser un correo de Gmail");

  try {
    const response = await fetch("https://sima-es01.onrender.com/api/invite/send-email", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email }),
    });

    const result = await response.json();

    if (!response.ok) {
      return handleMessage(result.error || "Error inicializando el sistema");
    }

    window.location.href = result.url;
  } catch (error) {
    console.error("Error iniciando OAuth:", error);
    handleMessage("Error al enviar la invitación");
  }
};


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
        const response = await fetch('https://sima-es01.onrender.com/api/profile/profiles', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Authorization': `Bearer ${Token}`,
        },
        });

        if (!response.ok) throw new Error("Error en la respuesta del servidor");

        const data = await response.json();
        console.log(data);
        const selectElement = profilesEditContainerRef.current;
        if (selectElement) {
        selectElement.innerHTML = '<option value="seleccione">Seleccione...</option>';
        data.forEach((profile) => {
          if(profile.profiles_state !== "ACTIVE") return;
            const option = document.createElement("option");
            option.value = profile.profiles_id;
            option.textContent = profile.profiles_name;
            selectElement.appendChild(option);
        });

        const responseUser = await fetch(`https://sima-es01.onrender.com/api/user/users/${id}`, {
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
      const response = await fetch(`https://sima-es01.onrender.com/api/user/users/${beforeUserDatam.user_id}`, {
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
  
    const handleToggleUser = async (id,state) =>{
          const nuevoEstado = state === "ACTIVE" ? "INACTIVE" : "ACTIVE";
    fetch(`https://sima-es01.onrender.com/api/user/users/${id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${Token}`
      },
      body: JSON.stringify({ state: nuevoEstado })
    })
      .then(() => {
        handleMessage(`Perfil cambiado correctamente`);
        UserTableGet();
      })
      .catch((error) => {
        console.error("Error al cambiar el estado del perfil:", error);
        handleMessage("Error al cambiar el estado del perfil");
      }
    );
    }
  return {
    UserTableGet,
    handleAddUser,
    profilesContainerRef,
    user,
    handleSaveUser,
    handleEditUser,
    handleUpdateUser,
    handleToggleUser,
    loading,
    message,
    userTableRef,
    profilesEditContainerRef,
    message,
    profileData
  }

}