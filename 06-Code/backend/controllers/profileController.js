const db = require('../models/db');

exports.getProfiles = async (req, res) => {
  const query = `
    SELECT DISTINCT PROFILES_NAME, PROFILES_STATE, PROFILES_ID
    FROM profiles
  `;

  db.query(query, (err, results) => {
    if (err) {
      console.error('Error al obtener perfiles:', err);
      return res.status(500).send('Error');
    }

    let tabla = '';

    results.forEach(register => {
      const name = sanitize(register.PROFILES_NAME);
      const state = sanitize(register.PROFILES_STATE);
      const id = sanitize(register.PROFILES_ID);
      const estadoTexto = state === 'ACTIVE' ? 'Activo' : 'Inactivo';
      const btnEstado = state === 'ACTIVE' ? 'btn-danger' : 'btn-success';
      const iconoEstado = state === 'ACTIVE' ? 'bi-check-circle' : 'bi-x-circle';
      const accion = state === 'ACTIVE' ? 'Desactivar' : 'Activar';

      tabla += `
        <tr>
          <td>${name}</td>
          <td>${estadoTexto}</td>
          <td>
            <button class="btn btn-sm btn-primary me-1 edit-profile"
              data-id="${id}"
              data-name="${name}">
              <i class="bi bi-pencil"></i> Editar
            </button>
            <button class="btn btn-sm btn-info me-1 permits_view"
              data-id="${id}"
              data-name="${name}">
              <i class="bi bi-eye-fill"></i> Ver Permisos
            </button>
            <button class="btn btn-sm ${btnEstado} toggle-state"
              data-id="${id}"
              data-state="${state}">
              <i class="bi ${iconoEstado}"></i> ${accion}
            </button>
          </td>
        </tr>
      `;
    });

    res.send(tabla);
  });
};

