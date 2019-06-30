import mongoose from 'mongoose'
import uuidV4 from 'uuid/v4'

const Schema = mongoose.Schema

const UserSchema = new Schema({
  fbId: Number,
  username: {
    type: String,
    minlength: 2,
    maxlength: 10
  },
  email: {
    type: String,
    unique: true
  },
  password: {
    type: String
  },
  refreshSecret: {
    type: String,
  },
  isAdmin: {
    type: Boolean,
    default: false
  },
  isDelete: {
    type: Boolean,
    default: false
  },
  createdAt: {
    type: Date
  },
  updatedAt: {
    type: Date
  }
})

UserSchema.pre('save', function() {
  const time = Date.now()
  if (this.isNew) {
    this.createdAt = time
    this.refreshSecret = uuidV4()
  }
  this.updatedAt = time
})

export default mongoose.model('User', UserSchema)
