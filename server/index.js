import cluster from 'cluster'
import os from 'os'
import express from 'express'
import morgan from 'morgan';
import {
    SERVER_PORT
} from 'config/config'
import mongoose from 'mongoose'
import api from 'modules/api'
import elaprices from 'modules/api/controllers/elaprice'
import querytx from 'modules/api/controllers/querytx'
import subscribewithdetails from 'modules/api/controllers/subscriptiondetails'
import subscribewithtx from 'modules/api/controllers/subscriptionhash'
import bodyParser from 'body-parser';
//Added  to support Background Jobs
import childProcess from 'child_process';

if (cluster.isMaster) {
    //var numWorkers = require('os').cpus().length;
    var numWorkers = 1;

    console.log('Master cluster setting up ' + numWorkers + ' workers...');

    for(var i = 0; i < numWorkers; i++) {
        cluster.fork();
    }

    cluster.on('online', function(worker) {
        console.log('Worker ' + worker.process.pid + ' is online');
    });

    cluster.on('exit', function(worker, code, signal) {
        console.log('Worker ' + worker.process.pid + ' died with code: ' + code + ', and signal: ' + signal);
        console.log('Starting a new worker');
        cluster.fork();
    });
} else {

    var constants = require("config/constants");
    const system = express()

    morgan.format('elapay', '[Backend] :method :url :status :res[content-length] - :response-time ms');
    system.use(morgan('elapay'));

    system.use(bodyParser.json());
    system.use(bodyParser.urlencoded({
        extended: true
    }));
    system.use('/api', api)
    system.get('/', (req, res) => {
        res.json('Landing page')
    })

    var _finalizedData = null,
        _httpRequestArray = ['Request Details'];

    var data = {
        'start': true,
        'interval': constants.BACKGROUNDJOBSTIMEINTERVAL,
        'content': _httpRequestArray
    };

    //To Handle requests based on tx hash,details and fetch blocks
    //system._retrieveTxDetailsChild = childProcess.fork('./services/bcjobs/txDbRetriever');
    //system._sendTxDetailsChild = childProcess.fork('./services/bcjobs/txCallbackPost');
    //system._retrieveDetailsPerBlock = childProcess.fork('./services/bcjobs/detailsDbRetriever');
    //system._sendDetailsPerBlock = childProcess.fork('./services/bcjobs/detailsCallbackPost');
    ////system._retrieveTxBlockDetails = childProcess.fork('./services/bcjobs/fetchblocks');
    system._retrieveOrderIdDetails = childProcess.fork('./services/bcjobs/orderIdDbRetriever');
    //system._sendOrderIdDetails = childProcess.fork('./services/bcjobs/orderIdCallbackPost');
    system._sendEmailAndCallbackDetails = childProcess.fork('./services/bcjobs/sendMailAndCallBack');


    //Start request based on hash
    //system._retrieveTxDetailsChild.send(data);
    //system._sendTxDetailsChild.send(data);
    ////system._retrieveTxBlockDetails.send(data);
    //system._retrieveDetailsPerBlock.send(data);
    //system._sendDetailsPerBlock.send(data);
    system._retrieveOrderIdDetails.send(data);
    //system._sendOrderIdDetails.send(data);
    system._sendEmailAndCallbackDetails.send(data); 

    system.listen(SERVER_PORT, () => console.log(`Server listen to :${SERVER_PORT}`))
}