/*
 * Developed by :HT
 * Developed on :05/24/2018
 * Code Reviewers : ***
 * FileName:orderIdDbRetriever.js
 * Usage:Used to read records with 'status:new" from db collection "callbackhashdetails" and update status to ready if transaction is present in elablockdb.
 * Pending Items : 
 */
/*jshint esversion: 6 */
var timers = require("timers"),
    http = require("http"),
    ___backgroundTimer;
var mongoClient = require('mongodb').MongoClient;
var constants = require("config/constants");
var mongoDbConnection = require("config/connections.js");
var request = require('request');
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
                //Connect to db and fetch data
                mongoDbConnection(function(databaseConnection) {
                    var dbo = databaseConnection.db(constants.DBNAME);
                    //Check collection to get recent block height
                    var query = {};
                    query["status"] = "new";
                    dbo.collection(constants.ORDERIDCALLBACKDETAILS).find(query).sort({
                        'timestamp': 1
                    }).limit(15).toArray(function(err, docs) {
                        var dbTxNewRecords = docs;
                        if (err) {
                            console.log("Error with connection from file orderIdDbRetriever.js")
                            //db.close();
                            throw err;
                        } else {
                            if (dbTxNewRecords.length > 0) {
                                for (var i = 0; i <= dbTxNewRecords.length - 1; i++) {
                                    txObject = dbTxNewRecords[i];
                                    var subQuery = {};
                                    var d = new Date();
                                    subQuery["txhash"] = dbTxNewRecords[i].txhash;
                                    subQuery["orderId"] = dbTxNewRecords[i].orderId;
                                    subQuery["amountAsDouble"] = Math.round(parseFloat(dbTxNewRecords[i].elaamount) * 100000000) / 100000000;
                                    subQuery["type"] = "notcoinbase";
                                    dbo.collection(constants.ELABLOCKDB).find(subQuery).sort({
                                        'timestamp': 1
                                    }).toArray(function(err, details) {
                                        if (err) {
                                            console.log("Error with connection file txDBRetreiver.js")
                                            //db.close();
                                            throw err;
                                        } else {
                                            if (details.length > 0) {
                                                var blockHeight = details[0].blockcheight;
                                                var blockInitialMinedTime = details[0].timestamp;
                                                var updateQuery = {
                                                    txhash: details[0].txhash,
                                                    orderId: details[0].orderId,
                                                    elaamount: details[0].amountAsDouble,
                                                    status: "new"
                                                };
                                                var currenttimestamp = Math.floor(Date.now() / 1000);
                                                var updateInfo = {
                                                    $set: {
                                                        timestamp: currenttimestamp,
                                                        status: "ready",
                                                        orderIdBlock: blockHeight,
                                                        blockInitialMinedTime: blockInitialMinedTime}
                                                };
                                                //Update query to update status if found
                                                dbo.collection(constants.ORDERIDCALLBACKDETAILS).updateOne(updateQuery, updateInfo, function(err, res) {
                                                    if (err) {
                                                        throw err;
                                                    } else {
                                                        if (i == dbTxNewRecords.length - 1) {
                                                            checkedAll = true;
                                                        }
                                                        //delete txObject;
                                                    }
                                                    //db.close();
                                                });
                                            } else {
                                                //db.close();
                                            }
                                        }

                                    });
                                }
                                if (checkedAll) {
                                    //db.close();
                                }
                            } else {
                                //db.close();
                            }
                        }

                    });
                });
                //process.send("msg.content");
            } catch (err) {
                count++;
                if (count == 3) {
                    console.log("File txDBRetreiver.js: retriever.js: shutdown timer...too many errors. " + err.message);
                    clearInterval(___backgroundTimer);
                    process.disconnect();
                } else {
                    console.log("File txDBRetreiver.js: retriever.js error: " + err.message + "\n" + err.stack);
                }
            }
        }, msg.interval);
    };
    this._init = function() {
        if (msg.content != null || msg.content != "" && msg.start == true) {
            this._startTimer();
        } else {
            console.log("File txDBRetreiver.js:  retriever.js: content empty. Unable to start timer.");
        }
    }.bind(this)()

})
process.on('uncaughtException', function(err) {
    console.log("retriever.js: " + err.message + "\n" + err.stack + "\n Stopping background timer");
    clearInterval(___backgroundTimer);
})