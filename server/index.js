import cluster from 'cluster'
import os from 'os'
import express from 'express'
import morgan from 'morgan'
import config from './config/config'
import mongoose from 'mongoose'
import api from 'modules/api'


const system = express()

system.use('/api', api)
system.get('/', (req, res) => {
  res.json('Landing page')
})

system.use(morgan('dev'))
system.listen(config.serverPort, () => console.log(`Server listen to :${config.serverPort}`))
