const jwt = require("jsonwebtoken");
const { google } = require("googleapis");
const nodemailer = require("nodemailer");


const oauth2Client = new google.auth.OAuth2(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  process.env.GOOGLE_REDIRECT_URI
);

oauth2Client.setCredentials({ refresh_token: process.env.GOOGLE_REFRESH_TOKEN });

exports.postInvite = async (req, res) => {
  const { email } = req.body;

  if (!email) return res.status(400).json({ error: "Email requerido" });

  try {
    const token = jwt.sign({ email }, process.env.JWT_SECRET, { expiresIn: "1h" });
    const inviteLink = `https://espe202550-crimsoncode.onrender.com/registro?token=${token}`;

    const accessToken = await oauth2Client.getAccessToken();

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        type: "OAuth2",
        user: process.env.GMAIL_USER,
        clientId: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        refreshToken: process.env.GOOGLE_REFRESH_TOKEN,
        accessToken: accessToken.token
      }
    });

    await transporter.sendMail({
      from: `"Sistema" <${process.env.GMAIL_USER}>`,
      to: email,
      subject: "Invitación para registro",
      html: `
        <h3>Registro en el sistema de SIMA</h3>
        <p>Haz clic en el enlace para registrarte (válido por 1 hora):</p>
        <a href="${inviteLink}" target="_blank">${inviteLink}</a>
      `
    });

    res.json({ message: "Invitación enviada" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error enviando invitación" });
  }
};

exports.getValidateToken = async (req, res) => {
  const { token } = req.query;

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    res.json({ valid: true, email: decoded.email });
  } catch (err) {
    res.status(400).json({ valid: false, error: "Token inválido o expirado" });
  }
};
