/*
 * Developed by :HT
 * Developed on :05/24/2018
 * Code Reviewers : *****
 * FileName:orderIdCallbackPost.js
 * Usage:Used to read records with 'status:ready" from db collection "callbackhashdetails" and send details to callback URL and update 'status:sent'.This code runs every 10 seconds
 * Pending Items : 
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
                var request = require('request');
                mongoDbConnection(function(databaseConnection) {
                    var dbo = databaseConnection.db(constants.DBNAME);
                    var query = {};
                    var d = new Date();
                    query["status"] = "ready";
                    query["sendcount"] = {
                        $lte: 6
                    };
                    dbo.collection(constants.ORDERIDCALLBACKDETAILS).find(query).sort({
                        'timestamp': 1
                    }).limit(15).toArray(function(err, docs) {
                        var dbTxNewRecords = docs;
                        if (err) {
                            console.log("From File orderIdCallbackPost.js:Error with connection")
                            //db.close();
                            throw err;
                        } else if (dbTxNewRecords.length > 0) {
                            //Added logic to handle 6 times
                            dbo.collection(constants.ELABLOCKDB).find({}).sort({
                                'blockcheight': -1
                            }).toArray(function(err, details) {
                                if (err) {
                                    console.log("Error with connection file txDBRetreiver.js")
                                    //db.close();
                                    throw err;

                                } else {
                                    if (details.length > 0) {
                                        var blockHeight = details[0].blockcheight;

                                        for (var i = 0; i <= dbTxNewRecords.length - 1; i++) {
                                            if ((blockHeight - dbTxNewRecords[i].orderIdBlock <= 6) && (blockHeight - dbTxNewRecords[i].orderIdBlock != dbTxNewRecords[i].sendcount) && (blockHeight - dbTxNewRecords[i].orderIdBlock >= 0)) {
                                                txObject = dbTxNewRecords[i];
                                                var callbackURL = dbTxNewRecords[i].callbackurl;
                                                var retrycountlocal = dbTxNewRecords[i].retrycount;
                                                var trackURL = constants.BCEXPLORERURL + constants.ELATXPAGELOCATION + dbTxNewRecords[i].txhash;
                                                var txHashToSend = dbTxNewRecords[i].txhash;
                                                var businessName = dbTxNewRecords[i].businessName;
                                                var price = dbTxNewRecords[i].price;
                                                var email = dbTxNewRecords[i].email;
                                                var minedTime = dbTxNewRecords[i].blockInitialMinedTime;
                                                var sendcount = dbTxNewRecords[i].sendcount;
                                                sendcount = sendcount + 1;
                                                var statusLocal;
                                                if (sendcount < 6) {
                                                    statusLocal = "ready"
                                                } else if (sendcount == 6) {
                                                    statusLocal = "sent"
                                                } else {
                                                    //Do Nothing
                                                }
                                                var updateQuery = {
                                                    txhash: txHashToSend,
                                                    status: "ready"
                                                };
                                                var updateInfo = {
                                                    $set: {
                                                        status: statusLocal,
                                                        sendcount: sendcount
                                                    }
                                                };
                                                dbo.collection(constants.ORDERIDCALLBACKDETAILS).findOneAndUpdate(updateQuery, updateInfo, function(err, res) {
                                                    if (err) {
                                                        throw err;
                                                    } else {
                                                        var localTxHash = res.value.txhash
                                                        var localCallBackURL = res.value.callbackurl
                                                        var customtrackURL = constants.BCEXPLORERURL + constants.ELATXPAGELOCATION + localTxHash;
                                                        var request = require('request');
                                                        request.post({
                                                            headers: {
                                                                'content-type': 'application/json'
                                                            },
                                                            status: 200,
                                                            url: localCallBackURL,
                                                            body: JSON.stringify({
                                                                transactionHash: localTxHash,
                                                                trackingURL: customtrackURL,
                                                                details: "Transaction is now present on blockchain",
                                                                status: " Success",
                                                                action: "GetTransactionsDetailsByOrderIdToCallbackURL"
                                                            })
                                                        }, function(error, response, body) {});
                                                        if (i == dbTxNewRecords.length - 1) {
                                                            checkedAll = true;
                                                        }
                                                    }
                                                    //db.close();
                                                });
                                            }
                                        }
                                    } else {
                                        //Do Nothing
                                    }
                                }
                            });
                        } else {
                            //db.close();
                        }
                    });
                });
                //process.send("msg.content");
            } catch (err) {
                count++;
                if (count == 3) {
                    console.log("File orderIdCallbackPost.js :  shutdown timer...too many errors. " + err.message);
                    clearInterval(___backgroundTimer);
                    process.disconnect();
                } else {
                    console.log("File orderIdCallbackPost.js" + err.message + "\n" + err.stack);
                }
            }
        }, msg.interval);
    };
    this._init = function() {
        if (msg.content != null || msg.content != "" && msg.start == true) {
            this._startTimer();
        } else {
            console.log("File orderIdCallbackPost.js: content empty. Unable to start timer.");
        }
    }.bind(this)()
})
process.on('uncaughtException', function(err) {
    console.log("File orderIdCallbackPost.js " + err.message + "\n" + err.stack + "\n Stopping background timer");
    clearInterval(___backgroundTimer);
})