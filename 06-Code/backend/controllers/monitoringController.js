const { Monitoring } = require('../models');
const fs = require('fs').promises;
const path = require('path');

exports.getAllMonitorings = async (req, res) => {
  try {
    const monitorings = await Monitoring.findAll();
    res.status(200).json(monitorings);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};

exports.createMonitoring = async (req, res) => {
  try {
    const { idProject, name, description, observations, image, file, folder } = req.body;
    if (!idProject || !name || !description || !observations || !image || !file || !folder) {
      return res.status(400).json({ error: 'All fields are required' });
    }
    const monitoring = await Monitoring.create({
      project_id: idProject,
      monitoring_name: name,
      monitoring_description: description,
      monitoring_observations: observations,
      monitoring_image: image,
      monitoring_evidence: file,
      monitoring_folder: folder,
    });
    res.status(200).json(monitoring);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};

exports.updateMonitoring = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, observations, image, file, folder } = req.body;
    const monitoring = await Monitoring.update(
      {
        monitoring_name: name,
        monitoring_description: description,
        monitoring_observations: observations,
        monitoring_image: image,
        monitoring_evidence: file,
        monitoring_folder: folder,
      },
      { where: { monitoring_id: id } }
    );
    if (monitoring[0] === 0) return res.status(404).json({ error: 'Monitoring not found' });
    res.status(200).json({ message: 'Monitoring updated' });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};

exports.deleteMonitoring = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await Monitoring.destroy({ where: { monitoring_id: id } });
    if (deleted === 0) return res.status(404).json({ error: 'Monitoring not found' });
    res.status(200).json({ message: 'Monitoring deleted' });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};

exports.getMonitoringFile = async (req, res) => {
  try {
    const { id } = req.params;
    const monitoring = await Monitoring.findByPk(id);
    if (!monitoring) return res.status(404).json({ error: 'Monitoring not found' });
    const filePath = path.join(__dirname, '../uploads', monitoring.monitoring_evidence);
    const file = await fs.readFile(filePath);
    res.setHeader('Content-Type', 'application/pdf'); // Adjust based on file type
    res.status(200).send(file);
  } catch (error) {
    res.status(error.code === 'ENOENT' ? 404 : 500).json({ error: error.code === 'ENOENT' ? 'File not found' : 'Server error' });
  }
};