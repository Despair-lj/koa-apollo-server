function user({ userId }, args, { dataloaders: { userLoader } }) {
  return userLoader.load(userId)
}

function article({ articleId }, args, { Article }) {
  return Article.findById(articleId)
}

function id(root) {
  return root._id || root.id
}

export default { user, article, id }