function sanitize(str) {
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

const permitsGroups = {
  "PROFILES_READPROJECTS": "Proyectos",
  "PROFILES_CREATEPROJECTS": "Proyectos",
  "PROFILES_UPDATEPROJECTS": "Proyectos",
  "PROFILES_DELETEPROJECTS": "Proyectos",
  "PROFILES_READAMBIENTALPLANS": "Planes Ambientales",
  "PROFILES_CREATEAMBIENTALPLANS": "Planes Ambientales",
  "PROFILES_UPDATEAMBIENTALPLANS": "Planes Ambientales",
  "PROFILES_DELETEAMBIENTALPLANS": "Planes Ambientales",
  "PROFILES_READMONITORINGS": "Monitoreos",
  "PROFILES_WRITEMONITORINGS": "Monitoreos",
  "PROFILES_UPDATEMONITORINGS": "Monitoreos",
  "PROFILES_DELETEMONITORINGS": "Monitoreos",
  "PROFILES_READACTIVITIES": "Actividad",
  "PROFILES_CREATEACTIVITIES": "Actividad",
  "PROFILES_UPDATEACTIVITIES": "Actividad",
  "PROFILES_DELETEACTIVITIES": "Actividad",
  "PROFILES_CREATEEVENTS": "Evento",
  "PROFILES_READEVENTS": "Evento",
  "PROFILES_UPDATEEVENTS": "Evento",
  "PROFILES_DELETEEVENTS": "Evento",
  "PROFILES_CREATEUSERS": "Usuarios",
  "PROFILES_READUSERS": "Usuarios",
  "PROFILES_UPDATEUSERS": "Usuarios",
  "PROFILES_DELETEUSERS": "Usuarios",
  "PROFILES_CREATEPROFILES": "Perfiles",
  "PROFILES_UPDATEPROFILES": "Perfiles",
  "PROFILES_READPROFILES": "Perfiles",
  "PROFILES_DELETEPROFILES": "Perfiles",
  "PROFILES_READACTIONS": "Acciones",
  "PROFILES_READSUPERVISIONPERIOD": "Periodo de Supervision",
  "PROFILES_CREATESUPERVISIONPERIOD": "Periodo de Supervision",
  "PROFILES_DELETESUPERVISIONPERIOD": "Periodo de Supervision",
  "PROFILES_UPDATESUPERVISIONPERIOD": "Periodo de Supervision",
  "PROFILES_READPERMIT": "Permisos",
  "PROFILES_CREATEPERMIT": "Permisos",
  "PROFILES_UPDATEPERMIT": "Permisos",
  "PROFILES_DELETEPERMIT": "Permisos",
  "PROFILES_READREMINDER": "Recordatorio",
  "PROFILES_CREATEREMINDER": "Recordatorio",
  "PROFILES_DELETEREMINDER": "Recordatorio",
  "PROFILES_UPDATEREMINDER": "Recordatorio"
};


const user_friendly_permit_names = {
    "PROFILES_READPROJECTS" :"Ver Proyectos",
    "PROFILES_CREATEPROJECTS" :"Generar Proyectos",
    "PROFILES_UPDATEPROJECTS" :"Actualizar Proyectos",
    "PROFILES_DELETEPROJECTS" :"Eliminar Proyectos",
    "PROFILES_READAMBIENTALPLANS" :"Ver Planes Ambientales",
    "PROFILES_CREATEAMBIENTALPLANS" :"Generar Planes Ambientales",
    "PROFILES_UPDATEAMBIENTALPLANS" :"Actualizar Planes Ambientales",
    "PROFILES_DELETEAMBIENTALPLANS" :"Eliminar Planes Ambientales",
    "PROFILES_READMONITORINGS" :"Ver Monitoreos",
    "PROFILES_WRITEMONITORINGS" :"Generar Monitoreos",
    "PROFILES_UPDATEMONITORINGS" :"Actualizar Monitoreos",
    "PROFILES_DELETEMONITORINGS" :"Eliminar Monitoreos",
    "PROFILES_READACTIVITIES" :"Ver Actividad",
    "PROFILES_CREATEACTIVITIES" :"Generar Actividad",
    "PROFILES_UPDATEACTIVITIES" :"Actualizar Actividad",
    "PROFILES_DELETEACTIVITIES" :"Eliminar Actividad",
    "PROFILES_CREATEEVENTS" :"Generar Evento",
    "PROFILES_READEVENTS" :"Ver Evento",
    "PROFILES_UPDATEEVENTS" :"Actualizar Evento",
    "PROFILES_DELETEEVENTS" :"Eliminar Evento",
    "PROFILES_CREATEUSERS" :"Generar Usuarios",
    "PROFILES_READUSERS" :"Ver Usuarios",
    "PROFILES_UPDATEUSERS" :"Actualizar Usuarios",
    "PROFILES_DELETEUSERS" :"Eliminar Usuarios",
    "PROFILES_CREATEPROFILES" :"Generar Perfiles",
    "PROFILES_UPDATEPROFILES" :"Actualizar Perfiles",
    "PROFILES_READPROFILES" :"Ver Perfiles",
    "PROFILES_DELETEPROFILES" :"Eliminar Perfiles",
    "PROFILES_READACTIONS" :"Ver Acciones",
    "PROFILES_READSUPERVISIONPERIOD" :"Ver Periodo de Supervision",
    "PROFILES_CREATESUPERVISIONPERIOD" :"Generar Periodo de Supervision",
    "PROFILES_DELETESUPERVISIONPERIOD" :"Eliminar Periodo de Supervision",
    "PROFILES_UPDATESUPERVISIONPERIOD" :"Actualizar Periodo de Supervision",
    "PROFILES_READPERMIT" :"Ver Permiso",
    "PROFILES_CREATEPERMIT" :"Generar Permiso",
    "PROFILES_UPDATEPERMIT" :"Actualizar Permiso",
    "PROFILES_DELETEPERMIT" :"Eliminar Permiso",
    "PROFILES_READREMINDER" :"Ver Recordatorio",
    "PROFILES_CREATEREMINDER" :"Generar Recordatorio",
    "PROFILES_DELETEREMINDER" :"Eliminar Recordatorio",
    "PROFILES_UPDATEREMINDER" :"Actualizar Recordatorio"
};

const userFriendlyPermitNames = {};
Object.keys(permitsGroups).forEach((key) => {
  userFriendlyPermitNames[key] = user_friendly_permit_names[key];
});

exports.getPermits = async (req, res) => {
  const { id, just_permits } = req.body;

  const queryColumns = `
    SELECT COLUMN_NAME 
    FROM INFORMATION_SCHEMA.COLUMNS 
    WHERE TABLE_NAME = 'profiles' 
      AND TABLE_SCHEMA = 'biosigma_db' 
      AND DATA_TYPE = 'tinyint' 
      AND COLUMN_NAME != 'PROFILES_STATE'
  `;

  db.query(queryColumns, async (err, columnResults) => {
    if (err) return res.status(500).send('Error al obtener columnas');

    const permits = {};
    sanitize(id);
    if (id) {
      db.query('SELECT * FROM profiles WHERE PROFILES_ID = ?', [id], (err, profileResults) => {
        if (err || profileResults.length === 0) return res.json({});

        const profile = profileResults[0];

        columnResults.forEach(row => {
          const columnName = row.COLUMN_NAME;
          const group = permitsGroups[columnName] || 'Otros';
          const value = profile[columnName] === 1;

          if (!permits[group]) permits[group] = {};
          permits[group][columnName] = {
            permit_name: userFriendlyPermitNames[columnName] || columnName,
            value
          };
        });

        res.json(permits);
      });

    } else if (just_permits) {
      columnResults.forEach(row => {
        const columnName = row.COLUMN_NAME;
        const group = permitsGroups[columnName] || 'Otros';
        if (!permits[group]) permits[group] = {};
        permits[group][columnName] = {
          permit_name: userFriendlyPermitNames[columnName] || columnName,
          value: false
        };
      });

      res.json(permits);
    } else {
      res.json({});
    }
  });
};

const Allpermits = [
  "PROFILES_READPROJECTS", "PROFILES_CREATEPROJECTS", "PROFILES_UPDATEPROJECTS", "PROFILES_DELETEPROJECTS",
  "PROFILES_READAMBIENTALPLANS", "PROFILES_CREATEAMBIENTALPLANS", "PROFILES_UPDATEAMBIENTALPLANS", "PROFILES_DELETEAMBIENTALPLANS",
  "PROFILES_READMONITORINGS", "PROFILES_WRITEMONITORINGS", "PROFILES_UPDATEMONITORINGS", "PROFILES_DELETEMONITORINGS",
  "PROFILES_CREATEACTIVITIES", "PROFILES_READACTIVITIES", "PROFILES_UPDATEACTIVITIES", "PROFILES_DELETEACTIVITIES",
  "PROFILES_CREATEEVENTS", "PROFILES_READEVENTS", "PROFILES_UPDATEEVENTS", "PROFILES_DELETEEVENTS",
  "PROFILES_CREATEUSERS", "PROFILES_READUSERS", "PROFILES_UPDATEUSERS", "PROFILES_DELETEUSERS",
  "PROFILES_CREATEPROFILES", "PROFILES_UPDATEPROFILES", "PROFILES_READPROFILES", "PROFILES_DELETEPROFILES",
  "PROFILES_READACTIONS",
  "PROFILES_READSUPERVISIONPERIOD", "PROFILES_CREATESUPERVISIONPERIOD", "PROFILES_DELETESUPERVISIONPERIOD", "PROFILES_UPDATESUPERVISIONPERIOD",
  "PROFILES_READPERMIT", "PROFILES_CREATEPERMIT", "PROFILES_UPDATEPERMIT", "PROFILES_DELETEPERMIT",
  "PROFILES_READREMINDER", "PROFILES_CREATEREMINDER", "PROFILES_DELETEREMINDER", "PROFILES_UPDATEREMINDER"
];

exports.createProfile =  async (req, res) => {
  const profile_name = req.body.profile_name;
  let selected_permits = req.body.selected_permits || [];


  if (!Array.isArray(selected_permits)) {
    selected_permits = [selected_permits];
  }

  const checkQuery = 'SELECT PROFILES_NAME FROM profiles WHERE PROFILES_NAME = ?';
  db.query(checkQuery, [profile_name], (err, results) => {
    if (err) return res.status(500).send('Error al verificar perfil');
    if (results.length > 0) return res.send('existing_user');

    const permitValues = Allpermits.map(p => selected_permits.includes(p) ? 1 : 0);
    const allValues = [profile_name, ...permitValues];
    const columns = ['PROFILES_NAME', ...permits];
    const placeholders = columns.map(() => '?');

    const insertQuery = `
      INSERT INTO profiles (${columns.join(', ')})
      VALUES (${placeholders.join(', ')})
    `;

    db.query(insertQuery, allValues, (err) => {
      if (err) {
        console.error("Error al insertar perfil:", err);
        return res.status(500).send("Error al crear el perfil");
      }
      res.status(200).json({ status: "ok" });
    });
  });
};


exports.updateProfile = async (req, res) => {
  const { profile_id, name, permits } = req.body;

  if (!profile_id || !name || !permits) {
    return res.status(400).json({ message: 'Profile ID, name, and permits are required.' });
  }

  try {
    const [existingProfiles] = await db.promise().execute(
            'SELECT PROFILES_NAME FROM profiles WHERE PROFILES_NAME = ? AND PROFILES_ID != ?',
            [name, profile_id]
        );

    if (existingProfiles.length > 0) {
            return res.status(400).json({ message: 'Profile name already exists.' });
        }
      
      await db.promise().execute(
            'UPDATE profiles SET PROFILES_NAME = ? WHERE PROFILES_ID = ?',
            [name, profile_id]
        );

      const setClause = Allpermits.map(permit => `${permit} = ?`).join(', ');
        const params = Allpermits.map(permit => permits[permit] ? 1 : 0);
        params.push(profile_id);

        await db.promise().execute(
            `UPDATE profiles SET ${setClause} WHERE PROFILES_ID = ?`,
            params
        );

        res.status(200).json({ message: 'Profile updated successfully.' });
    } catch (error) {
        console.error('Error updating profile:', error);
        res.status(500).json({ message: 'Error updating profile: ' + error.message });
    }
};

exports.toggleProfile =async (req, res) => {
  const { profile, state } = req.body;

  if (!profile || !state) {
    return res.status(400).send('Missing parameters');
  }

  try {
    if (state === 'INACTIVE') {
      const [rows] = await db.promise().execute(
        'SELECT COUNT(*) AS count FROM users WHERE PROFILES_ID = ?',
        [profile]
      );

      if (rows[0].count > 0) {
        return res.send("El usuario esta asignado"); 
      }
    }

    await db.execute(
      'UPDATE profiles SET PROFILES_STATE = ? WHERE PROFILES_ID = ?',
      [state, profile]
    );

    res.send('success');
  } catch (error) {
    console.error('Error toggling profile state:', error);
    res.status(500).send('error');
  }
}