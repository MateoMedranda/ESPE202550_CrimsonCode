const { OAuth2Client } = require('google-auth-library');
const CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
const client = new OAuth2Client(CLIENT_ID);

exports.postOAUTHGoogle= async (req, res) => {
  try {
    const { token } = req.body;
    if (!token) {
      return res.status(400).json({ error: 'Token requerido' });
    }
    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: CLIENT_ID,
    });
    const payload = ticket.getPayload();
    if (payload) {
      res.json({
        email: payload.email,
        given_name: payload.given_name,
        family_name: payload.family_name,
      });
    } else {
      res.status(400).json({ error: 'Token inválido' });
    }
  } catch (error) {
    console.error('Error verifying Google token:', error);
    res.status(500).json({ error: 'Error en autenticación con Google' });
  }
};
