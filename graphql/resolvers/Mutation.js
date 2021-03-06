import bcrypt from 'bcrypt'
import {
  APP_SECRET,
  EXPIRES_TOKEN,
  EXPIRES_REFRESH_TOKEN,
  isLogin,
  setCookie
} from '../../config/utils'
import { createTokens } from '../../config/auth'
import { pubsub, NEW_ARTICLE, NEW_VOTE } from '../subscriptionName'
import { ValidationError } from '../../config/formatError'

// 新增文章
async function post(root, data, { Article, ctx }) {
  const user = await isLogin(ctx)
  const newArticle = Object.assign({ userId: user._id }, data)
  const response = await Article.create(newArticle)
  // 发送订阅 NEW_ARTICLE
  pubsub.publish(NEW_ARTICLE, { newArticle: response })
  return response
}

// 注册
async function signup(root, args, { User }) {
  const u = await User.findOne({ email: args.email })
  if (u) {
    throw new ValidationError({
      key: 'signup',
      message: `注册失败, 原因: 该邮箱已被注册`
    })
  }
  const hashedPassword = await bcrypt.hash(args.password, 12)
  try {
    const newUser = Object.assign(args, { password: hashedPassword })
    const response = await User.create(newUser)
    return {
      ok: true
    }
  } catch (error) {
    throw new ValidationError({
      key: 'signup',
      message: `注册失败, 原因: ${error.message}`
    })
  }
}

// 登录
async function login(root, { email, password }, { User, ctx }) {
  const user = await User.findOne({ email })
  if (!user) {
    throw new ValidationError({
      key: 'login',
      message: '登录错误: 该邮箱没有注册'
    })
  }

  const valid = await bcrypt.compare(password, user.password)
  if (!valid) {
    throw new ValidationError({
      key: 'login',
      message: '错误的密码'
    })
  }

  if (user.isDelete) {
    throw new ValidationError({
      key: 'login',
      message: '登录错误: 该账号已被冻结'
    })
  }

  const [token, refreshToken] = await createTokens(
    user,
    APP_SECRET,
    user.refreshSecret
  )

  setCookie(ctx, token, refreshToken)

  return {
    ok: true,
    isAdmin: user.isAdmin
  }
}

// 退出登录
async function logout(root, args, { ctx }) {
  setCookie(ctx, '', '', -1, -1)

  return {
    ok: true
  }
}

// 创建用户
async function createUser(root, args, context) {
  const user = await isLogin(context.ctx)
  const isAdmin = user.isAdmin
  if (!isAdmin) {
    throw new ValidationError({
      key: 'createUser',
      message: '你不是管理员,无法创建新用户,请使用注册通道'
    })
  }
  return signup(root, args, context)
}

// 改变用户状态
async function changeUserStatus(root, { userId, status }, { User, ctx }) {
  const user = await isLogin(ctx)
  const isAdmin = user.isAdmin
  if (!isAdmin) {
    throw new ValidationError({
      key: 'deleteUser',
      message: '你不是管理员,无法删除用户'
    })
  }
  try {
    await User.updateOne({ _id: userId }, { isDelete: status })
    return {
      ok: true
    }
  } catch (error) {
    throw new ValidationError({
      key: 'deleteUser',
      message: `冻结用户错误, 原因: ${error.message}`
    })
  }
}

// 点赞文章
async function vote(root, { articleId }, { Vote, ctx }) {
  const user = await isLogin(ctx)
  const userId = user._id
  const articleExists = await Vote.findOne({ userId, articleId })
  if (articleExists) {
    throw new ValidationError({
      key: 'vote',
      message: '该文章已经点赞'
    })
  }

  const vote = await Vote.create({
    userId,
    articleId
  })

  pubsub.publish(NEW_VOTE, { newVote: vote })

  return vote
}

export default {
  createUser,
  changeUserStatus,
  signup,
  login,
  logout,
  post,
  vote
}
