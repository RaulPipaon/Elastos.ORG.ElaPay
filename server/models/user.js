import mongoose from 'config/mongoose'

const schema = mongoose.Schema({
  username: String,
  password: String,
  admin: Boolean,
  email: String,
  address: String
})

export default mongoose.model('User', schema)
