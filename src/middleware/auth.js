const jwt = require('jsonwebtoken');

module.exports = async (req, res, next) => {
  try {
    const token = req.headers.authorization.split(' ')[1];
    const decoded = jwt.verify(token, 'java_game');
    req.user = decoded;
    next();
  } catch (error) {
    res.sendStatus(401);
  }
};
