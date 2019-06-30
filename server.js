import Koa from 'koa'
import cors from 'koa2-cors'
import { ApolloServer, gql } from 'apollo-server-koa'
import database from './mongodb'
import { resolvers, schema } from './graphql'
import * as mongo from './mongodb/schema'
import formatError from './config/formatError'
import buildDataloader from './config/dataloader'

const PORT = '4000'
const typeDefs = gql(schema)
const app = new Koa()

app.use(
  cors({
    credentials: true
  })
)

// https://stackoverflow.com/questions/53350980/cant-access-req-from-context
const context = async ({ ctx }) => {
  return { ...mongo, ctx, dataloaders: buildDataloader(mongo) }
}
const server = new ApolloServer({ typeDefs, resolvers, context, formatError })
// https://github.com/apollographql/apollo-server/issues/1462
const httpServer = app.listen(PORT, () => {
  console.log(
    `🚀 Server ready at http://localhost:${PORT}${server.graphqlPath}`
  )
  console.log(
    `🚀 Subscriptions ready at ws://localhost:${PORT}${
      server.subscriptionsPath
    }`
  )
})

server.applyMiddleware({ app })
server.installSubscriptionHandlers(httpServer)

database()
