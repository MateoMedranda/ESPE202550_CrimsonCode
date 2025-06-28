const { DataTypes } = require("sequelize");
const sequelize = require('../database/sequelize');

const Activity = sequelize.define('activity', {
    activity_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    environmentalplan_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    activity_aspect: {
        type: DataTypes.TEXT,
        allowNull: false,
    },
    activity_impact: {
        type: DataTypes.TEXT,
        allowNull: false,
    },
    activity_measure: {
        type: DataTypes.TEXT,
        allowNull: false,
    },
    activity_verification: {
        type: DataTypes.TEXT,
        allowNull: false,
    },
    activity_frecuency: {
        type: DataTypes.TEXT,
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
  tableName: 'activity',
  timestamps: false,  
});

module.exports = Activity;
