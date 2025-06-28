const { DataTypes } = require('sequelize');
const sequelize = require('../database/sequelize');

const Control = sequelize.define('Control', {
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
        allowNull: true,
    },
    control_evidence: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    control_verificaction: {
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
    tableName: 'Control',
    timestamps: false,
});

module.exports = Control;
