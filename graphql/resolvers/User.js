function id(root) {
  return root._id || root.id
}

function votes({ _id }, args, { dataloaders: { voteLoader } }) {
  return voteLoader.load(_id)
}

export default { id, votes }
