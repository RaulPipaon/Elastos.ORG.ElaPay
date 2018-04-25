import cluster from 'cluster'
import os from 'os'
import express from 'express'
import morgan from 'morgan'
import { SERVER_PORT } from 'config/config'
import mongoose from 'mongoose'
import api from 'modules/api'
import elaprices from 'modules/api/routes/elaprice'
import querytx from 'modules/api/routes/querytx'
import subscribewithdetails from 'modules/api/routes/subscriptiondetails'
import subscribewithtx from 'modules/api/routes/subscriptionhash'

//Added for body parser by HT
const bodyParser = require('body-parser');

const system = express()

 //Added for body parse json by HT
 system.use(bodyParser.json()); // support json encoded bodies
 system.use(bodyParser.urlencoded({ extended: true })); // support encoded bodies

 //Added for API CALLS by HT
 system.use('/api', api)
 system.get('/querytx', querytx.details);
 system.post('/subscribewithdetails', subscribewithdetails.details);
 system.post('/subscribewithtx', subscribewithtx.details);
 system.get('/elaprices', elaprices.details);
  
system.get('/', (req, res) => {
  res.json('Landing page')
})

//Added by HT to support Background Jobs
var childProcess = require("child_process");
var _finalizedData = null,
_httpRequestArray = ["Request Details"];
var data = {
"start":true,
"interval": 10 * 1000,
"content": _httpRequestArray
};
system._retrieveTxDetailsChild = childProcess.fork("./modules/api/routes/bcjobs/txDbRetriever");
system._sendTxDetailsChild = childProcess.fork("./modules/api/routes/bcjobs/txCallbackPost");
//To handle requests based on details
system._retrieveDetailsPerBlock = childProcess.fork("./modules/api/routes/bcjobs/detailsDbRetriever");
system._sendDetailsPerBlock = childProcess.fork("./modules/api/routes/bcjobs/detailsCallbackPost");
//To handle block fetch details
system._retrieveTxBlockDetails = childProcess.fork("./modules/api/routes/bcjobs/fetchblocks");
/*
this._retrieveChild.on('message', function(msg){
    console.log("Recv'd message from background process.");
    _finalizedData = msg.content;
}.bind(this));
*/
//Handle request based on hash
system._retrieveTxDetailsChild.send(data);
system._sendTxDetailsChild.send(data);
//To handle block fetch details
system._retrieveTxBlockDetails.send(data);
//To handle requests based on details
system._retrieveDetailsPerBlock.send(data);
system._sendDetailsPerBlock.send(data);


system.use(morgan('dev'))
system.listen(SERVER_PORT, () => console.log(`Server listen to :${SERVER_PORT}`))
