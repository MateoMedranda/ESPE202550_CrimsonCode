const pool = require('../models/db');

const puppeteer = require('puppeteer');

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


exports.getActionPdf = async (req, res) => {
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
    const name = sanitize(rows[0].users_name);
    const surname = sanitize(rows[0].users_surname);
    let tabla = '';
    for (const register of rows) {
      
      const actions_description = sanitize(register.actions_description);
      const actions_date = sanitize(register.actions_date);
      let date = new Date(actions_date);
      date = date.toLocaleDateString('es-ES', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
      });
      tabla += `
        <tr>
          <td>${actions_description}</td>  
          <td>${date}</td>
        </tr>
      `;
    }
      
    const htmlContent = `
        <html>
      <head>
        <meta charset="UTF-8" />
        <style>
          body {
            font-family: Arial, sans-serif;
            background-color: #f8f9fa;
            padding: 30px;
          }

          .card {
            background-color: #ffffff;
            padding: 20px;
            border-radius: 12px;
            box-shadow: 0px 4px 12px rgba(0, 0, 0, 0.1);
            width: 95%;
            margin: auto;
          }

          .card-header {
            background-color: #d1e7dd;
            text-align: center;
            padding: 10px 0;
            border-radius: 8px 8px 0 0;
            font-size: 24px;
            font-weight: bold;
            color: #0f5132;
            margin-bottom: 20px;
          }

          table {
            width: 100%;
            border-collapse: collapse;
            font-size: 14px;
            border-radius: 8px;
            overflow: hidden;
          }

          thead {
            background-color: #dee2e6;
          }

          th,
          td {
            border: 1px solid #ced4da;
            padding: 10px;
            text-align: left;
          }

          tbody tr:nth-child(even) {
            background-color: #f1f3f5;
          }

          tbody tr:hover {
            background-color: #e2e6ea;
          }
        </style>
      </head>
      <body>
        <div class="card">
          <div class="card-header">
            Reporte de Acciones del Usuario ${name} ${surname}
          </div>
          <table>
            <thead>
              <tr>
                <th>Descripción</th>
                <th>Fecha</th>
              </tr>
            </thead>
            <tbody>
              ${tabla}
            </tbody>
          </table>
        </div>
      </body>
    </html>
    `;
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.setContent(htmlContent, { waitUntil: 'networkidle0' });
    const pdfBuffer = await page.pdf({
      format: 'A4',
      printBackground: true
    });
    await browser.close();

    res.set({
      'Content-Type': 'application/pdf',
      'Content-Disposition': 'attachment; filename="acciones_usuario.pdf"',
      'Content-Length': pdfBuffer.length
    });
    res.send(pdfBuffer);

  } catch (err) {
    console.error('Error al obtener la acción o generar el PDF:', err);
    res.status(500).send('Error');
  }
};