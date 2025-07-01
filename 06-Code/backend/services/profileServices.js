const pool = require('../db'); 

async function ProfilesSearch() {
  const query = `SELECT DISTINCT profiles_name, profiles_state, profiles_id FROM profiles`;
  const { rows } = await pool.query(query);
  return rows;
}

module.exports = { obtenerPerfiles };
