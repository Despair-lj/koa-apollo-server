import mongoose from 'mongoose'

const Schema = mongoose.Schema
const ObjectId = Schema.Types.ObjectId

const VoteSchema = new Schema({
  articleId: {
    type: ObjectId,
    ref: 'Article'
  },
  userId: {
    type: ObjectId,
    ref: 'User'
  },
  createdAt: {
    type: Date
  },
  updatedAt: {
    type: Date
  }
})

VoteSchema.pre('save', function() {
  const time = Date.now()
  if (this.isNew) {
    this.createdAt = time
  }
  this.updatedAt = time
})

export default mongoose.model('Vote', VoteSchema)
