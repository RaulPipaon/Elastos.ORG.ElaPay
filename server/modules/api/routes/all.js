import elaprices from 'modules/api/controllers/elaprice'
import querytx from 'modules/api/controllers/querytx'
import subscribewithdetails from 'modules/api/controllers/subscriptiondetails'
import subscribewithtx from 'modules/api/controllers/subscriptionhash'
import {
  create as createOrder,
  orderDetail as getOrder
} from '../controllers/order'

export default app => {
  app.post('/order', createOrder)
  app.get('/order/:id', getOrder)
  app.get('/elaprices', elaprices.details);
  app.get('/querytx', querytx.details);
  app.post('/subscribewithdetails', subscribewithdetails.details);
  app.post('/subscribewithtx', subscribewithtx.details);
}
