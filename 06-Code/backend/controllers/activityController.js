const activity = require("../models/activity");
const control = require("../models/control");
const EPM = require("../models/environmentalPlan");
const { Op } = require('sequelize');
const puppeteer = require('puppeteer');
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

function calculateDaysSinceLastControl(DayLastControl){
    return  (new Date() - new Date(DayLastControl)) / (1000 * 60 * 60 * 24);
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
                if (lastControl.control_criterion.toLowerCase() == "cumple") {
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
    const { from, to} = req.query;

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

    const EPObject = await EPM.findOne({ where: {environmentalplan_id: req.params.planId } });

    const activities = await activity.findAll({
      where: { environmentalplan_id: planId }
    });

    const oneMonthAgo = new Date();
    oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);

    let activitiesEString = "";
    let activitiesNEString = "";
    let activitiesEvaluated = 0;
    let activitiesNonEvaluated = 0;
    let satisfy = 0;
    let nonSatisfy = 0;

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
        activitiesEString +=  `<tr><td>${activityr.activity_measure}</td><td>${activityr.activity_frecuency}</td><td>${recentControl.control_criterion}</td><td>${recentControl.control_observation}</td></tr>`;
        activitiesEvaluated++;
        if(recentControl.control_criterion.toLowerCase() == "cumple"){
            satisfy++;
        }else if(recentControl.control_criterion.toLowerCase() == "no cumple"){
            nonSatisfy++;
        }

      } else {
        const lastControl = controls.length > 0 ? controls[0] : null;
        activitiesNEString +=  `<tr><td>${activityr.activity_measure}</td><td>${activityr.activity_frecuency}</td><td>'N/A'</td><td>'N/A'</td></tr>`;
        activitiesNonEvaluated ++;
      }
    }

    const browser = await puppeteer.launch({ args: ['--no-sandbox'] });
    const page = await browser.newPage();

    const html = `
      <html>
        <head>
          <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
          <style>
            @page {
              margin: 40px 50px;
            }
            body {
              font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
              color: #333;
              font-size: 12px;
            }
            header {
              display: flex;
              align-items: center;
              border-bottom: 2px solid #2980b9;
              padding-bottom: 10px;
              margin-bottom: 20px;
            }
            header img {
              height: 60px;
              margin-right: 20px;
            }
            header h1 {
              font-size: 28px;
              color: #2980b9;
              margin: 0;
            }
            .subheader {
              font-size: 14px;
              color: #555;
              margin-bottom: 20px;
            }
            #chart-container {
              width: 600px;
              margin: 0 auto 30px auto;
              text-align: center;
            }
            h2 {
              font-size: 18px;
              color: #2980b9;
              margin-bottom: 10px;
              margin-top: 40px;
            }
            table {
              width: 100%;
              border-collapse: collapse;
              margin-bottom: 40px;
            }
            table, th, td {
              border: 1px solid #ddd;
            }
            th {
              background-color: #2980b9;
              color: white;
              padding: 12px 10px;
              text-align: left;
            }
            td {
              padding: 10px;
            }
            tr:nth-child(even) {
              background-color: #f2f6fb;
            }
            footer {
              position: fixed;
              bottom: 30px;
              left: 50px;
              right: 50px;
              font-size: 10px;
              color: #888;
              border-top: 1px solid #ccc;
              padding-top: 5px;
              text-align: center;
            }
            .pageNumber:after {
              content: counter(page);
            }
          </style>
        </head>
        <body>
          <header>
            <img src="${logo}" alt="Logo">
            <h1>Reporte Plan De Manejo Ambiental</h1>
          </header>
          <h1>${EPObject.environmentalplan_name}</h1>
          <div class="subheader">Fecha de emisión: ${new Date().toLocaleDateString()}</div>

          <div id="chart-container">
            <canvas id="chart" width="600" height="300"></canvas>
          </div>

          <h2>Actividades Evaluadas</h2>
          <table>
            <thead>
              <tr>
                <th>Actividad</th>
                <th>Responsable</th>
                <th>Evaluación</th>
                <th>Observación</th>
              </tr>
            </thead>
            <tbody>
              ${activitiesEString}
            </tbody>
          </table>

          <h2>Actividades No Evaluadas</h2>
          <table>
            <thead>
              <tr>
                <th>Actividad</th>
                <th>Frecuencia</th>
                <th>Criterio</th>
                <th>Observación</th>
              </tr>
            </thead>
            <tbody>
              ${activitiesNEString}
            </tbody>
          </table>

          <footer>
            Página <span class="pageNumber"></span> - Sistema Gestión Ambiental © ${new Date().getFullYear()}
          </footer>

          <script>
            const drawChart = async () => {
              return new Promise((resolve) => {
                const ctx = document.getElementById('chart').getContext('2d');
                new Chart(ctx, {
                  type: 'bar',
                  data: {
                    labels: [
                      'Total actividades',
                      'Evaluadas',
                      'Cumplen',
                      'No cumplen',
                      'No aplica'
                    ],
                    datasets: [{
                      label: 'Actividades',
                      data: [${activities.length}, ${activitiesEvaluated}, ${satisfy}, ${nonSatisfy}, ${activitiesNonEvaluated}], // Reemplazar con datos reales si se desea
                      backgroundColor: [
                        '#3498db',
                        '#2ecc71',
                        '#27ae60',
                        '#e74c3c',
                        '#95a5a6'
                      ]
                    }]
                  },
                  options: {
                    animation: false,
                    responsive: false,
                    plugins: {
                      legend: { display: false }
                    },
                    scales: {
                      y: { beginAtZero: true }
                    }
                  }
                });
                setTimeout(resolve, 1000); // Espera para que el gráfico se pinte
              });
            };
            drawChart();
          </script>
        </body>
      </html>
    `;

    await page.setContent(html, { waitUntil: 'networkidle0' });

    await page.evaluate(() => new Promise(resolve => setTimeout(resolve, 1500)));

    const pdfBuffer = await page.pdf({
      format: 'A4',
      printBackground: true,
      margin: { top: '40px', bottom: '60px', left: '50px', right: '50px' }
    });

    await browser.close();

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 'inline; filename=reporte.pdf');
    res.send(pdfBuffer);

  } catch (error) {
    console.error('Error generando PDF:', error);
    res.status(500).send('Error generando el PDF');
  }
};
