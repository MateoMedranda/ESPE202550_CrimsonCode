const jwt = require('jsonwebtoken');
const secret = process.env.JWT_SECRET || 'my_secret_key';

function generateToken(payload) {
  return jwt.sign(payload, secret, { expiresIn: '1h' });
}

function verifyToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) return res.status(401).json({ message: 'Token required' });

  jwt.verify(token, secret, (err, user) => {
    if (err) return res.status(403).json({ message: 'Invalid or expired token' });

    req.user = user;
    next();
  });
}

module.exports = {
  generateToken,
  verifyToken,
};
