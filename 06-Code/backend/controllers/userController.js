const pool = require('../models/db');

exports.getUsers = async (req,res) =>
{
    const query = `
    SELECT DISTINCT u.*,p.profiles_name FROM users u JOIN profiles p
    on  u.profiles_id = p.profiles_id AND p.profiles_state = 'ACTIVE' 
  `;

  try {
    const { rows } = await pool.query(query);

    let tabla = '';

    rows.forEach(register => {
      const name = sanitize(register.users_name);
      const surname = sanitize(register.users_surname);
      const personal_id = sanitize(register.users_personal_id);
      const borndate = sanitize(register.users_borndate);
      const email = sanitize(register.users_email);
      const phone_number = sanitize(register.users_phonenumber)
      const user = sanitize(register.users_users);
      const state = sanitize(register.users_state);
      const user_id = sanitize(register.users_id);
      const profile_id = sanitize(register.profiles_id);
      const profile_name = sanitize(register.profiles_name)
      const textState = state === 'ACTIVE' ? 'Activo' : 'Inactivo';
      const btnEstado = state === 'ACTIVE' ? 'btn-danger' : 'btn-success';
      const iconoEstado = state === 'ACTIVE' ? 'bi-check-circle' : 'bi-x-circle';
      const accion = state === 'ACTIVE' ? 'Desactivar' : 'Activar';

      tabla += `
        <tr>
        <td>${user_id}</td>
        <td>${personal_id}</td>
        <td>${name} ${surname}</td>
        <td>${profile_name}</td>
        <td>${email}</td>  
        <td>${phone_number}</td>
        <td>${textState}</td>
          <td>
            <button class="btn btn-sm btn-primary me-1 edit-profile"
              data-id="${user_id}" data-name="${name}"
              data-surname="${surname}" data-personalId="${personal_id}"
              >
              <i class="bi bi-pencil"></i> Editar
            </button>
            <button class="btn btn-sm btn-info me-1 permits_view"
              data-id="${id}" data-name="${name}">
              <i class="bi bi-eye-fill"></i> Ver Permisos
            </button>
            <button class="btn btn-sm ${btnEstado} toggle-state"
              data-id="${id}" data-state="${state}">
              <i class="bi ${iconoEstado}"></i> ${accion}
            </button>
          </td>
        </tr>
      `;
    });

    res.send(tabla);
  } catch (err) {
    console.error('Error al obtener perfiles:', err);
    res.status(500).send('Error');
  }
}

function sanitize(str) {
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

exports.SearchUser = async (req,res) =>{
  
}

exports.getProfiles = async (req,res) =>
{

}
exports.createUser = async (req,res) =>
{

}
exports.updateUser = async (req,res) =>
{

}
exports.toggleUser = async (req,res) =>
{

}
