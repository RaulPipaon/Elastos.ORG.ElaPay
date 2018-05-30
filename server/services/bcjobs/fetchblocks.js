/*
 * Developed by :HT
 * Developed on :04/25/2018
 * Code Reviewers : Noah and Song
 * FileName:fetchblocks.js
 * Usage:Used to query ela api to get latest blocks and save it to "elablockdb".
 * Pending Items : Write function to check coinbase transaction rather than writing same code again.
 */
/*jshint esversion: 6 */
var timers = require("timers"),
    http = require("http"),
    ___backgroundTimer;
var mongoClient = require('mongodb').MongoClient;
var constants = require("config/constants");
var mongoDbConnection = require("config/connections.js");
var fetch = require("node-fetch");
var checkedAll = false;
var txObject;


//Here we start batch job
process.on('message', function(msg) {
    this._startTimer = function() {
        var count = 0;
        ___backgroundTimer = timers.setInterval(function() {
            try {
                var date = new Date();
                //Global Mongo Connection
                mongoDbConnection(function(databaseConnection) {
                    var dbo = databaseConnection.db(constants.DBNAME);
                    //Check collection to get recent block height
                    dbo.collection(constants.ELABLOCKDB).find().sort({
                        "blockcheight": -1
                    }).limit(1).toArray(function(err, docs) {
                        var dbTxNewRecords = docs;
                        if (err) {
                            console.log("Error with connection from file fetchblocks.js")
                            //db.close();
                            throw err;
                        } else if (dbTxNewRecords.length > 0) {
                            for (var i = 0; i <= dbTxNewRecords.length - 1; i++) {
                                var blockHeight = dbTxNewRecords[i].blockcheight;
                                //Add +1 to blockheight to get next block
                                blockHeight = blockHeight + 1;
                                //Call API and fetch details
                                fetch(constants.ELAAPIURL + constants.BLOCKHEIGHTDETAILLOCATION + blockHeight)
                                    .then((response) => response.json())
                                    .then(function(txtransactiondata) {
                                        var txtdata = txtransactiondata.Result;
                                        var blockDataArray = [];
                                        if (txtdata.length == 0 || txtdata == null || txtdata == "") {
                                            //Do nothing
                                        } else {
                                            if (txtdata == "Unknown Block") {
                                                return;
                                            } else {
                                                for (var j = 0; j <= txtdata.Transactions.length - 1; j++) {
                                                    //Check if coinbase transaction
                                                    if (txtdata.Transactions[j].TxType == 0) {
                                                        blockDataArray.push({
                                                            "txhash": txtdata.Transactions[j].Hash,
                                                            "timestamp": txtdata.Transactions[j].Timestamp,
                                                            "blockcheight": txtdata.BlockData.Height,
                                                            "type": "coinbase"
                                                        });
                                                    } else {
                                                    	if(txtdata.Transactions[j].Attributes.length > 0 || txtdata.Transactions[j].Attributes != null){
                                                            var orderId = Buffer.from(txtdata.Transactions[j].Attributes[0].Data, 'hex').toString('utf8');
                                                    	}else{
                                                            var orderId = "";
                                                    	}
                                                    	
                                                        //var amount = parseFloat(txtdata.Transactions[j].Outputs[0].Value);
                                                        for (var l = 0; l <= txtdata.Transactions[j].Outputs.length - 1; l++) {
                                                            if (txtdata.Transactions[j].UTXOInputs[0].Address == txtdata.Transactions[j].Outputs[l].Address) {
                                                                //Do Nothing as this transaction is sent from receiver to sender.
                                                            } else {
                                                            	//Insert info blockdb. Defect https://github.com/elastos/Elastos.ORG.ElaPay/issues/6
                                                                var amount = Math.round(parseFloat(txtdata.Transactions[j].Outputs[l].Value)*100000000)/100000000;
                                                                blockDataArray.push({
                                                                    "txhash": txtdata.Transactions[j].Hash,
                                                                    "amount": txtdata.Transactions[j].Outputs[l].Value,
                                                                    "amountAsDouble": amount,
                                                                    "senderAddress": txtdata.Transactions[j].UTXOInputs[0].Address,
                                                                    "receiverAddress": txtdata.Transactions[j].Outputs[l].Address,
                                                                    "timestamp": txtdata.Transactions[j].Timestamp,
                                                                    "orderId": orderId,
                                                                    "blockcheight": txtdata.BlockData.Height,
                                                                    "type": "notcoinbase"
                                                                });
                                                            }
                                                        }
                                                    }
                                                }
                                            }
                                            var query = {};
                                            query["blockcheight"] = txtdata.BlockData.Height;
                                            dbo.collection(constants.ELABLOCKDB).findOne(query, function(err, result) {
                                                if (err) {
                                                    console.log("Error with connection from file fetchblocks.js")
                                                    throw err;
                                                    //db.close();
                                                }
                                                if (result) {
                                                    //Check if the result is less than 24 hrs
                                                    //db.close();
                                                } else {
                                                    dbo.collection(constants.ELABLOCKDB).insert(blockDataArray, function(err, res) {
                                                        if (err) {
                                                            throw err;
                                                            //db.close();
                                                        } else {
                                                            //db.close();
                                                        }
                                                    });
                                                }
                                            });
                                        }
                                    }).catch(function(error) {
                                        console.log(error);
                                        //db.close();
                                    });
                            }
                        } else {
                            fetch(constants.ELAAPIURL + constants.BLOCKHEIGHTLOCATION)
                                .then((response) => response.json())
                                .then(function(data) {
                                    var obtainedBHeight = data.Result;
                                    fetch(constants.ELAAPIURL + constants.BLOCKHEIGHTDETAILLOCATION + data.Result)
                                        .then((response) => response.json())
                                        .then(function(txdata) {
                                            var blockTxDetail = txdata.Result;
                                            var blockTransactionDetails = [];
                                            if (blockTxDetail == "") {
                                                //db.close();
                                            } else {
                                                for (var i = 0; i <= blockTxDetail.Transactions.length - 1; i++) {
                                                    //Check if coinbase transaction
                                                    if (blockTxDetail.Transactions[i].TxType == 0) {
                                                        //Its a coinbase transaction
                                                        blockTransactionDetails.push({
                                                            "txhash": blockTxDetail.Transactions[i].Hash,
                                                            "timestamp": blockTxDetail.Transactions[i].Timestamp,
                                                            "blockcheight": blockTxDetail.BlockData.Height,
                                                            "type": "coinbase"
                                                        });
                                                    } else {
                                                    	if(txtdata.Transactions[i].Attributes.length > 0 || txtdata.Transactions[i].Attributes != null){
                                                            var orderId = Buffer.from(txtdata.Transactions[i].Attributes[0].Data, 'hex').toString('utf8');

                                                    	}else{
                                                            var orderId = "";
                                                    	}
                                                        var orderId = Buffer.from(txtdata.Transactions[i].Attributes[0].Data, 'hex').toString('utf8');
                                                        for (var p = 0; p <= blockTxDetail.Transactions[i].Outputs.length - 1; p++) {
                                                            if (blockTxDetail.Transactions[i].UTXOInputs[0].Address == blockTxDetail.Transactions[i].Outputs[p].Address) {
                                                                //Do Nothing as sender and receiver are the same
                                                            } else {
                                                            	//Insert info blockdb. Defect https://github.com/elastos/Elastos.ORG.ElaPay/issues/6
                                                                var amount = Math.round(parseFloat(blockTxDetail.Transactions[i].Outputs[p].Value)*100000000)/100000000;
                                                                blockTransactionDetails.push({
                                                                    "txhash": blockTxDetail.Transactions[i].Hash,
                                                                    "amount": blockTxDetail.Transactions[i].Outputs[p].Value,
                                                                    "amountAsDouble": amount,
                                                                    "senderAddress": blockTxDetail.Transactions[i].UTXOInputs[0].Address,
                                                                    "receiverAddress": blockTxDetail.Transactions[i].Outputs[p].Address,
                                                                    "timestamp": blockTxDetail.Transactions[i].Timestamp,
                                                                    "orderId": orderId,
                                                                    "blockcheight": blockTxDetail.BlockData.Height,
                                                                    "type": "notcoinbase"
                                                                });
                                                            }
                                                        }
                                                    }
                                                }
                                                dbo.collection(constants.ELABLOCKDB).insert(blockTransactionDetails, function(err, res) {
                                                    if (err) {
                                                        throw err;
                                                        //db.close();
                                                    } else {
                                                        //db.close();
                                                    }
                                                });
                                            }
                                        })
                                })
                                .catch(function(error) {
                                    console.log(error);
                                    //db.close();
                                });
                        }
                    });


                });


                //process.send("msg.content");
            } catch (err) {
                count++;
                if (count == 3) {
                    console.log("From file fetchblocks.js: shutdown timer...too many errors. " + err.message);
                    clearInterval(___backgroundTimer);
                    process.disconnect();
                } else {
                    console.log("From file fetchblocks.js " + err.message + "\n" + err.stack);
                }
            }
        }, msg.interval);
    };
    this._init = function() {
        if (msg.content != null || msg.content != "" && msg.start == true) {
            this._startTimer();
        } else {
            console.log("From file fetchblocks.js: content empty. Unable to start timer ");
        }
    }.bind(this)()

})
process.on('uncaughtException', function(err) {
    console.log("From file fetchblocks.js:  " + err.message + "\n" + err.stack + "\n Stopping background timer");
    clearInterval(___backgroundTimer);
})