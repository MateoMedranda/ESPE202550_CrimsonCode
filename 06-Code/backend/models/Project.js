const { DataTypes } = require('sequelize');
const sequelize = require('../database/sequelize'); 

const Project = sequelize.define('Project', {
  project_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  project_name: {
    type: DataTypes.STRING(128),
    allowNull: false,
  },
  project_startdate: {
    type: DataTypes.DATEONLY,
    allowNull: false,
  },
  project_state: {
    type: DataTypes.STRING(64),
    allowNull: false,
  },
  project_location: {
    type: DataTypes.STRING(128),
    allowNull: false,
  },
  project_image: {
    type: DataTypes.STRING(255),
    allowNull: false,
  },
  project_description: {
    type: DataTypes.STRING(255),
    allowNull: false,
  },
}, {
  tableName: 'project',
  timestamps: false,
});

module.exports = Project;
