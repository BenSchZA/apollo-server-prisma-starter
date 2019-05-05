require('dotenv').config();

const { ApolloServer } = require('apollo-server');
const { importSchema } = require('graphql-import');
const { getUser } = require('./utils');
const typeDefs = importSchema('src/schema.graphql');
const resolvers = require('./resolvers');

const { applyMiddleware } = require('graphql-middleware');
const { makeExecutableSchema } = require('graphql-tools');
const { permissions } = require('./permissions');

const { prisma } = require('./generated/prisma-client/index');

const schema = applyMiddleware(
  makeExecutableSchema({
      typeDefs,
      resolvers
  }),
  permissions
);

const server = new ApolloServer({
  schema,
  context: ({ req }) => {
    const tokenWithBearer = req.headers.authorization || '';
    const token = tokenWithBearer.split(' ')[1];
    const user = getUser(token);

    return {
      user,
      prisma, // the generated prisma client if you are using it
    }
  },
})

server
  .listen({
    port: 8383
  })
  .then(info => console.log(`Server started on http://localhost:${info.port}`));
