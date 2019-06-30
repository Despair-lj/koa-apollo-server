import { PubSub } from 'apollo-server-koa'

export const NEW_ARTICLE = 'newArticle'
export const NEW_VOTE = 'newVote'
export const pubsub = new PubSub()
