const jwt = require('jsonwebtoken');

module.exports = function (req, res, next) {
  req.user = null;
  const header = req.headers.authorization;
  if (!header || !header.startsWith('Bearer ')) {
    return next();
  }

  try {
    const token = header.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (decoded.role === 'user') {
      req.user = decoded;
    }
  } catch (err) {
    // Invalid token — continue as anonymous
  }
  next();
};
