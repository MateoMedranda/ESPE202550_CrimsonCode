const port = 3001;
const express = require("express");
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

const EnvironmentalPlanRouter = require("./routes/environmentalPlanRoutes");
const activityRouter = require("./routes/activityRoutes");
const controlRouter = require("./routes/controlRoutes");

app.use("/projects/:projectId",EnvironmentalPlanRouter);
app.use("/environmental-plans/:planId",activityRouter);
app.use("/activities/:activityId",controlRouter);

app.listen(port,() => console.log("MY Computer Store Server is running on port --> "+port));