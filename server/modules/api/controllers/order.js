import { createOrder, getOrder } from 'services/order'

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

  res.json({order: order})
}

export async function orderDetail(req, res, next) {
  let { id } = req.params

  const order = await getOrder(id)
  res.json({order: order})
}
