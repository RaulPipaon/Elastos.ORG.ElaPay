import { create, findById } from 'services/transaction'
import config from 'config/config'

export async function createTransaction(req, res, next) {
    let {
        transactionHash,
        orderId,
        transactionInfor,
        status
    } = req.body

    const transaction = await create({
        transactionHash,
        orderId,
        transactionInfor,
        status
    })

    if (!order) {
        return res.status(500).json({error: 'Error'});
    }
    res.status(200).json({transaction: transaction})
}

export async function transactionDetail(req, res, next) {
    let { id } = req.params

    const transaction = await findById(id)

    if (!transaction) {
        return res.status(500).json({error: 'Error'});
    }
    res.status(200).json({transaction: transaction})
}
