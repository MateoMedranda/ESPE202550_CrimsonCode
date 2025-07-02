const { UserServices } = require('../services/userServices');
const { generateToken } = require('../middleware/auth');
const bcrypt = require('bcrypt');
const pool = require('../models/db');

exports.getUsers = async (req, res) => {
  try {
    const { rows } = await UserServices.AllUsers();

    const users = rows.map(register => ({
      id: register.users_id,
      name: register.users_name,
      surname: register.users_surname,
      personal_id: register.users_personal_id,
      email: register.users_email,
      phone_number: register.users_phonenumber,
      state: register.users_state,
      profile_name: register.profiles_name
    }));

    res.json(users);
  } catch (err) {
    console.error('Error al obtener los usuarios:', err);
    res.status(500).send('Error');
  } 
};

exports.getUsersTable = async (req,res) =>
{
  try {
    const { rows } = await UserServices.AllUsers();

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
  try {
    const { rows } = await UserServices.getProfiles();
    const profiles = rows.map(register => ({
      id: register.profiles_id,
      name: register.profiles_name

    }));
    res.json(profiles);
  } catch (err) {
    console.error('Error al obtener perfiles:', err);
    res.status(500).send('Error');
  }
}

exports.getProfilesChecklist = async (req,res) =>
{  
  try {
    const { rows } = await UserServices.getProfiles();

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
  if (!id) {
    return res.status(400).send('ID de usuario no proporcionado');
  }
  try {
    const result = await UserServices.getUserData(id);
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
    if(user_profile === undefined ||user_profile === null || user_profile === ''){
      return res.status(400).json({ error: 'El perfil del usuario es obligatorio' });
    } 
    if(name === undefined ||name === null || name === ''){
      return res.status(400).json({ error: 'El nombre del usuario es obligatorio' });
    } 
    if(surname === undefined ||surname === null || surname === ''){
      return res.status(400).json({ error: 'El apellido del usuario es obligatorio' });
    } 
    if(personal_id === undefined ||personal_id === null || personal_id === ''){
      return res.status(400).json({ error: 'La cédula del usuario es obligatoria' });
    }
    if(born_date === undefined ||born_date === null || born_date === ''){
      return res.status(400).json({ error: 'La fecha de nacimiento del usuario es obligatoria' });
    }
    if(email === undefined ||email === null || email === ''){
      return res.status(400).json({ error: 'El correo electrónico del usuario es obligatorio' });
    }
    if(phone_number === undefined ||phone_number === null || phone_number === ''){
      return res.status(400).json({ error: 'El número de teléfono del usuario es obligatorio' });
    }
    if(username === undefined ||username === null || username === ''){
      return res.status(400).json({ error: 'El nombre de usuario es obligatorio'
      });
    }
    if(password === undefined ||password === null || password === ''){
      return res.status(400).json({ error: 'La contraseña del usuario es obligatoria'});
    } 

    const bornDateISO = born_date;

    
    const { rows } = await UserServices.CheckPersonalIdExistence(personal_id);

    if (rows.length > 0) {
      return res.status(409).json({ error: 'Ya existe un usuario con esa cédula' });
    }

    const result = await UserServices.CheckUsernameExistence(username);

    if (result.rows.length > 0) {
      return res.status(409).json({ error: 'Ya existe un usuario con ese nombre' });
    }

  const hashPassword = await bcrypt.hash(password, 10);

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

    await UserServices.createUser(values);

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
  if (!id || id === undefined || id === null || id === ''||isNaN(id)) {
    return res.status(400).json({ error: 'ID de usuario no proporcionado' });
  }

  if (!profile || profile === undefined || profile === null || profile === '') {
    return res.status(400).json({ error: 'Perfil de usuario no proporcionado'
    });
  }
  try {
    const values = [profile, id];
    const result = await UserServices.updateUser(values);

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
  if (!state || (state !== 'ACTIVE' && state !== 'INACTIVE')) {
    return res.status(400).json({ error: "Estado de usuario no proporcionado o inválido" });
  }
  if (!id || id === undefined || id === null || id === '' || isNaN(id)) {
    return res.status(400).json({ error: "ID de usuario no proporcionado" });
  }
  

  try {
    const userfind = await UserServices.getUserData(id);
    const row = userfind.rows[0];

    if (!row) {
      return res.status(404).send('Usuario no encontrado');
    }

    const values = [state, id];
    const result = await UserServices.toggleUser(values);

    if (result.rowCount === 0) {
      return res.status(404).json({ error: "Usuario no encontrado" });
    }

    res.status(200).json({ message: "Estado del usuario actualizado correctamente" });
  } catch (error) {
    console.error("Error al cambiar el estado del usuario:", error);
    res.status(500).json({ error: "Error en el servidor" });
  }
}

exports.loginUser = async (req, res) => {
  const { username, password } = req.body;

  try {
    const query = `
      SELECT * FROM users
      INNER JOIN profiles ON users.profiles_id = profiles.profiles_id
      WHERE users_users = $1
    `;

    const { rows } = await pool.query(query, [username]);

    if (rows.length === 0) {
      return res.status(401).json({ message: 'User not found' });
    }

    const user = rows[0];

    const isValidPassword = await bcrypt.compare(password, user.users_password);
    if (!isValidPassword) {
      return res.status(401).json({ message: 'Incorrect password' });
    }

    const payload = {
      id: user.users_id,
      username: user.users_users,
      name: user.users_name,
      profile: user.profiles_name
    };

    const token = generateToken(payload);

    res.json({ token, user: payload });

  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};