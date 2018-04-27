import mongoose from 'config/mongoose'

const schema = mongoose.Schema({
    transactionHash: String,
    orderId: String,
    transactionInfor: String,
    status: String,
    createdDate: Date
})

export default mongoose.model('Transaction', schema)
