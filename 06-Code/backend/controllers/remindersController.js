const {reminderServices} = require('../services/reminderServices');

exports.getReminders = async (req, res) => {
  try {
    const { date } = req.body;
    if (!date) {
      return res.status(400).send('Falta la fecha para obtener los recordatorios');
    }
    const { rows } = await reminderServices.AllReminders(date);

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

    if (!project_id) {
      return res.status(400).send('Falta el ID del proyecto');
    }

    const { rows } = await reminderServices.getRemindersByProject(project_id);

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
    if (!reminder_id) {
      return res.status(400).send('Falta el ID del recordatorio');
    }
    const { rows } = await reminderServices.getRemindeById(reminder_id);

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

    if (!title || !description || !date || !project_id) {
      return res.status(400).send('Faltan datos para crear el recordatorio');
    }

    const result = await reminderServices.createReminder(title, description, date, project_id);

    if (result.rowCount === 0) {
    return res.status(400).send('No se pudo generar el recordatorio');
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
    if (!reminder_id) {
      return res.status(400).send('Falta el ID del recordatorio');
    }
    if (!title || !description || !date || !project_id) {
      return res.status(400).send('Faltan datos para actualizar el recordatorio');
    }
    const reminderData = await reminderServices.getRemindeById(reminder_id);
    if (reminderData ==null) {
      return res.status(404).send('Recordatorio no encontrado');
    }
    else if (reminderData.reminder_state === 'INACTIVE') {
      return res.status(400).send('No se puede actualizar un recordatorio inactivo');
    }
    const result = await reminderServices.updateReminder(reminder_id, title, description, date, project_id);

    if (result.rowCount === 0) {
    return res.status(400).send('No se pudo actualizar el recordatorio');
    }

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
    if (!reminder_id) {
      return res.status(400).send('Falta el ID del recordatorio');
    }

    if (!state || (state !== 'ACTIVE' && state !== 'INACTIVE')) {
      return res.status(400).send('Estado inválido. Debe ser "ACTIVE" o "INACTIVE"');
    }
    
    if(reminderServices.updateReminderState(reminder_id, state).length === 0) {
      return res.status(400).send('No se pudo actualizar el estado del recordatorio');
    }

    res.json({ message: 'Recordatorio ha sido modificado exitosamente' });
  } catch (err) {
    console.error('Error al actualizar el recordatorio:', err);
    res.status(500).send('Error interno');
  }
}

exports.notifyReminders = async (req, res) => {
  try {
    const { rows } = await reminderServices.notifyReminders();
    
    if (rows.length === 0) {
      return res.send('No hay recordatorios para notificar');
    }

    const notifications = rows.map(register => ({
      title: register.reminder_title,
      project: register.project_name
    }));
    
    res.status(200).json(notifications);
  } catch (err) {
    console.error('Error al notificar recordatorios:', err);
  }
}