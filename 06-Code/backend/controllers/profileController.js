const { ProfileServices } = require('../services/profileServices');

exports.getAllProfiles = async (req, res) => {
  try {
    const { rows } = await ProfileServices.AllProfiles();
    res.json(rows);
  } catch (err) {
    console.error('Error al obtener perfiles:', err);
    res.status(500).json({ error: 'Error al obtener perfiles' });
  }
};


exports.getProfilesTable = async (req, res) => {
  try {
    const { rows } = await ProfileServices.AllProfiles(); 

    let tabla = '';

    rows.forEach(register => {
      const name = sanitize(register.profiles_name);
      const state = sanitize(register.profiles_state);
      const id = sanitize(register.profiles_id);
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
              data-id="${id}" data-name="${name}">
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
    console.error('Error al obtener perfiles desde API:', err);
    res.status(500).send('Error');
  }
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
  "profiles_readprojects": "Proyectos",
  "profiles_createprojects": "Proyectos",
  "profiles_updateprojects": "Proyectos",
  "profiles_deleteprojects": "Proyectos",
  "profiles_readambientalplans": "Planes Ambientales",
  "profiles_createambientalplans": "Planes Ambientales",
  "profiles_updateambientalplans": "Planes Ambientales",
  "profiles_deleteambientalplans": "Planes Ambientales",
  "profiles_readmonitorings": "Monitoreos",
  "profiles_writemonitorings": "Monitoreos",
  "profiles_updatemonitorings": "Monitoreos",
  "profiles_deletemonitorings": "Monitoreos",
  "profiles_readactivities": "Actividad",
  "profiles_createactivities": "Actividad",
  "profiles_updateactivities": "Actividad",
  "profiles_deleteactivities": "Actividad",
  "profiles_createevents": "Evento",
  "profiles_readevents": "Evento",
  "profiles_updateevents": "Evento",
  "profiles_deleteevents": "Evento",
  "profiles_createusers": "Usuarios",
  "profiles_readusers": "Usuarios",
  "profiles_updateusers": "Usuarios",
  "profiles_deleteusers": "Usuarios",
  "profiles_createprofiles": "Perfiles",
  "profiles_updateprofiles": "Perfiles",
  "profiles_readprofiles": "Perfiles",
  "profiles_deleteprofiles": "Perfiles",
  "profiles_readactions": "Acciones",
  "profiles_readsupervisionperiod": "Periodo de Supervision",
  "profiles_createsupervisionperiod": "Periodo de Supervision",
  "profiles_deletesupervisionperiod": "Periodo de Supervision",
  "profiles_updatesupervisionperiod": "Periodo de Supervision",
  "profiles_readpermit": "Permisos",
  "profiles_createpermit": "Permisos",
  "profiles_updatepermit": "Permisos",
  "profiles_deletepermit": "Permisos",
  "profiles_readreminder": "Recordatorio",
  "profiles_createreminder": "Recordatorio",
  "profiles_deletereminder": "Recordatorio",
  "profiles_updatereminder": "Recordatorio"
};


const user_friendly_permit_names = {
    "profiles_readprojects" :"Ver Proyectos",
    "profiles_createprojects" :"Generar Proyectos",
    "profiles_updateprojects" :"Actualizar Proyectos",
    "profiles_deleteprojects" :"Eliminar Proyectos",
    "profiles_readambientalplans" :"Ver Planes Ambientales",
    "profiles_createambientalplans" :"Generar Planes Ambientales",
    "profiles_updateambientalplans" :"Actualizar Planes Ambientales",
    "profiles_deleteambientalplans" :"Eliminar Planes Ambientales",
    "profiles_readmonitorings" :"Ver Monitoreos",
    "profiles_writemonitorings" :"Generar Monitoreos",
    "profiles_updatemonitorings" :"Actualizar Monitoreos",
    "profiles_deletemonitorings" :"Eliminar Monitoreos",
    "profiles_readactivities" :"Ver Actividad",
    "profiles_createactivities" :"Generar Actividad",
    "profiles_updateactivities" :"Actualizar Actividad",
    "profiles_deleteactivities" :"Eliminar Actividad",
    "profiles_createevents" :"Generar Evento",
    "profiles_readevents" :"Ver Evento",
    "profiles_updateevents" :"Actualizar Evento",
    "profiles_deleteevents" :"Eliminar Evento",
    "profiles_createusers" :"Generar Usuarios",
    "profiles_readusers" :"Ver Usuarios",
    "profiles_updateusers" :"Actualizar Usuarios",
    "profiles_deleteusers" :"Eliminar Usuarios",
    "profiles_createprofiles" :"Generar Perfiles",
    "profiles_updateprofiles" :"Actualizar Perfiles",
    "profiles_readprofiles" :"Ver Perfiles",
    "profiles_deleteprofiles" :"Eliminar Perfiles",
    "profiles_readactions" :"Ver Acciones",
    "profiles_readsupervisionperiod" :"Ver Periodo de Supervision",
    "profiles_createsupervisionperiod" :"Generar Periodo de Supervision",
    "profiles_deletesupervisionperiod" :"Eliminar Periodo de Supervision",
    "profiles_updatesupervisionperiod" :"Actualizar Periodo de Supervision",
    "profiles_readpermit" :"Ver Permiso",
    "profiles_createpermit" :"Generar Permiso",
    "profiles_updatepermit" :"Actualizar Permiso",
    "profiles_deletepermit" :"Eliminar Permiso",
    "profiles_readreminder" :"Ver Recordatorio",
    "profiles_createreminder" :"Generar Recordatorio",
    "profiles_deletereminder" :"Eliminar Recordatorio",
    "profiles_updatereminder" :"Actualizar Recordatorio"
};

const userFriendlyPermitNames = {};
Object.keys(permitsGroups).forEach((key) => {
  userFriendlyPermitNames[key] = user_friendly_permit_names[key];
});

exports.getPermits = async (req, res) => {
  const { id, just_permits } = req.body;

  try {
    const {columnResults } = await ProfileServices.getPermitsData();
    const permits = {};

    if (id) {
      const { rows: profileResults } = await ProfileServices.ProfilesSearch(id);

      if (profileResults.length === 0) return res.status(200).json({"message": "Perfil no encontrado"});

      const profile = profileResults[0];

      columnResults.forEach(row => {
        const columnName = row.column_name;
        const group = permitsGroups[columnName] || 'Otros';
        const value = profile[columnName] === true || profile[columnName] === 1;

        if (!permits[group]) permits[group] = {};
        permits[group][columnName] = {
          permit_name: userFriendlyPermitNames[columnName] || columnName,
          value
        };
      });

      res.json(permits);
    } else if (just_permits) {
      columnResults.forEach(row => {
        const columnName = row.column_name;
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

  } catch (err) {
    console.error('Error:', err);
    res.status(500).send('Error al obtener permisos');
  }
};


const Allpermits = [
  "profiles_readprojects", "profiles_createprojects", "profiles_updateprojects", "profiles_deleteprojects",
  "profiles_readambientalplans", "profiles_createambientalplans", "profiles_updateambientalplans", "profiles_deleteambientalplans",
  "profiles_readmonitorings", "profiles_writemonitorings", "profiles_updatemonitorings", "profiles_deletemonitorings",
  "profiles_createactivities", "profiles_readactivities", "profiles_updateactivities", "profiles_deleteactivities",
  "profiles_createevents", "profiles_readevents", "profiles_updateevents", "profiles_deleteevents",
  "profiles_createusers", "profiles_readusers", "profiles_updateusers", "profiles_deleteusers",
  "profiles_createprofiles", "profiles_updateprofiles", "profiles_readprofiles", "profiles_deleteprofiles",
  "profiles_readactions",
  "profiles_readsupervisionperiod", "profiles_createsupervisionperiod", "profiles_deletesupervisionperiod", "profiles_updatesupervisionperiod",
  "profiles_readpermit", "profiles_createpermit", "profiles_updatepermit", "profiles_deletepermit",
  "profiles_readreminder", "profiles_createreminder", "profiles_deletereminder", "profiles_updatereminder"
];

exports.createProfile = async (req, res) => {
  const profile_name = req.body.profile_name;
  let selected_permits = req.body.selected_permits || [];
  if(selected_permits === undefined || selected_permits === null) {
    return res.status(400).json({ error: 'Permisos seleccionados no pueden estar vacíos' });
  }
  if (!Array.isArray(selected_permits)) {
    selected_permits = [selected_permits];
  }

  try {
    const { rows } = await ProfileServices.checkProfileName(profile_name);

    if (rows.length > 0) {
      return res.send('Nombre de perfil ya existe');
    }

    const columns = ['profiles_name', ...Allpermits];
    const placeholders = columns.map((_, idx) => `$${idx + 1}`).join(', ');
    const values = [profile_name, ...Allpermits.map(p => selected_permits.includes(p) ? 1 : 0)];

    await ProfileServices.createProfile( placeholders,values,columns);
    
    res.status(200).json({ status: "ok" });

  } catch (err) {
    console.error('Error al crear perfil:', err);
    res.status(500).json({ error: 'Error interno al crear el perfil', details: err.message });
  }
};

exports.updateProfile = async (req, res) => {
   const profile_id = req.params.id;
  const { name, permits } = req.body;

  if (!profile_id) {
    return res.status(400).json({ message: 'Se necesita el id del perfil a actualizar.' });
  }

  if ( !name) {
    return res.status(400).json({ message: 'Se necesita un nombre de perfil a actualizar.' });
  }

  if (!permits) {
    return res.status(400).json({ message: 'Se necesitapermisos seleccionados para actualizar.'});
  }

  try {
    const { rows: existingProfiles } = await ProfileServices.checkProfileExistence(name, profile_id);

    if (existingProfiles.length > 0) {
      return res.status(400).json({ message: 'Nombre de perfil ya existente.'});
    }
    const setClause = Allpermits.map((permit, i) => `${permit} = $${i + 1}`).join(', ');
    const permitValues = Allpermits.map(p => permits[p] ? 1 : 0);

    await ProfileServices.updateProfile(profile_id, name, permitValues,setClause);

    res.status(200).json({ message: 'Perfil acutalizado' });
  } catch (error) {
    console.error('Error updating profile:', error);
    res.status(500).json({ message: 'Error updating profile: ' + error.message });
  }
};

exports.toggleProfile = async (req, res) => {
    const profile = req.params.id; 
  const {  state } = req.body;

  if (!profile || !state) {
    return res.status(400).send('falta el id del perfil o el estado');
  }

  if( state !== 'ACTIVE' && state !== 'INACTIVE') {
    return res.status(400).send('Estado no válido, debe ser ACTIVE o INACTIVE');
  }
  
  try {
    if (state === 'INACTIVE') {
      const { rows } = await ProfileServices.IsProfileAsigned(profile);

      if (parseInt(rows[0].count) > 0) {
        return res.status(200).send("El usuario esta asignado");
      }
    }

    await ProfileServices.toggleProfile(state, profile);

    res.send('success');
  } catch (error) {
    console.error('Error toggling profile state:', error);
    res.status(500).send('error');
  }
};
