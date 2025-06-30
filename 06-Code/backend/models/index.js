const Project = require('./Project');
const Monitoring = require('./Monitoring');
const Permit = require('./Permit');

Project.hasMany(Monitoring, { foreignKey: 'project_id' });
Project.hasMany(Permit, { foreignKey: 'project_id' });

Monitoring.belongsTo(Project, { foreignKey: 'project_id' });
Permit.belongsTo(Project, { foreignKey: 'project_id' });

module.exports = {
  Project,
  Monitoring,
  Permit,
};
