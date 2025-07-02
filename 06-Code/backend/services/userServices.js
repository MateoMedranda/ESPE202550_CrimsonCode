const pool = require('../models/db'); 

async function AllUsers() {
  const query = `
    SELECT DISTINCT u.*, p.profiles_name, p.profiles_id 
    FROM users u 
    JOIN profiles p ON u.profiles_id = p.profiles_id 
    AND p.profiles_state = 'ACTIVE'
  `;
  return await pool.query(query); 
}

async function getProfiles() {
    const query = `
    SELECT DISTINCT p.profiles_name,p.profiles_id FROM users u JOIN profiles p
    on  u.profiles_id = p.profiles_id AND p.profiles_state = 'ACTIVE' 
  `;

    return await pool.query(query);
}

async function getUserData(id) {
    const query = `
    SELECT DISTINCT u.*,p.profiles_name FROM users u JOIN profiles p
    on  u.profiles_id = p.profiles_id AND p.profiles_state = 'ACTIVE' AND u.users_id = $1 
  `;
    return await pool.query(query, [id]);
}

async function CheckUsernameExistence(username) {
const checkQuery = 'SELECT users_id FROM users WHERE users_users = $1';
    return await pool.query(checkQuery, [username]);
}

async function CheckPersonalIdExistence(username) {
const checkQuery = 'SELECT users_id FROM users WHERE users_personal_id = $1';
    return await pool.query(checkQuery, [username]);
}
async function createUser(values) {

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

    await pool.query(query, values);
}

async function updateUser( values) { 
    const query = 'UPDATE users SET profiles_id = $1 WHERE users_id = $2'
    ;
    return await pool.query(query, values)
}

async function toggleUser(values) {
    const query = `UPDATE users SET users_state = $1 WHERE users_id = $2`;
    return await pool.query(query, values);
}


const UserServices = {
    AllUsers,
    getProfiles,
    getUserData,
    CheckUsernameExistence,
    CheckPersonalIdExistence, 
    createUser,
    updateUser,
    toggleUser
};

module.exports = { UserServices };