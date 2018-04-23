import mongoose from 'config/mongoose'

const schema = mongoose.Schema({
  businessInfo: String,
  exchangeRate: String,
  callbackUrl: String,
  returnUrl: String,
  email: String
})

export default mongoose.model('Order', schema)
