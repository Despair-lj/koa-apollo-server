import mongoose from 'mongoose'

export const dbPath = 'mongodb://localhost:27017/graphqlBlog'

const database = () => {
  mongoose.set('debug', true)
  // collection.ensureIndex is deprecated. Use createIndexes instead.
  // https://github.com/Automattic/mongoose/issues/6890
  mongoose.set('useCreateIndex', true)
  mongoose.connect(dbPath, {
    useNewUrlParser: true,
    autoReconnect: true
  })
  mongoose.connection.on('disconnected', () => {
    mongoose.connect(dbPath, {
      useNewUrlParser: true
    })
  })
  mongoose.connection.on('error', err => {
    console.error('mongoose connect err: ', err)
  })

  mongoose.connection.on('open', async () => {
    console.log('connected to MongoDB ', dbPath)
  })
}

export default database
