const jwt = require('jsonwebtoken');
const { ADMIN_ROLE } = require('../constants/user');

const verifyToken = (req, res, next) => {
  jwt.verify(req.get('token'), process.env.JWT_SEED, (err, decoded) => {
    if(err) {
      return res.status(401).json({
        ok: false,
        err,
      });
    }
    req.user = decoded.userDB;
    return next();
  });
}

const verifyAdminRole = (req, res, next) => {
  const { role } = req.user;

  if(role === ADMIN_ROLE) {
    return next();
  }

  return res.status(401).json({
    ok: false,
    message: 'You don\'t have permissions to perform this action',
  });
}

const verifyURLToken = (req, res, next) => {
  const { token } = req.query;

  jwt.verify(token, process.env.JWT_SEED, (err, decoded) => {
    if(err) {
      return res.status(401).json({
        ok: false,
        err,
      });
    }

    req.user = decoded.userDB;
    return next();
  });
}

module.exports = {
  verifyToken,
  verifyAdminRole,
  verifyURLToken,
};
