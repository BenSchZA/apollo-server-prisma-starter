const jwt = require('jsonwebtoken');

const getUser = token => {
  try {
    if (token) {
      return jwt.verify(token, process.env.JWT_SECRET);
    }
    return null;
  } catch (err) {
    return null;
  }
}

const generateToken = (user) => {
  return jwt.sign(
    {
      id: user.id,
      username: user.username,
    },
    process.env.JWT_SECRET,
    {
      expiresIn: '30d', // token will expire in 30days
    },
  )
};

module.exports = {
  getUser,
  generateToken,
}