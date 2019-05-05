const Query = {
  hello: () => "Hello World",
  currentUser: (parent, args, { user, prisma }) => {
    // this if statement is our authentication check
    if (!user) {
      throw new Error('Not Authenticated');
    }
    return prisma.user({ id: user.id });
  },
}

module.exports = {
  Query,
};