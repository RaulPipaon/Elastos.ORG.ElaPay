# Elapay API Document
## Payment request interface

### API: /api/order
- Method: POST
- Request params:
```javascript
elaAmount,
exchangeRate,
queryTime,
orderDesc,
businessName,
orderName,
currency,
price,
callbackUrl,
returnUrl,
email,
walletAddress
```
- Response: code: 200, order, transtions object.

### API: /api/order/:id
- Method: GET
- Request params: order id.
## User payment notification interface
### API: /api/transaction
- Method: POST
- Request params:
```javascript
orderId,
status
```
- Response: code: 200, order object.

### API: /api/transaction/:id
- Method: GET
- Request params: transaction id.
- Response: code: 200, transtions object.

### API: /api/transaction/status
- Method: PUT
- Request params:
```javascript
id,
status
```
- Response: code: 200.

### API: /api/getamountinela
- Method: GET
- Request params:
```javascript
symbol,
amount
```
- Response: code: 200.

### API: /api/gettxdetails
- Method: GET
- Request params:
```javascript
txhash
```
- Response: code: 200.

### API: /api/subscribewithdetails
- Method: POST
- Request params:
```javascript
senderaddress,
receiveraddress,
elaamount,
callbackurl
```
- Response: code: 200.

### API: /api/posttxdetailsforcallback
- Method: POST
- Request params:
```javascript
txhash,
callbackurl
```
- Response: code: 200.