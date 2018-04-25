import { createOrder, getOrder } from 'services/order'
import config from 'config/config'

export async function create(req, res, next) {
    let {
        orderDesc,
        orderId,
        businessName,
        orderName,
        currency,
        price,
        currencyCode,
        rateAdjustment,
        callbackUrl,
        returnUrl,
        email
    } = req.body

    const order = await createOrder({
        orderDesc,
        orderId,
        businessName,
        orderName,
        currency,
        price,
        currencyCode,
        rateAdjustment,
        callbackUrl,
        returnUrl,
        email
    })

    if (!order) {
        return res.status(500).json({error: 'Error'});
    }
    res.status(200).json({order: order})
}

export async function orderDetail(req, res, next) {
    let { id } = req.params

    const order = await getOrder(id)

    if (!order) {
        return res.status(500).json({error: 'Error'});
    }
    res.status(200).json({order: order})
}
