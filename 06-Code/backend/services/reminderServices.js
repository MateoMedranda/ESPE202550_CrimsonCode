const pool = require('../models/db'); 

async function AllReminders(date) {
    const inputDate = new Date(date);
    const year = inputDate.getFullYear();
    const month = inputDate.getMonth(); 

    const firstDay = new Date(year, month, 1);
    const firstDayNextMonth = new Date(year, month + 1, 1);

    const query = `
      SELECT DISTINCT r.*, p.project_name
      FROM reminder r
      JOIN project p ON r.project_id = p.project_id
      WHERE r.reminder_state = 'ACTIVE'
        AND r.reminder_torememberdate >= $1
        AND r.reminder_torememberdate < $2
    `;

    const values = [firstDay.toISOString(), firstDayNextMonth.toISOString()];
    return await pool.query(query, values);
}

async function getRemindersByProject(project_id) {
    const query = `
      SELECT DISTINCT r.*, p.project_name
      FROM reminder r
      JOIN project p ON r.project_id = p.project_id
      WHERE r.reminder_state = 'ACTIVE'
        AND r.project_id = $1
    `;
    const values = [project_id];

    return await pool.query(query, values);
}

async function getRemindeById (reminder_id) {
  const query = `
      SELECT DISTINCT r.*, p.project_name
      FROM reminder r
      JOIN project p ON r.project_id = p.project_id
      WHERE r.reminder_id = $1
    `;
    const values = [reminder_id];
    const {rows} = await pool.query(query, values);
    return rows;
}

async function createReminder(title, description, date, project_id) {
  const query = `
      INSERT INTO reminder (reminder_title, reminder_content, reminder_torememberdate, project_id, reminder_registerdate)
      VALUES ($1, $2, $3, $4,NOW())
      RETURNING reminder_id
    `;
    const values = [title, description, date, project_id];
    const { rows } = await pool.query(query, values);
    return rows[0];
}

async function updateReminder(reminder_id, title, description, date, project_id) {
    const query = `
      UPDATE reminder
      SET reminder_title = $1, reminder_content = $2, reminder_torememberdate = $3, project_id = $4
      WHERE reminder_id = $5
    `;
    const values = [title, description, date, project_id, reminder_id];
    return await pool.query(query, values);
}

async function updateReminderState(reminder_id,state) {
    const query = `
      UPDATE reminder
      SET reminder_state = $1
      WHERE reminder_id = $2
    `;
    const values = [state, reminder_id];
  return  await pool.query(query, values);
}

async function notifyReminders() {
  const query = `
    SELECT r.reminder_id, r.reminder_title, r.reminder_torememberdate, p.project_name
    FROM reminder r
    JOIN project p ON r.project_id = p.project_id
    WHERE r.reminder_state = 'ACTIVE'
        AND r.reminder_torememberdate = CURRENT_DATE
    `;
  return await pool.query(query);
}

const reminderServices ={
    AllReminders,
    getRemindersByProject,
    getRemindeById,
    createReminder,
    updateReminder,
    updateReminderState,
    notifyReminders
}

module.exports = { reminderServices };