const activity = require("../models/activity");
const control = require("../models/control");
const EPM = require("../models/environmentalPlan");
const { Op } = require('sequelize');
import PDFDocument from 'pdfkit';
import axios from 'axios';
control.belongsTo(activity, { foreignKey: 'activity_id' });
activity.hasMany(control, { foreignKey: 'activity_id' });


exports.getAllActivities = async (req, res) => {
  try {
    const { planId } = req.params;
    const activities = await activity.findAll({ where: { environmentalplan_id: planId } });
    res.status(200).json(activities);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getActivityById = async (req, res) => {
  try {
    const activityObject = await activity.findOne({ where: { environmentalplan_id: req.params.planId, activity_id: req.params.activityId } });
    if (!activityObject) {
      return res.status(404).json({ message: "The activity was not found or does not exist" });
    }
    res.status(200).json(activityObject);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.createActivity = async (req, res) => {
  try {
    const environmentalplan_id = req.params.planId;
    const { aspect, impact, measure, verification, frecuency } = req.body;

    if (!environmentalplan_id || isNaN(Number(environmentalplan_id)) || !aspect || !impact || !measure || !verification || !frecuency) {
      return res.status(400).json({ message: "Empty parameters are not allowed or the format is incorrect" });
    }

    const newActivity = await activity.create({
      environmentalplan_id,
      activity_aspect: aspect,
      activity_impact: impact,
      activity_measure: measure,
      activity_verification: verification,
      activity_frecuency: frecuency
    });

    res.status(201).json(newActivity);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.updateActivity = async (req, res) => {
  try {

    const id = req.params.activityId;

    const activityObject = await activity.findByPk(id);

    if (!activityObject) {
      return res.status(404).json({ message: "Activity not found" });
    }

    const { aspect, impact, measure, verification, frecuency } = req.body;

    await activityObject.update({
      activity_aspect: aspect,
      activity_impact: impact,
      activity_measure: measure,
      activity_verification: verification,
      activity_frecuency: frecuency
    });

    res.status(200).json(activityObject);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.deleteActivity = async (req, res) => {
  try {
    const id = req.params.activityId;

    const activityObject = await activity.findByPk(id);

    if (!activityObject) {
      return res.status(404).json({ message: "Activity not found" });
    }

    await activityObject.destroy();

    res.status(204).send();
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

function calculatelimitFrecuency(frecuency) {
  limit = 99999;
  switch (frecuency.toLowerCase()) {
    case 'mensual': limit = 30; break;
    case 'bimestral': limit = 60; break;
    case 'trimestral': limit = 90; break;
    case 'anual': limit = 365; break;
  }

  return limit;
}

function calculateDaysSinceLastControl(DayLastControl) {
  return (new Date() - new Date(DayLastControl)) / (1000 * 60 * 60 * 24);
}

exports.getCompliance = async (req, res) => {
  try {
    const planId = Number(req.params.planId);
    const activities = await activity.findAll({ where: { environmentalplan_id: planId } });

    let evaluate = 0;
    let satisfy = 0;

    for (const activityr of activities) {

      const controls = await control.findAll({ where: { activity_id: activityr.activity_id }, order: [['createdat', 'DESC']] });
      console.log(`Actividad ID: ${activityr.activity_id}, Frecuencia: ${activityr.activity_frecuency}`);


      if (controls.length == 0) continue;

      const lastControl = controls[0];
      const daysSinceLastControl = calculateDaysSinceLastControl(lastControl.createdat);

      let limit = calculatelimitFrecuency(activityr.activity_frecuency);

      if (daysSinceLastControl <= limit) {
        evaluate++;
        if (lastControl.control_criterion.toLowerCase() == "cumple" && lastControl.control_verification.toLowerCase() != "anulado") {
          satisfy++;
        }
      }
    }

    let percentage = activities.length ? (satisfy / activities.length * 100).toFixed(2) : 0;

    res.status(200).json(
      {
        totalActivities: activities.length,
        activitiesEvaluated: evaluate,
        activitiesSatisfy: satisfy,
        percentageSatisfy: percentage
      }
    );
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getActivitiesPending = async (req, res) => {
  try {
    const planId = Number(req.params.planId);
    const activities = await activity.findAll({ where: { environmentalplan_id: planId } });
    const pendingActivities = [];

    for (const activityr of activities) {
      const controls = await control.findAll({
        where: {
          activity_id: activityr.activity_id,
          control_verification: { [Op.ne]: 'Anulado' }
        },
        order: [['createdat', 'DESC']]
      });

      let lastControlDate = null;
      let diffDays = null;

      if (controls.length > 0) {
        lastControlDate = new Date(controls[0].createdat);
        diffDays = calculateDaysSinceLastControl(controls[0].createdat);
      }

      const limit = calculatelimitFrecuency(activityr.activity_frecuency);
      const shouldBeControlled = !lastControlDate || diffDays > limit;

      if (shouldBeControlled) {
        pendingActivities.push({
          activity_id: activityr.activity_id,
          activity_measure: activityr.activity_measure,
          activity_frecuency: activityr.activity_frecuency,
          lastControlDate: lastControlDate ? lastControlDate.toISOString().split('T')[0] : 'Nunca',
          daysSinceLastControl: lastControlDate ? Math.floor(diffDays) : 'N/A'
        });
      }
    }

    res.status(200).json({
      totalActivities: activities.length,
      pendingActivities: pendingActivities.length,
      details: pendingActivities
    });

  } catch (err) {
    console.error("Error en /pending/:", err);
    res.status(500).json({ message: err.message });
  }
};

exports.getControllReportByDate = async (req, res) => {
  try {
    const planId = req.params.planId;
    const { from, to } = req.query;

    if (!from || !to) {
      return res.status(400).json({ message: "Cannot have empty atributes, please send from, to" });
    }

    const whereControl = {
      createdat: {
        [Op.between]: [new Date(from), new Date(to)]
      }
    };

    const whereActivity = {
      environmentalplan_id: planId
    };

    const controls = await control.findAll({
      where: whereControl,
      include: [
        {
          model: activity,
          where: whereActivity,
          attributes: [
            'activity_id',
            'activity_aspect',
            'activity_impact',
            'activity_measure',
            'activity_verification',
            'activity_frecuency',
          ]
        }
      ],
      order: [['createdat', 'DESC']]
    });

    res.status(200).json({
      total: controls.length,
      data: controls
    });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getActivitiesByEvaluationStatus = async (req, res) => {
  try {
    const planId = Number(req.params.planId);
    const activities = await activity.findAll({
      where: { environmentalplan_id: planId }
    });

    const oneMonthAgo = new Date();
    oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);

    const activitiesEvaluated = [];
    const activitiesNoEvaluated = [];

    for (const activityr of activities) {
      const controls = await control.findAll({
        where: {
          activity_id: activityr.activity_id,
          control_verification: { [Op.ne]: 'Anulado' }
        },
        order: [['createdat', 'DESC']]
      });

      const recentControl = controls.find(ctrl => new Date(ctrl.createdat) >= oneMonthAgo);

      if (recentControl && recentControl.control_criterion.toLowerCase() !== 'no aplica') {
        activitiesEvaluated.push({
          activity_measure: activityr.activity_measure,
          activity_frecuency: activityr.activity_frecuency,
          control_criterion: recentControl.control_criterion,
          control_observation: recentControl.control_observation
        });
      } else {
        const lastControl = controls.length > 0 ? controls[0] : null;

        activitiesNoEvaluated.push({
          activity_measure: activityr.activity_measure,
          activity_frecuency: activityr.activity_frecuency,
          control_criterion: lastControl ? lastControl.control_criterion : 'N/A',
          control_observation: lastControl ? lastControl.control_observation : 'N/A'
        });
      }
    }

    res.status(200).json({
      activitiesEvaluated,
      activitiesNoEvaluated
    });

  } catch (err) {
    console.error("Error en getActivitiesByEvaluationStatus:", err);
    res.status(500).json({ message: err.message });
  }
};


const logoUrl = 'https://biosigmambiental.com/wp-content/uploads/2019/09/cropped-cropped-logo-png-01.png';

exports.getEnvironmentalPlanReport = async (req, res) => {
  try {
    const planId = Number(req.params.planId);

    const EPObject = await EPM.findOne({ where: { environmentalplan_id: planId } });
    const activities = await activity.findAll({ where: { environmentalplan_id: planId } });

    const oneMonthAgo = new Date();
    oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);

    // Contadores para estadísticas
    let activitiesEvaluated = 0;
    let activitiesNonEvaluated = 0;
    let satisfy = 0;
    let nonSatisfy = 0;

    // Preparar arrays para actividades evaluadas y no evaluadas
    const evaluatedActivities = [];
    const nonEvaluatedActivities = [];

    for (const activityr of activities) {
      const controls = await control.findAll({
        where: {
          activity_id: activityr.activity_id,
          control_verification: { [Op.ne]: 'Anulado' }
        },
        order: [['createdat', 'DESC']]
      });

      const recentControl = controls.find(ctrl => new Date(ctrl.createdat) >= oneMonthAgo);

      if (recentControl && recentControl.control_criterion.toLowerCase() !== 'no aplica') {
        activitiesEvaluated++;
        if (recentControl.control_criterion.toLowerCase() === "cumple") satisfy++;
        else if (recentControl.control_criterion.toLowerCase() === "no cumple") nonSatisfy++;

        evaluatedActivities.push({
          measure: activityr.activity_measure,
          frequency: activityr.activity_frecuency,
          criterion: recentControl.control_criterion,
          observation: recentControl.control_observation,
        });
      } else {
        activitiesNonEvaluated++;
        nonEvaluatedActivities.push({
          measure: activityr.activity_measure,
          frequency: activityr.activity_frecuency,
        });
      }
    }

    // Descargar logo como buffer para insertar en pdfkit
    const logoResponse = await axios.get(logoUrl, { responseType: 'arraybuffer' });
    const logoBuffer = Buffer.from(logoResponse.data, 'binary');

    // Crear documento PDF
    const doc = new PDFDocument({ size: 'A4', margin: 50 });

    // Headers HTTP para PDF inline
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 'inline; filename="reporte.pdf"');

    // Pipe PDF al response
    doc.pipe(res);

    // --- Encabezado ---
    doc.image(logoBuffer, 50, 45, { width: 60 });
    doc.fillColor('#2980b9').fontSize(28).text('Reporte Plan De Manejo Ambiental', 120, 57);
    doc.moveDown(2);

    // --- Título del plan ---
    doc.fillColor('black').fontSize(20).text(EPObject.environmentalplan_name, { align: 'left' });
    doc.fontSize(12).fillColor('#555').text(`Fecha de emisión: ${new Date().toLocaleDateString()}`, { align: 'left' });
    doc.moveDown(2);

    // --- Gráfico de barras (simple) ---
    // Como pdfkit no dibuja gráficos complejos, hacemos una barra básica
    const barLabels = ['Total', 'Evaluadas', 'Cumplen', 'No cumplen', 'No aplica'];
    const barValues = [activities.length, activitiesEvaluated, satisfy, nonSatisfy, activitiesNonEvaluated];
    const colors = ['#3498db', '#2ecc71', '#27ae60', '#e74c3c', '#95a5a6'];

    const startX = 50;
    let startY = doc.y;
    const barHeight = 20;
    const maxBarWidth = 400;
    const maxValue = Math.max(...barValues);

    doc.fontSize(14).fillColor('#2980b9').text('Resumen de Actividades:', startX, startY);
    startY += 25;

    for (let i = 0; i < barLabels.length; i++) {
      const barWidth = (barValues[i] / maxValue) * maxBarWidth;
      doc.fillColor('black').fontSize(12).text(barLabels[i], startX, startY + i * (barHeight + 10));
      doc.rect(startX + 100, startY + i * (barHeight + 10) + 4, barWidth, barHeight).fill(colors[i]);
      doc.fillColor('black').text(barValues[i].toString(), startX + 110 + barWidth, startY + i * (barHeight + 10));
    }

    doc.moveDown(7);

    // --- Tabla actividades evaluadas ---
    doc.fillColor('#2980b9').fontSize(18).text('Actividades Evaluadas');
    doc.moveDown(0.5);

    const table1Top = doc.y;
    // Encabezados tabla
    const table1Headers = ['Actividad', 'Frecuencia', 'Evaluación', 'Observación'];
    const colWidths = [180, 100, 100, 150];
    let x = startX, y = table1Top;
    doc.fontSize(12).fillColor('white');
    for (let i = 0; i < table1Headers.length; i++) {
      doc.rect(x, y, colWidths[i], 20).fill('#2980b9');
      doc.fillColor('white').text(table1Headers[i], x + 5, y + 5);
      x += colWidths[i];
    }

    // Filas
    y += 20;
    doc.fillColor('black');
    evaluatedActivities.forEach((act, idx) => {
      x = startX;
      if (idx % 2 === 0) {
        doc.rect(x, y, colWidths.reduce((a,b)=>a+b,0), 20).fill('#f2f6fb');
      }
      doc.fillColor('black').text(act.measure, x + 5, y + 5, { width: colWidths[0] - 10 });
      x += colWidths[0];
      doc.text(act.frequency, x + 5, y + 5, { width: colWidths[1] - 10 });
      x += colWidths[1];
      doc.text(act.criterion, x + 5, y + 5, { width: colWidths[2] - 10 });
      x += colWidths[2];
      doc.text(act.observation, x + 5, y + 5, { width: colWidths[3] - 10 });
      y += 20;
    });

    doc.moveDown(2);

    // --- Tabla actividades no evaluadas ---
    doc.fillColor('#2980b9').fontSize(18).text('Actividades No Evaluadas');
    doc.moveDown(0.5);

    const table2Top = doc.y;
    x = startX; y = table2Top;
    const table2Headers = ['Actividad', 'Frecuencia', 'Criterio', 'Observación'];
    doc.fontSize(12).fillColor('white');
    for (let i = 0; i < table2Headers.length; i++) {
      doc.rect(x, y, colWidths[i], 20).fill('#2980b9');
      doc.fillColor('white').text(table2Headers[i], x + 5, y + 5);
      x += colWidths[i];
    }

    y += 20;
    doc.fillColor('black');
    nonEvaluatedActivities.forEach((act, idx) => {
      x = startX;
      if (idx % 2 === 0) {
        doc.rect(x, y, colWidths.reduce((a,b)=>a+b,0), 20).fill('#f2f6fb');
      }
      doc.text(act.measure, x + 5, y + 5, { width: colWidths[0] - 10 });
      x += colWidths[0];
      doc.text(act.frequency, x + 5, y + 5, { width: colWidths[1] - 10 });
      x += colWidths[1];
      doc.text('N/A', x + 5, y + 5, { width: colWidths[2] - 10 });
      x += colWidths[2];
      doc.text('N/A', x + 5, y + 5, { width: colWidths[3] - 10 });
      y += 20;
    });

    // --- Pie de página ---
    const bottom = doc.page.height - 50;
    doc.fontSize(10).fillColor('#888')
      .text(`Sistema Gestión Ambiental © ${new Date().getFullYear()}`, 50, bottom, { align: 'center', width: doc.page.width - 100 });

    // Finaliza y envía PDF
    doc.end();

  } catch (error) {
    console.error('Error generando PDF con pdfkit:', error);
    res.status(500).send('Error generando el PDF');
  }
};
