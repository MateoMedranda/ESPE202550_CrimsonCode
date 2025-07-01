const pool = require('../models/db');
const bcrypt = require('bcrypt');

exports.getUsers = async (req,res) =>
{
    const query = `
    SELECT DISTINCT u.*,p.profiles_name, p.profiles_id FROM users u JOIN profiles p
    on  u.profiles_id = p.profiles_id AND p.profiles_state = 'ACTIVE' 
  `;

  try {
    const { rows } = await pool.query(query);

    let tabla = '';

    rows.forEach(register => {
      const name = sanitize(register.users_name);
      const surname = sanitize(register.users_surname);
      const personal_id = sanitize(register.users_personal_id);
      const email = sanitize(register.users_email);
      const phone_number = sanitize(register.users_phonenumber)
      const state = sanitize(register.users_state);
      const user_id = sanitize(register.users_id);
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
            <button class="btn btn-sm btn-primary me-1 edit-user"
              data-id="${user_id}" data-name="${name}"
              data-surname="${surname}" data-personalId="${personal_id}"
              >
              <i class="bi bi-pencil"></i> Editar
            </button>
            <button class="btn btn-sm ${btnEstado} toggle-state"
              data-id="${user_id}" data-state="${state}">
              <i class="bi ${iconoEstado}"></i> ${accion}
            </button>
          </td>
        </tr>
      `;
    });

    res.send(tabla);
  } catch (err) {
    console.error('Error al obtener los usuarios:', err);
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

exports.getProfiles = async (req,res) =>
{
   const query = `
    SELECT DISTINCT p.profiles_name,p.profiles_id FROM users u JOIN profiles p
    on  u.profiles_id = p.profiles_id AND p.profiles_state = 'ACTIVE' 
  `;

  try {
    const { rows } = await pool.query(query);

    let select = '';

    rows.forEach(register => {
      const profile_id = sanitize(register.profiles_id);
      const profile_name = sanitize(register.profiles_name)

      select += `
        <option value="${profile_id}">${profile_name}</option>
      `;
    });

    res.send(select);
  } catch (err) {
    console.error('Error al obtener perfiles:', err);
    res.status(500).send('Error');
  }
}

exports.SearchUser = async (req,res) =>{
  const id = req.params.id;
    const query = `
    SELECT DISTINCT u.*,p.profiles_name FROM users u JOIN profiles p
    on  u.profiles_id = p.profiles_id AND p.profiles_state = 'ACTIVE' AND u.users_id = $1 
  `;
  
  try {

    const result = await pool.query(query, [id]);
    const row = result.rows[0];

    if (!row) {
      return res.status(404).send('Usuario no encontrado');
    }

      const name = sanitize(row.users_name);
      const surname = sanitize(row.users_surname);
      const personal_id = sanitize(row.users_personal_id);
      const borndate = sanitize(row.users_borndate);
      const email = sanitize(row.users_email);
      const phone_number = sanitize(row.users_phonenumber)
      const user = sanitize(row.users_users);
      const state = sanitize(row.users_state);
      const user_id = sanitize(row.users_id);
      const profile_id = sanitize(row.profiles_id);
      const profile_name = sanitize(row.profiles_name)
      const textState = state === 'ACTIVE' ? 'Activo' : 'Inactivo';

      const json = {
        user_id,
        personal_id,
        name,
        surname,
        profile_id,
        profile_name,
        email,
        borndate,
        user,
        phone_number,
        state: textState
      };


    res.send(json);
  } catch (err) {
    console.error('Error al los datos:', err);
    res.status(500).send('Error');
  }
}

exports.createUser = async (req,res) =>
{
  try {
    const {
      user_profile,
      name,
      surname,
      personal_id,
      born_date,
      email,
      phone_number,
      username,
      password
      
    } = req.body;

    const bornDateISO = born_date;

    const checkQuery = 'SELECT users_id FROM users WHERE users_personal_id = $1';
    const { rows } = await pool.query(checkQuery, [personal_id]);

    if (rows.length > 0) {
      return res.status(409).json({ error: 'Ya existe un usuario con esa cédula' });
    }

    const checkUserQuery = 'SELECT users_id FROM users WHERE users_users = $1';
    const result = await pool.query(checkUserQuery, [username]);

    if (result.rows.length > 0) {
      return res.status(409).json({ error: 'Ya existe un usuario con ese nombre' });
    }

  const hashPassword = await bcrypt.hash(password, 10);

    const query = `
      INSERT INTO users (
        profiles_id,
        users_name,
        users_surname,
        users_personal_id,
        users_borndate,
        users_email,
        users_phonenumber,
        users_users,
        users_password
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
    `;

    const values = [
      user_profile,
      name,
      surname,
      personal_id,
      bornDateISO,
      email,
      phone_number,
      username,
      hashPassword
    ];

    await pool.query(query, values);


    res.status(201).json({ message: 'Usuario registrado exitosamente' });
  } catch (error) {
    console.error('Error al registrar usuario:', error);
    res.status(500).json({ error: 'Error en el servidor' });
    
  }
    
}

exports.updateUser = async (req,res) =>
{
  const { id } = req.params;
  const { profile } = req.body;

  try {
    const query = 'UPDATE users SET profiles_id = $1 WHERE users_id = $2';
    const values = [profile, id];

    const result = await pool.query(query, values);

    if (result.rowCount === 0) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }

    res.status(200).json({ message: 'Usuario actualizado correctamente' });
  } catch (error) {
    console.error('Error al actualizar usuario:', error);
    res.status(500).json({ error: 'Error al actualizar el usuario' });
  }
}

exports.toggleUser = async (req,res) =>
{
  const { id } = req.params;
  const { state } = req.body;

  try {
    const query = `UPDATE users SET users_state = $1 WHERE users_id = $2`;
    const values = [state, id];

    const result = await pool.query(query, values);

    if (result.rowCount === 0) {
      return res.status(404).json({ error: "Usuario no encontrado" });
    }

    res.status(200).json({ message: "Estado del usuario actualizado correctamente" });
  } catch (error) {
    console.error("Error al cambiar el estado del usuario:", error);
    res.status(500).json({ error: "Error en el servidor" });
  }
}
