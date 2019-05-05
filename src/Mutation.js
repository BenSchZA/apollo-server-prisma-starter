const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

let generateToken = (user) => {
  return jwt.sign(
    {
      id: user.id,
      username: user.email,
    },
    process.env.JWT_SECRET,
    {
      expiresIn: '30d', // token will expire in 30days
    },
  )
};

const Mutation = {
  register: async (parent, { username, password }, ctx, info) => {
    const hashedPassword = await bcrypt.hash(password, 10)
    const user = await ctx.prisma.createUser({
      username,
      password: hashedPassword,
    });

    const token = generateToken(user);
    return {
      token,
      user,
    }
  },
  login: async (parent, { username, password }, ctx, info) => {
    const user = await ctx.prisma.user({ username });

    if (!user) {
      throw new Error('Invalid Login');
    }

    const passwordMatch = await bcrypt.compare(password, user.password);

    if (!passwordMatch) {
      throw new Error('Invalid Login');
    }

    const token = generateToken(user);
    return {
      token,
      user,
    }
  },
};

module.exports = {
  Mutation,
};