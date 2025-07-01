const port = 3001;
const express = require("express");
const cors = require('cors');
const app = express();
require('dotenv').config();

const { Sequelize } = require('sequelize');

const sequelize = require('./database/sequelize');

(async () => {
  try {
    await sequelize.authenticate();
    console.log('System connected to PostgreSQL Database Succesfully');
  } catch (error) {
    console.error('Unable to connect to the PostgreSQL database:', error);
  }
})();

app.use(express.json());
app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

const EnvironmentalPlanRouter = require("./routes/environmentalPlanRoutes");
const activityRouter = require("./routes/activityRoutes");
const controlRouter = require("./routes/controlRoutes");
const profileRoutes = require('./routes/profileRoutes');
const userRoutes = require('./routes/userRoutes');
const actionRoutes = require('./routes/actionRoutes');
const reminderRoutes = require('./routes/remindersRoutes');
const projectRoutes = require('./routes/projectRoutes');
const monitoringRoutes = require('./routes/monitoringRoutes');
const permitRoutes = require('./routes/permitRoutes');

app.use("/projects/:projectId",EnvironmentalPlanRouter);
app.use("/environmental-plans/:planId",activityRouter);
app.use("/activities/:activityId",controlRouter);
app.use('/api/profile', profileRoutes);
app.use('/api/user',userRoutes)
app.use('/api/action', actionRoutes);
app.use('/api/reminder', reminderRoutes);
app.use('/projects', projectRoutes);
app.use('/monitorings', monitoringRoutes);
app.use('/permit', permitRoutes);

app.listen(port,() => console.log("System Running in --> "+port));