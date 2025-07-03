const pool = require('../models/db');

async function getActions(){
    const query = `
    SELECT DISTINCT a.*, u.users_name, u.users_surname, users_users, u.users_id FROM actions a JOIN users u
    on  u.users_id = a.users_id 
  `;
  return await pool.query(query);
}

async function queryActionByPersonalId(personal_id) {
    const queryUser = `
    SELECT users_id FROM users WHERE users_personal_id = $1
  `;

    const { rows: userRows } = await pool.query(queryUser, [personal_id]);

    if (userRows.length === 0) {
      return res.status(404).send('Usuario no encontrado o no existente');
    }

    const userId = userRows[0].users_id;
    const query = `
        SELECT a.*, u.users_name, u.users_surname, u.users_users
        FROM actions a 
        JOIN users u ON u.users_id = a.users_id 
        WHERE u.users_id = $1
    `;

    return await pool.query(query, [userId]);
}

async function queryActionByDate(date) {
    const query = `
    SELECT a.*, u.users_name, u.users_surname, u.users_users, u.users_id 
    FROM actions a 
    JOIN users u ON u.users_id = a.users_id 
    WHERE DATE(a.actions_date) = $1
  `;

  return await pool.query(query, [date])
}

async function CreateAction(users_id, actions_description) {
    const query = `
    INSERT INTO actions (users_id, actions_description, actions_date)
    VALUES ($1, $2, NOW())
    RETURNING *
  `;

  return await pool.query(query, [users_id, actions_description]);
}


actionsServices = {
    getActions,
    queryActionByPersonalId,
    queryActionByDate,
    CreateAction
}

module.exports = {actionsServices};