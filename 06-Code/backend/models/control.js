const { DataTypes } = require('sequelize');
const sequelize = require('../database/sequelize');

const Control = sequelize.define('control', {
    control_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    activity_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    control_createdby: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    control_criterion: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    control_observation: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    control_evidence: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    control_verification: {
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
    tableName: 'control',
    timestamps: false,
});

module.exports = Control;
