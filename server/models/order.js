import mongoose from 'config/mongoose'

const schema = mongoose.Schema({
  orderName: String,
  orderDesc: String,
  orderId: String,
  businessName: String,
  currency: String,
  price: Number,
  currencyCode: String,
  rateAdjustment: String,
  callbackUrl: String,
  returnUrl: String,
  email: String,
  createdDate: Date
})

export default mongoose.model('Order', schema)
