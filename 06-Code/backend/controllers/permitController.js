const { Permit } = require('../models');

exports.getAllPermits = async (req, res) => {
  try {
    const permits = await Permit.findAll();
    res.status(200).json(permits);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};

exports.createPermit = async (req, res) => {
  try {
    const { name, description, file, idProject } = req.body;
    if (!name || !description || !file || !idProject) {
      return res.status(400).json({ error: 'All fields are required' });
    }
    const permit = await Permit.create({
      permit_name: name,
      permit_description: description,
      permit_archive: file,
      project_id: idProject,
    });
    res.status(200).json(permit);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};

exports.updatePermit = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, file } = req.body;
    const permit = await Permit.update(
      {
        permit_name: name,
        permit_description: description,
        permit_archive: file,
      },
      { where: { permit_id: id } }
    );
    if (permit[0] === 0) return res.status(404).json({ error: 'Permit not found' });
    res.status(200).json({ message: 'Permit updated' });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};

exports.deletePermit = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await Permit.destroy({ where: { permit_id: id } });
    if (deleted === 0) return res.status(404).json({ error: 'Permit not found' });
    res.status(200).json({ message: 'Permit deleted' });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};

