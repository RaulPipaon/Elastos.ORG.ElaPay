Order payment consists of the following three services and a WEB wallet.

1. ElaPay Service
2. Listening to trading service
3. Query exchange rate service
4. Web Wallet

#### structure
<img src="https://github.com/elastos/Elastos.ELA.Pay/raw/master/struct.png" width="420px;" alt="structure">
 

### ElaPay Service (ElaPay服务)

  - Checkout Frontend (收银台前台页面)

    - Page content (页面内容)
      - title
        Order title (订单标题)
      - desc
        Order description information (订单描述信息)
      - shop
        Business Name (商家名称)
      - orderid
        Unique order id (唯一订单号)
      - price by currency
      - price by ELA
    - Multi-currency support (多币种支持)
      According to the USDA price of the ELA on the fire currency, the price is calculated based on the exchange rate between the specified currency type and the U.S. dollar.
      (按火币上ELA的USDT价格作为基础，再根据指定货币类型与美元的汇率计算价格)

  - Backend (后台)

    - Feature (功能)

      - Implement functional processes (实现功能流程)
      - Email notification (实现邮件通知)
        Email notification for events such as payment initiation and payment success
        (发起支付、支付成功等事件的邮件通知)
      - Integrate other modules (集成其它模块)
      - Take full account of business process robustness (充分考虑业务流程健壮性)
      - Save data to database (使用数据库保存数据)
      - Implement API interface (提供API接口)

    - API

      - Payment request interface (支付请求接口)

        - Feature
          - Save request records to the database (保存请求记录到数据库)
          - Calculate the exchange rate (计算汇率)
          - Redirect to the frontend page (重定向到前台收银台页面)
        - Input
          - Order infomation (订单信息)
          - Business information (商户信息)
          - exchange rate adjustExchange rate adjustment. Currency exchange rate with ELA can be adjusted up or down.
          (法币与ELA兑换的汇率调整，可以调高或者调低)
          - Payment result callback URL (支付结果回调URL)
          - Frontend return URL (前台返回页面URL)
          - Subscription notification email address (订阅通知邮件地址)
        - Output
          - Success or Failure (成功 or 失败)

      - Exchange rate query interface (汇率查询接口)
      
        Based on the real-time price of ELA/USDT on the [Huobi.pro](http://Huobi.pro) and the exchange rate between the currencies of the foreign exchange market and the U.S. dollar
        (按火币上与USDT的实时价格作为基础，再与外汇市场各国货币与美元的汇率计算价格)

        - Input
          - Currency Code (货币类型代码)
          - Amount (数量)
          - Exchange rate adjustment (汇率调整比率)
            Exchange rate adjustment between Currency and ELA can be adjusted up or down
            法币与ELA兑换的汇率调整，可以调高或者调低
        - Output
          - ELA amount (ELA数量)
          - Exchange rate of ELA/USDT on the [Huobi.pro](http://Huobi.pro)(火币ELA/USDT汇率)
          - Exchange rate query time (汇率的时间)

      - Subscribe transaction status change notification interface (订阅交易状态变更通知接口)

        - Input
          - Transaction hash (交易hash)
          - Result callback URL (结果回调URL)
        - Output
          - If the transaction is complete, return the result directly (如果交易已经完成，则直接返回结果)
          - If the transaction is not completed, return the subscription success or failure (如果交易未完成，则返回订阅成功或失败)

      - User payment notification interface (用户付款通知接口)
        Called by the wallet page to hear that the user has initiated a payment transaction in the wallet
        (由钱包页面调用，用于收听用户已在钱包发起支付交易的通知)

        - Input
          - Transaction hash (交易hash)
          - The unique transaction id (唯一交易流水号)
        - Output
          - none 无

    - Database

      - Order payment request (订单支付请求)
        Record complete payment request and generate unique transaction serial number for order
        记录完整的支付请求，生成针对订单的唯一交易流水号
      - Transaction Record (交易记录)
        Record the transaction information and status corresponding to the transaction hash, and associate orders
        记录交易hash对应的交易信息、状态，关联订单

### Listening to trading service (监听交易服务)

  Listen to the new block in the background to find the transaction information that is subscribed
  (后台监听新增区块，查找被订阅的交易信息)

  - Feature
    - Provide transaction query interface (提供交易查询接口)
    - Provide transaction subscription interface to put subscription information into the database (提供交易订阅接口，将订阅信息放入数据库)
    - Poll the block information in the background, parse all transaction information and save it to the database (后台轮询区块信息，解析全部交易信息并保存到数据库)
    - Subscribe to subscribers by subscription callback (按订阅情况回调通知订阅者)
  - Query transaction interface (查询交易接口)
    - Feature
      Query the information of the specified transaction, if it is already in the blockchain, return the details and the blockchain explorer URL
      (查询指定交易的信息，如果已经上链，则返回详细信息和区块链浏览器URL)
    - Input
      - transaction hash
    - Output
      - transaction detail infomation
      - The blockchain explorer URL for the transaction (对应交易的区块链浏览器URL)
  - Subscription transaction status change interface (with transaction hash) (按交易hash订阅交易状态变更接口)
    - Input
      - transaction hash (交易hash)
      - Callback notification URL (回调通知URL)
    - Output
      - Transaction details (交易详细信息)
      - The blockchain explorer URL for the transaction (对应交易的区块链浏览器URL)
  - Subscription transaction status change interface (with information) (按信息订阅交易状态变更接口)
    - Input
      - Receiver address (收钱地址)
      - Sender address (发送地址)
      - ELA amount
      - Callback notification URL (回调通知URL)
    - Output
      - Transaction details (交易详细信息)
      - The blockchain explorer URL for the transaction (对应交易的区块链浏览器URL)

### Query exchange rate service (查询汇率服务)

  - Feature

    - Provide query interface (提供查询接口)
    - Get real-time prices from [huobi.pro](http://huobi.pro) (连接火币查价格)
    - Get real-time prices from the foreign exchange market (连接外汇交易中心查询法币汇率)

  - Query Exchange rate interface (汇率查询接口)

    ​

    按火币上与USDT的实时价格作为基础，再与外汇市场各国货币与美元的汇率计算价格

    - Input
      - Currency code (货币类型代码)
      - amount (数量)
    - Output
      - ELA amount (ELA数量)
      - ELA/USDT exchange rates for [huobi.pro](http://huobi.pro) (火币ELA/USDT汇率)
      - Exchange rate time (汇率的时间)

### Web Wallet (网页钱包)

  - Quick payment page (快捷支付页面)

    The quick page for order payment in the web wallet automatically includes the order information, target address, ELA quantity, and usage order information to fill in transaction notes
    (在Web钱包里针对订单付款的快捷页面，自动包含订单信息、目标地址、ELA数量和使用订单关联信息填写到交易备注)

    - Input
      - The unique transaction id (订单交易唯一流水号)
      - ELA amount (ELA数量)
      - Simple order information (简要订单信息)
      - Receipt address (目标收款地址)
      - Frontend return URL (前端跳转返回URL)

  - Package unique transaction id into transaction content (将唯一交易流水号打包进交易内容)
    Remarks information packaged into the transaction and written to the blockchain
    (修改钱包后台代码，将备注信息打包到交易里并写到链上)

  - Transaction history of the order is displayed in the transaction history of the wallet (钱包里交易记录增加真对订单的交易记录)

  - Callback ElaPay backend service (回调elapay后台)
    After the user completes the payment, the specified URL is notified
    (用户完成支付以后，向指定URL发出post通知)

  - Return to the business frontend results page (跳转到商家前端结果页面)
    Front page automatically jumps to the specified URL (前端页面自动跳转到指定的URL)
