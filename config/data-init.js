// 初始化数据
import mongoose from 'mongoose'
import bcrypt from 'bcrypt'
import uuidV4 from 'uuid/v4'
import { dbPath } from '../mongodb'
import { Article, User } from '../mongodb/schema'

async function run() {
  const db = await mongoose.connect(dbPath, {
    useNewUrlParser: true
  })
  const ljPassword = await bcrypt.hash('iamlj', 12)
  const ljUserPassword = await bcrypt.hash('iamlj', 12)
  const user = await User.insertMany([
    {
      username: 'lj',
      email: 'lj@email.com',
      isAdmin: true,
      password: ljPassword,
      createdAt: Date.now(),
      updatedAt: Date.now(),
      refreshSecret: uuidV4()
    },
    {
      username: 'lj-user',
      email: 'lj1@email.com',
      password: ljUserPassword,
      createdAt: Date.now(),
      updatedAt: Date.now(),
      refreshSecret: uuidV4()
    }
  ])

  await Article.insertMany([
    {
      title: 'title 1',
      content: 'content 1',
      userId: user[0]._id,
      createdAt: Date.now(),
      updatedAt: Date.now()
    },
    {
      title: 'title 2',
      content: 'content 2',
      userId: user[0]._id,
      createdAt: Date.now(),
      updatedAt: Date.now()
    },
    {
      title: 'title 3',
      content: 'content 3',
      userId: user[1]._id,
      createdAt: Date.now(),
      updatedAt: Date.now()
    }
  ])

  db.disconnect()
}

run()
