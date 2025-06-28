const pool = require('../models/db');

exports.getReminders = async (req, res) => {
  try {
    const { date } = req.body;

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
    const { rows } = await pool.query(query, values);

    const reminders = rows.map(register => ({
      id: register.reminder_id,
      title: register.reminder_title,
      reminder_date: register.reminder_torememberdate,
      project: register.project_name
    }));

    res.json(reminders);
  } catch (err) {
    console.error('Error al obtener los recordatorios:', err);
    res.status(500).send('Error interno');
  }
};

exports.getRemindersByProject = async (req, res) => {
  try {
    const { project_id } = req.params;

    const query = `
      SELECT DISTINCT r.*, p.project_name
      FROM reminder r
      JOIN project p ON r.project_id = p.project_id
      WHERE r.reminder_state = 'ACTIVE'
        AND r.project_id = $1
    `;
    const values = [project_id];
    const { rows } = await pool.query(query,values);

    const reminders = rows.map(register => ({
      id: register.reminder_id,
      title: register.reminder_title,
      reminder_date: register.reminder_torememberdate,
      project: register.project_name,
    }));

    res.json(reminders);
  } catch (err) {
    console.error('Error al obtener los recordatorios:', err);
    res.status(500).send('Error interno');
  }
};

exports.getReminderData = async (req, res) => {
  try {
    const { reminder_id } = req.params;

    const query = `
      SELECT DISTINCT r.*, p.project_name
      FROM reminder r
      JOIN project p ON r.project_id = p.project_id
      WHERE r.reminder_id = $1
    `;
    const values = [reminder_id];
    const { rows } = await pool.query(query,values);

    const reminders = rows.map(register => ({
      id: register.reminder_id,
      title: register.reminder_title,
      description : register.reminder_content,
      start: register.reminder_torememberdate,
      project: register.project_name,
      register_date: register.reminder_registerdate
    }));

    res.json(reminders);
  } catch (err) {
    console.error('Error al obtener los recordatorios:', err);
    res.status(500).send('Error interno');
  }
};

exports.postReminder = async (req, res) => {
  try {
    const { title, description, date, project_id } = req.body;

    const query = `
      INSERT INTO reminder (reminder_title, reminder_content, reminder_torememberdate, project_id, reminder_registerdate)
      VALUES ($1, $2, $3, $4,NOW())
      RETURNING reminder_id
    `;
    const values = [title, description, date, project_id];
    const { rows } = await pool.query(query, values);

    if(rows.length === 0) {
      return res.status(400).send('No se pudo crear el recordatorio');
    }
    res.status(201).json({ message: 'Recordatorio creado exitosamente'});
  } catch (err) {
    console.error('Error al crear el recordatorio:', err);
    res.status(500).send('Error interno');
  }
}

exports.putReminder = async (req, res) => {
  try {
    const { reminder_id } = req.params;
    const { title, description, date, project_id } = req.body;

    const queryCheck = `
      SELECT reminder_state FROM reminder WHERE reminder_id = $1
    `;
    const valuesCheck = [reminder_id];
    const { rows: checkRows } = await pool.query(queryCheck, valuesCheck);

    if (checkRows[0].reminder_state !== 'ACTIVE') {
      return res.status(404).send('Recordatorio no se puede actualizar porque no está activo');
    }

    const query = `
      UPDATE reminder
      SET reminder_title = $1, reminder_content = $2, reminder_torememberdate = $3, project_id = $4
      WHERE reminder_id = $5
    `;
    const values = [title, description, date, project_id, reminder_id];
    await pool.query(query, values);

    res.json({ message: 'Recordatorio actualizado exitosamente' });
  } catch (err) {
    console.error('Error al actualizar el recordatorio:', err);
    res.status(500).send('Error interno');
  }
}

exports.toggleReminderState = async (req, res) => {
     try {
    const { reminder_id } = req.params;
    const { state } = req.body;

    const query = `
      UPDATE reminder
      SET reminder_state = $1
      WHERE reminder_id = $2
    `;
    const values = [state, reminder_id];
    await pool.query(query, values);

    res.json({ message: 'Recordatorio ha sido modificado exitosamente' });
  } catch (err) {
    console.error('Error al actualizar el recordatorio:', err);
    res.status(500).send('Error interno');
  }
}

exports.notifyReminders = async (req, res) => {
  try {
    const query = `
    SELECT r.reminder_id, r.reminder_title, r.reminder_torememberdate, p.project_name
    FROM reminder r
    JOIN project p ON r.project_id = p.project_id
    WHERE r.reminder_state = 'ACTIVE'
        AND r.reminder_torememberdate = CURRENT_DATE
    `;

    const { rows } = await pool.query(query);
    
    const notifications = rows.map(register => ({
      title: register.reminder_title,
      project: register.project_name
    }));
    
    res.status(200).json(notifications);
  } catch (err) {
    console.error('Error al notificar recordatorios:', err);
  }
}