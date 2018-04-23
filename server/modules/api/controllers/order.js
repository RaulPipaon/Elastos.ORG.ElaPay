import Order from 'models/order'

export function create(req, res, next) {
  let { businessInfo, exchangeRate, callbackUrl, returnUrl, email } = req.body

  const order = new Order({
    businessInfo,
    exchangeRate,
    callbackUrl,
    returnUrl,
    email
  })

  order.save(err => {
    if (err) throw err

      res.json({ success: true })
  })
}
