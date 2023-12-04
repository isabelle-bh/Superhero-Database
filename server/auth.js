const jwt = require('jsonwebtoken');

const auth = (req, res, next) => {
  // Extract the token from the request headers, cookies, or wherever it's stored
  const token = req.headers.Authorization;

  if (!token) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  try {
    // Verify the token and extract user information
    const decoded = jwt.verify(token, '12345');
    req.user = decoded.user;
    next();
  } catch (error) {
    return res.status(401).json({ message: 'Invalid token' });
  }
};

module.exports = auth;
