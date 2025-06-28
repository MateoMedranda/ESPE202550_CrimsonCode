const pool = require('../models/db');

function sanitize(str) {
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

exports.getActions = async (req,res) =>
{
    const query = `
    SELECT DISTINCT a.*, u.users_name, u.users_surname, users_users, u.users_id FROM actions a JOIN users u
    on  u.users_id = a.users_id 
  `;

  try {
    const { rows } = await pool.query(query);

    let tabla = '';

    rows.forEach(register => {
      const name = sanitize(register.users_name);
      const surname = sanitize(register.users_surname);
      const user = sanitize(register.users_users);
      const actions_description = sanitize(register.actions_description);
      const actions_date = sanitize(register.actions_date);


      tabla += `
        <tr>
        <td>${user}</td>
        <td>${name} ${surname}</td>
        <td>${actions_description}</td>  
        <td>${actions_date}</td>
        </tr>
      `;
    });

    res.send(tabla);
  } catch (err) {
    console.error('Error al obtener los usuarios:', err);
    res.status(500).send('Error');
  }
}

exports.getActionByPersonalId = async (req, res) => {
  const { personal_id } = req.params;

  const queryUser = `
    SELECT users_id FROM users WHERE users_personal_id = $1
  `;
  const query = `
    SELECT a.*, u.users_name, u.users_surname, u.users_users
    FROM actions a 
    JOIN users u ON u.users_id = a.users_id 
    WHERE u.users_id = $1
  `;

  try {
    const { rows: userRows } = await pool.query(queryUser, [personal_id]);

    if (userRows.length === 0) {
      return res.status(404).send('Usuario no encontrado');
    }

    const userId = userRows[0].users_id;
    const { rows } = await pool.query(query, [userId]);

    if (rows.length === 0) {
      return res.status(404).send('Acción no encontrada');
    }
    let tabla = '';
    for (const register of rows) {
          const name = sanitize(register.users_name);
          const surname = sanitize(register.users_surname);
          const user = sanitize(register.users_users);
          const actions_description = sanitize(register.actions_description);
          const actions_date = sanitize(register.actions_date);

          tabla += `
            <tr>
              <td>${user}</td>
              <td>${name} ${surname}</td>
              <td>${actions_description}</td>  
              <td>${actions_date}</td>
            </tr>
          `;
      }
      res.status(200).send(tabla);
  } catch (err) {
    console.error('Error al obtener la acción:', err);
    res.status(500).send('Error');
  }
}

exports.getActionByDate = async (req, res) => {
  const { date } = req.body; 

  const query = `
    SELECT a.*, u.users_name, u.users_surname, u.users_users, u.users_id 
    FROM actions a 
    JOIN users u ON u.users_id = a.users_id 
    WHERE DATE(a.actions_date) = $1
  `;

  try {
    const { rows } = await pool.query(query, [date]);

    if (rows.length === 0) {
      return res.status(404).send('No se encontraron acciones en esa fecha.');
    }

    let html = '';
    for (const register of rows) {
      const name = sanitize(register.users_name);
      const surname = sanitize(register.users_surname);
      const user = sanitize(register.users_users);
      const actions_description = sanitize(register.actions_description);
      const actions_date = sanitize(register.actions_date);

      html += `
        <tr>
          <td>${user}</td>
          <td>${name} ${surname}</td>
          <td>${actions_description}</td>  
          <td>${actions_date}</td>
        </tr>
      `;
    }

    res.send(html);
  } catch (err) {
    console.error('Error al obtener acciones por fecha:', err);
    res.status(500).send('Error');
  }
};


exports.postAction = async (req, res) => {
  const { users_id, actions_description } = req.body;

  const query = `
    INSERT INTO actions (users_id, actions_description, actions_date)
    VALUES ($1, $2, NOW())
    RETURNING *
  `;

  try {
    const { rows } = await pool.query(query, [users_id, actions_description]);
    const action = rows[0];

    if (!action) {
      return res.status(400).send('Error al registrar la acción');
    }

    res.status(201).json({
      message: 'Acción Registrada',
    });
  } catch (err) {
    console.error('Error al crear la acción:', err);
    res.status(500).send('Error al crear la acción');
  }
}

