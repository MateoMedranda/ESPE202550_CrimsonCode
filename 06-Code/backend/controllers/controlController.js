const multer = require("multer");
const upload = multer({ dest: "uploads/" }); 
const cloudinary = require("../cloudinary");
const control = require("../models/control");

exports.getAllControlls = async (req, res) => {
  try {
    const { activityId } = req.params;
    const controls = await control.findAll({ where: { activity_id: activityId } });
    res.status(200).json(controls);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getControllById = async (req, res) => {
  try {
    const controlObject = await control.findOne({
      where: { activity_id: req.params.activityId, control_id: req.params.controlId }
    });
    if (!controlObject) {
      return res.status(404).json({ message: "The control was not found or does not exist" });
    }
    res.status(200).json(controlObject);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.createControll = [
  upload.single("evidence"), 
  async (req, res) => {
    try {
      const activity_id = req.params.activityId;
      const { createdby, criterion, observation, verification } = req.body;

      if (!activity_id || isNaN(Number(activity_id)) || !createdby || !criterion || !observation || !verification) {
        return res.status(400).json({ message: "Empty parameters are not allowed or the format is incorrect" });
      }

      if (!req.file) {
        return res.status(400).json({ message: "PDF evidence file is required" });
      }

      const result = await cloudinary.uploader.upload(req.file.path, {
        resource_type: "raw"
      });

      const newControl = await control.create({
        activity_id,
        control_createdby: createdby,
        control_criterion: criterion,
        control_observation: observation,
        control_evidence: result.secure_url, 
        control_verification: verification
      });

      res.status(201).json(newControl);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  }
];

exports.updateControll = [
  upload.single("evidence"), 
  async (req, res) => {
    try {
      const id = req.params.controlId;

      const controlObject = await control.findByPk(id);
      if (!controlObject) {
        return res.status(404).json({ message: "Control not found" });
      }

      const { createdby, criterion, observation, verification } = req.body;
      let evidenceUrl = controlObject.control_evidence;

      if (req.file) {
        const result = await cloudinary.uploader.upload(req.file.path, {
          resource_type: "raw"
        });
        evidenceUrl = result.secure_url;
      }

      await controlObject.update({
        control_createdby: createdby || controlObject.control_createdby,
        control_criterion: criterion || controlObject.control_criterion,
        control_observation: observation || controlObject.control_observation,
        control_evidence: evidenceUrl,
        control_verification: verification || controlObject.control_verification
      });

      res.status(200).json(controlObject);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  }
];

exports.deleteControll = async (req, res) => {
  try {
    const id = req.params.controlId;
    const { verification } = req.body;

    if (verification === undefined) {
      return res.status(400).json({ message: "Missing 'verification' field in request body" });
    }

    const controlObject = await control.findByPk(id);
    if (!controlObject) {
      return res.status(404).json({ message: "Control not found" });
    }

    await controlObject.update({
      control_verification: verification
    });

    res.status(200).json(controlObject);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
