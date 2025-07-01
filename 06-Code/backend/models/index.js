const Project = require('./project');
const Monitoring = require('./monitoring');
const Permit = require('./permit');
const EnvironmentalPlan = require('./environmentalPlan') 

Project.hasMany(Monitoring, { foreignKey: 'project_id' });
Project.hasMany(Permit, { foreignKey: 'project_id' });
Project.hasMany(EnvironmentalPlan, { foreignKey: 'project_id' }); 

Monitoring.belongsTo(Project, { foreignKey: 'project_id' });
Permit.belongsTo(Project, { foreignKey: 'project_id' });
EnvironmentalPlan.belongsTo(Project, { foreignKey: 'project_id' }); 

module.exports = {
  Project,
  Monitoring,
  Permit,
  EnvironmentalPlan, 
};
