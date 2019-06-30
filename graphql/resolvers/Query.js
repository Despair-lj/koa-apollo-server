import { getUser, isLogin } from '../../config/utils'
import { ValidationError } from '../../config/formatError'

async function feed(
  root,
  { filter, page, pageSize },
  { Article },
  resolveInfo
) {
  const skip = (page - 1) * pageSize
  const regex = new RegExp(filter, 'i')
  const articles = await Article.find({
    $or: [{ title: regex }, { content: regex }]
  })
    .sort({ createdAt: -1 })
    .limit(~~pageSize)
    .skip(~~skip)
  // collection.count is deprecated, and will be removed in a future version. Use collection.countDocuments or collection.estimatedDocumentCount instead
  const count = await Article.find().countDocuments()

  return {
    articles,
    count
  }
}

async function me(root, args, { ctx }) {
  const { user } = await getUser(ctx)
  if (user && user._id !== undefined) {
    return {
      ok: true,
      isAdmin: user.isAdmin
    }
  }
  return {
    ok: false
  }
}

async function users(root, args, { ctx, User }) {
  const user = await isLogin(ctx)
  const isAdmin = user.isAdmin
  if (!isAdmin) {
    throw new ValidationError({
      key: 'createUser',
      message: '你不是管理员,无法创建新用户,请使用注册通道'
    })
  }

  return User.find({ isAdmin: false })
}

export default { feed, me, users }
