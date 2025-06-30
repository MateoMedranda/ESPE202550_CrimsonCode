const { DataTypes } = require('sequelize');
const sequelize = require('../database/sequelize'); 

const Permit = sequelize.define('Permit', {
  permit_id: {
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
  permit_name: {
    type: DataTypes.STRING(128),
    allowNull: false,
  },
  permit_description: {
    type: DataTypes.STRING(256),
    allowNull: false,
  },
  permit_archive: {
    type: DataTypes.STRING(256),
    allowNull: false,
  },
}, {
  tableName: 'permit',
  timestamps: false,
});

module.exports = Permit;