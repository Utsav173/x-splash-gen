const jwt = require('jsonwebtoken');
const User = require('../models/user');

const authenticateToken = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      return res.status(401).json({ message: 'Token missing' });
    }
    const decoded = jwt.verify(token, 'secret_key');

    if (!decoded.userId) {
      return res.status(401).json({ message: 'Unauthorized' });
    }
    req.user = {
      _id: decoded.userId,
    };
    return next();
  } catch (error) {
    console.log(error);
    return res.status(401).json({ message: 'Unauthorized' });
  }
};

const authenticateAdminToken = async (req, res, next) => {
  try {
    const token = req.headers.authorization;
    if (!token) {
      return res.status(401).json({ message: 'Token missing' });
    }

    const decoded = jwt.verify(token, 'secret_key');
    if (!decoded.id) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    const adminData = await User.findOne({ id: decoded.id, role: 'admin' });
    if (!adminData) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    req.user = decoded;
    return next();
  } catch (error) {
    console.log(error);
    return res.status(401).json({ message: 'Unauthorized' });
  }
};

module.exports = { authenticateAdminToken, authenticateToken };
