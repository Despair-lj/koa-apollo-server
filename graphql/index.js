import fs from 'fs'
import path from 'path'
import Article from './resolvers/Article'
import Mutation from './resolvers/Mutation'
import Query from './resolvers/Query'
import Vote from './resolvers/Vote'
import Subscription from './resolvers/Subscription'
import User from "./resolvers/User";


const resolvers = {
  Query,
  Mutation,
  Article,
  Vote,
  User,
  Subscription
}

const schema = fs.readFileSync(
  path.join(__dirname, './schema.graphql'),
  'utf8'
)

export { resolvers, schema }
