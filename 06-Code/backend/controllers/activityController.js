const activity = require("../models/activity");
const control = require("../models/control");
const EPM = require("../models/environmentalPlan");
require("dotenv").config();
const { Op } = require('sequelize');
const puppeteer = require('puppeteer');
control.belongsTo(activity, { foreignKey: 'activity_id' });
activity.hasMany(control, { foreignKey: 'activity_id' });

const PdfPrinter = require('pdfmake');
const pdfFonts = require('pdfmake/build/vfs_fonts');

const fonts = {
  Roboto: {
    normal: 'Roboto-Regular.ttf',
    bold: 'Roboto-Medium.ttf',
    italics: 'Roboto-Italic.ttf',
    bolditalics: 'Roboto-MediumItalic.ttf'
  }
};

const printer = new PdfPrinter(fonts);
printer.vfs = pdfFonts;  // ASÍ dices que busque las fuentes en este vfs virtual


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
    let nonSatisfy = 0;
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
        if(lastControl.control_criterion.toLowerCase() == "no cumple" && lastControl.control_verification.toLowerCase() != "anulado"){
          nonSatisfy++;
        }
      }
    }

    let percentage = activities.length ? (satisfy / activities.length * 100).toFixed(2) : 0;

    res.status(200).json(
      {
        totalActivities: activities.length,
        activitiesEvaluated: evaluate,
        activitiesSatisfy: satisfy,
        activitiesNoSatisfy: nonSatisfy,
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


const logo = 'https://biosigmambiental.com/wp-content/uploads/2019/09/cropped-cropped-logo-png-01.png';

exports.getEnvironmentalPlanReport = async (req, res) => {
  try {
    const planId = Number(req.params.planId);

    const EPObject = await EPM.findOne({ where: { environmentalplan_id: planId } });

    const activities = await activity.findAll({ where: { environmentalplan_id: planId } });

    const oneMonthAgo = new Date();
    oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);

    let activitiesEvaluated = 0;
    let activitiesNonEvaluated = 0;
    let satisfy = 0;
    let nonSatisfy = 0;

    // Tablas para pdfmake
    // Actividades Evaluadas: filas con [Actividad, Frecuencia, Evaluación, Observación]
    const evaluatedRows = [
      ['Actividad', 'Frecuencia', 'Evaluación', 'Observación'], // encabezado
    ];
    // Actividades No Evaluadas
    const nonEvaluatedRows = [
      ['Actividad', 'Frecuencia', 'Criterio', 'Observación'], // encabezado
    ];

    for (const activityr of activities) {
      const controls = await control.findAll({
        where: {
          activity_id: activityr.activity_id,
          control_verification: { [Op.ne]: 'Anulado' },
        },
        order: [['createdat', 'DESC']],
      });

      const recentControl = controls.find((ctrl) => new Date(ctrl.createdat) >= oneMonthAgo);

      if (recentControl && recentControl.control_criterion.toLowerCase() !== 'no aplica') {
        evaluatedRows.push([
          activityr.activity_measure,
          activityr.activity_frecuency,
          recentControl.control_criterion,
          recentControl.control_observation || '',
        ]);
        activitiesEvaluated++;
        if (recentControl.control_criterion.toLowerCase() === 'cumple') satisfy++;
        else if (recentControl.control_criterion.toLowerCase() === 'no cumple') nonSatisfy++;
      } else {
        nonEvaluatedRows.push([
          activityr.activity_measure,
          activityr.activity_frecuency,
          'N/A',
          'N/A',
        ]);
        activitiesNonEvaluated++;
      }
    }

    // Definimos el contenido del PDF
    const docDefinition = {
      pageMargins: [40, 60, 40, 60],
      info: {
        title: `Reporte Plan Ambiental - ${EPObject.environmentalplan_name}`,
      },
      footer(currentPage, pageCount) {
        return {
          text: `Página ${currentPage} de ${pageCount} - Sistema Gestión Ambiental © ${new Date().getFullYear()}`,
          alignment: 'center',
          fontSize: 8,
          margin: [0, 10, 0, 0],
        };
      },
      content: [
        {
          columns: [
            {
              image: await fetchImageToBase64(
                'https://biosigmambiental.com/wp-content/uploads/2019/09/cropped-cropped-logo-png-01.png'
              ),
              width: 60,
            },
            {
              text: 'Reporte Plan De Manejo Ambiental',
              fontSize: 22,
              bold: true,
              margin: [10, 20, 0, 10],
            },
          ],
        },
        { text: EPObject.environmentalplan_name, style: 'header' },
        { text: `Fecha de emisión: ${new Date().toLocaleDateString()}`, margin: [0, 0, 0, 20] },

        // Resumen con datos
        {
          columns: [
            {
              width: '*',
              stack: [
                { text: 'Resumen:', bold: true, margin: [0, 0, 0, 10] },
                {
                  ul: [
                    `Total actividades: ${activities.length}`,
                    `Actividades evaluadas: ${activitiesEvaluated}`,
                    `Cumplen: ${satisfy}`,
                    `No cumplen: ${nonSatisfy}`,
                    `No aplican / No evaluadas: ${activitiesNonEvaluated}`,
                  ],
                },
              ],
            },
          ],
          margin: [0, 0, 0, 20],
        },

        { text: 'Actividades Evaluadas', style: 'subheader' },
        {
          table: {
            headerRows: 1,
            widths: ['*', 80, 80, '*'],
            body: evaluatedRows,
          },
          layout: 'lightHorizontalLines',
          margin: [0, 0, 0, 20],
        },

        { text: 'Actividades No Evaluadas', style: 'subheader' },
        {
          table: {
            headerRows: 1,
            widths: ['*', 80, 80, '*'],
            body: nonEvaluatedRows,
          },
          layout: 'lightHorizontalLines',
          margin: [0, 0, 0, 20],
        },
      ],
      styles: {
        header: { fontSize: 18, bold: true, margin: [0, 10, 0, 10] },
        subheader: { fontSize: 14, bold: true, margin: [0, 10, 0, 5], color: '#2980b9' },
      },
    };

    // Helper para traer imagen y convertir a base64
    async function fetchImageToBase64(url) {
      const res = await fetch(url);
      const buffer = await res.arrayBuffer();
      const base64 = Buffer.from(buffer).toString('base64');
      const mimeType = res.headers.get('content-type');
      return `data:${mimeType};base64,${base64}`;
    }

    const pdfDoc = printer.createPdfKitDocument(docDefinition);
    const chunks = [];
    pdfDoc.on('data', (chunk) => chunks.push(chunk));
    pdfDoc.on('end', () => {
      const result = Buffer.concat(chunks);
      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader('Content-Disposition', 'inline; filename=reporte.pdf');
      res.send(result);
    });
    pdfDoc.end();

  } catch (error) {
    console.error('Error generando PDF con pdfmake:', error);
    res.status(500).send('Error generando el PDF');
  }
};