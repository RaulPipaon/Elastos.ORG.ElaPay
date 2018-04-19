import cluster from 'cluster'
import os from 'os'
import express from 'express'
import morgan from 'morgan'
import config from './config/config'
import mongoose from 'mongoose'
import api from 'modules/api'

if (cluster.isMaster) {
  const numWorkers = os.cpus().length
  console.log('numWorkers', numWorkers)

  for (let i = 0; i < numWorkers; i++) {
    cluster.fork()
  }

  cluster.on('exit', (worker, code, signal) => {
    console.log('Worker ' + worker.process.pid + ' died with code: ' + code + ', and signal: ' + signal)
    console.log('Starting a new worker')
    cluster.fork()
  })

} else {
  const system = express()

  system.use('/api', api)
  system.get('/', (req, res) => {
    res.json('Landing page')
  })

  system.use(morgan('dev'))
  system.listen(config.serverPort, () => console.log(`Server listen to :${config.serverPort}`))
}
