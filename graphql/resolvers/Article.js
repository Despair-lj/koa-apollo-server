function user({ userId }, args, { dataloaders: { userLoader } }) {
  return userLoader.load(userId)
}

async function votes({ _id }, args, { dataloaders: { voteLoader } }) {
  const v = await voteLoader.load(_id)
  return v
}

function id(root) {
  return root._id || root.id
}

export default { user, votes, id }
