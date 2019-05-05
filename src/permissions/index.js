const { rule, and, shield } = require('graphql-shield');

const rules = {
  isAuthenticatedUser: rule()((parent, args, { user, prisma }) => {
    if (!user) {
      throw new Error('Not Authenticated');
    }
    return Boolean(user);
  }),
}

const permissions = shield({
  Query: {
    currentUser: rules.isAuthenticatedUser,
  },
  Mutation: {
  },
});

module.exports = {
  permissions,
};
