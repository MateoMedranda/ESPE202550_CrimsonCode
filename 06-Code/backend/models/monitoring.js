const { DataTypes } = require('sequelize');
const sequelize = require('../database/sequelize');

const Monitoring = sequelize.define('Monitoring', {
  monitoring_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  project_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'project',
      key: 'project_id',
    },
  },
  monitoring_name: {
    type: DataTypes.STRING(255),
    allowNull: false,
  },
  monitoring_description: {
    type: DataTypes.STRING(512),
    allowNull: false,
  },
  monitoring_evidence: {
    type: DataTypes.STRING(512),
    allowNull: false,
  },
  monitoring_observations: {
    type: DataTypes.STRING(512),
    allowNull: false,
  },
  monitoring_image: {
    type: DataTypes.STRING(255),
    allowNull: false,
  },
  monitoring_folder: {
    type: DataTypes.STRING(255),
    allowNull: false,
  }
}, {
  tableName: 'monitoring',
  timestamps: false, 
});

module.exports = Monitoring;