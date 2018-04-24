import {
  create as createOrder,
  orderDetail as getOrder
} from '../controllers/order'


export default app => {
  app.post('/order', createOrder)
  app.get('/order/:id', getOrder)
}
