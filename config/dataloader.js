import Dataloader from 'dataloader'

async function batchVote(Vote, keys) {
  // const votes = await Vote.find({ _id: { $in: keys } })

  // 返回的结果也和 keys 的长度一致，不然会发生错误
  let vote = await Vote.find({
    $or: [{ userId: { $in: keys } }, { articleId: { $in: keys } }]
  })

  // 返回的数据结构
  // 存在数据 [{_id: abc, articleId: 123}]
  // 不存在数据 []
  const newVote = keys.reduce((acc, key, currentIndex) => {
    const index = vote.findIndex(function(v) {
      return `${v.articleId}` === `${key}` || `${v.userId}` === `${key}`
    })
    if (index !== -1) {
      acc[currentIndex] = [vote[index]]
    }
    return acc
  }, Array.from({ length: keys.length }, () => []))

  return newVote
}

async function batchUser(User, keys) {
  return await User.find({ _id: { $in: keys } })
}

export default ({ Vote, User }) => ({
  voteLoader: new Dataloader(keys => batchVote(Vote, keys), {
    cacheKeyFn: key => key.toString()
  }),
  userLoader: new Dataloader(keys => batchUser(User, keys), {
    cacheKeyFn: key => key.toString()
  })
})
