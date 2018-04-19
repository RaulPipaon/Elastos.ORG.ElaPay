import config from 'recursive-config'

export default config.load({
  defaults: {
    amqpHost: 'amqp://localhost',
    httpProvider: 'http://localhost:8545'
  }
})
