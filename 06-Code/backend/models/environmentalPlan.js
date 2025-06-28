const { DataTypes } = require('sequelize');
const sequelize = require('../database/sequelize'); 

const EnvironmentalPlan = sequelize.define('EnvironmentalPlan', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,  
  },
  projectid: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  description: {
    type: DataTypes.TEXT,  
    allowNull: true,
  },
  stage: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  process: {
    type: DataTypes.STRING,
    allowNull: true,
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
  tableName: 'EnvironmentalPlan',
  timestamps: false,  
});

module.exports = EnvironmentalPlan;
