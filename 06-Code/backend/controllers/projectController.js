const { Project, Monitoring } = require('../models');
const { Permit } = require('../models');
const { EnvironmentalPlan } = require('../models');

const { Op } = require('sequelize');

exports.getAllProjects = async (req, res) => {
  try {
    const projects = await Project.findAll();
    res.status(200).json(projects);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};

exports.createProject = async (req, res) => {
  try {
    const { name, startDate, image, state, location, description } = req.body;
    if (!name || !startDate || !image || !state || !location || !description) {
      return res.status(400).json({ error: 'All fields are required' });
    }
    const project = await Project.create({
      project_name: name,
      project_startdate: startDate,
      project_image: image,
      project_state: state,
      project_location: location,
      project_description: description,
    });
    res.status(200).json(project);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};

exports.updateProject = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, startDate, image, state, location, description } = req.body;
    const project = await Project.update(
      {
        project_name: name,
        project_startdate: startDate,
        project_image: image,
        project_state: state,
        project_location: location,
        project_description: description,
      },
      { where: { project_id: id } }
    );
    if (project[0] === 0) return res.status(404).json({ error: 'Project not found' });
    res.status(200).json({ message: 'Project updated' });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};

exports.deleteProject = async (req, res) => {
    try {
      const id = parseInt(req.params.id, 10);
      if (isNaN(id)) return res.status(400).json({ error: 'Invalid project ID' });
  
      await EnvironmentalPlan.destroy({ where: { project_id: id } });
      await Monitoring.destroy({ where: { project_id: id } });
      await Permit.destroy({ where: { project_id: id } });
  
      const deleted = await Project.destroy({ where: { project_id: id } });
      if (deleted === 0) return res.status(404).json({ error: 'Project not found' });
  
      res.status(200).json({ message: 'Project deleted' });
    } catch (error) {
      console.error("Error deleting project:", error);
      res.status(500).json({ error: 'Server error' });
    }
  };
  
  

exports.getProjectMonitorings = async (req, res) => {
  try {
    const { id } = req.params;
    const monitorings = await Monitoring.findAll({ where: { project_id: id } });
    res.status(200).json(monitorings);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};

exports.searchProjects = async (req, res) => {
  try {
    const { name, startDate } = req.query;
    const where = {};
    if (name) where.project_name = { [Op.like]: `%${name}%` };
    if (startDate) where.project_startdate = { [Op.gte]: startDate };
    const projects = await Project.findAll({ where });
    res.status(200).json(projects);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};

exports.getLastMonitoring = async (req, res) => {
  try {
    const { projectId } = req.params;
    const monitoring = await Monitoring.findOne({
      where: { project_id: projectId },
      order: [['createdat', 'DESC']],
    });
    if (!monitoring) return res.status(404).json({ error: 'No monitorings found' });
    res.status(200).json(monitoring);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};
exports.getProjectPermits = async (req, res) => {
    try {
      const { projectId } = req.params;
      const permits = await Permit.findAll({ where: { project_id: projectId } });
      res.status(200).json(permits);
    } catch (error) {
      res.status(500).json({ error: 'Server error' });
    }
  };