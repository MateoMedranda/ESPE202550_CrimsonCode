const pool = require('../models/db'); 
const Allpermits = require('../constants/permits')
async function AllProfiles() {
  const query = `SELECT DISTINCT profiles_name, profiles_state, profiles_id FROM profiles`;
  const { rows } = await pool.query(query);
  return {rows};
}

async function getPermitsData() {
  const queryColumns = `
    SELECT column_name
    FROM information_schema.columns
    WHERE table_name = 'profiles'
      AND table_schema = 'public' 
      AND data_type IN ('boolean', 'smallint') 
      AND column_name != 'profiles_state'; 
  `;
    const { rows } = await pool.query(queryColumns);
  return {columnResults : rows};

}

async function checkProfileName(profile_name) {
  const checkQuery = 'SELECT profiles_name FROM profiles WHERE LOWER(profiles_name) = LOWER($1)';
    const { rows } = await pool.query(checkQuery, [profile_name]);
  return { rows };

}

async function checkProfileExistence(profile_name,profile_id) {
  const checkQuery = 'SELECT profiles_name FROM profiles WHERE LOWER(profiles_name) = LOWER($1) AND profiles_id != $2';
    const { rows } = await pool.query(checkQuery, [profile_name, profile_id]);
  return { rows };

} 

async function ProfilesSearch(id) {
  const {rows} = await pool.query('SELECT * FROM profiles WHERE profiles_id = $1', [id]);
  return {rows};
}


async function createProfile(placeholders,values,columns) {
  const insertQuery = `
      INSERT INTO profiles (${columns.join(', ')})
      VALUES (${placeholders})
    `;

  await pool.query(insertQuery, values);
}

async function updateProfile(profile_id, name, permits) {
  const setClause = ["profiles_name = $1"]
    .concat(Allpermits.map((permit, i) => `${permit} = $${i + 2}`))
    .join(', ');

  const values = [name, ...Allpermits.map(p => permits[p] ? true : false), profile_id];

  const query = `UPDATE profiles SET ${setClause} WHERE profiles_id = $${values.length}`;

  await pool.query(query, values);
}
async function IsProfileAsigned(profile_id) {
  const query = `
    SELECT COUNT(*) AS count
    FROM users
    WHERE profiles_id = $1
  `;
  const { rows } = await pool.query(query, [profile_id]);

  return { rows };
}

async function toggleProfile(state, profile) {

  await pool.query(
      'UPDATE profiles SET profiles_state = $1 WHERE profiles_id = $2',
      [state, profile]
    );
}

const ProfileServices = {
  AllProfiles,
  ProfilesSearch,
  getPermitsData,
  checkProfileName,
  checkProfileExistence,
  createProfile,
  updateProfile,
  IsProfileAsigned,
  toggleProfile
};

module.exports = { ProfileServices };
