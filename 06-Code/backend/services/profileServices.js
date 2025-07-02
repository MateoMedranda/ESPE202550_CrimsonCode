const pool = require('../models/db'); 

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

async function createProfile(placeholders,values,columns) {
  const insertQuery = `
      INSERT INTO profiles (${columns.join(', ')})
      VALUES (${placeholders})
    `;

  await pool.query(insertQuery, values);
}

async function updateProfile(profile_id, name, permits,setClause) {

  await pool.query(
    'UPDATE profiles SET profiles_name = $1 WHERE profiles_id = $2',
    [name, profile_id]
  );

  await pool.query(
      `UPDATE profiles SET ${setClause} WHERE profiles_id = $${Allpermits.length + 1}`,
      [...permits, profile_id]
    );

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
