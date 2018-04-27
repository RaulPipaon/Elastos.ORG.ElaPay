import Order from 'models/order'

export function createOrder(options) {
    let {
        elaAmount,
        exchangeRate,
        queryTime,
        orderName,
        orderDesc,
        businessName,
        currency,
        price,
        callbackUrl,
        returnUrl,
        email,
        walletAddress
    } = options

    let createdDate = new Date()

    const order = new Order({
        elaAmount,
        exchangeRate,
        queryTime,
        orderName,
        orderDesc,
        businessName,
        currency,
        price,
        callbackUrl,
        returnUrl,
        email,
        createdDate,
        walletAddress
    })

    return order.save()
}

export function getOrder(id) {
    return Order.findById(id)
}
