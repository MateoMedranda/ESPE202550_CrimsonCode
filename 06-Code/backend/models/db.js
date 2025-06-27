const { Pool } = require('pg');
require('dotenv').config();

const isProduction = process.env.NODE_ENV === 'production';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: isProduction
    ? { rejectUnauthorized: false }
    : false,
});

module.exports = pool;

const testConnection = async () => {
  try {
    const client = await pool.connect();
    console.log('Conexión exitosa a la base de datos');
    const res = await client.query('SELECT version()');
    console.log('Versión de PostgreSQL:', res.rows[0].version);
    client.release(); 
  } catch (err) {
    console.error('Error al conectar a la base de datos:', err.stack);
  } 
};

testConnection();