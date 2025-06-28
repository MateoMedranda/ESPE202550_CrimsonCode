const { DataTypes } = require('sequelize');
const sequelize = require('../database/sequelize'); 

const EnvironmentalPlan = sequelize.define('environmentalplan', {
  environmentalplan_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,  
  },
  project_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  environmentalplan_name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  environmentalplan_description: {
    type: DataTypes.TEXT,  
    allowNull: false,
  },
  environmentalplan_stage: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  environmentalplan_process: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  createdat: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
  updatedat: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  }
}, {
  tableName: 'environmentalplan',
  timestamps: false,  
});

module.exports = EnvironmentalPlan;
