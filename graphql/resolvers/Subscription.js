import { NEW_ARTICLE, NEW_VOTE, pubsub } from '../subscriptionName'

const newArticle = {
  subscribe: () => pubsub.asyncIterator(NEW_ARTICLE)
}

const newVote = {
  subscribe: () => pubsub.asyncIterator(NEW_VOTE)
}

export default { newArticle, newVote }
