/*jshint esversion: 6 */
var timers = require("timers"),
    http = require("http"),
    ___backgroundTimer;

const  mongoURL = "mongodb://52.15.131.100:27017/";
const  dbName = "elaPay";
const  elaHashCollection = "callbackhashdb";
var MongoClient = require('mongodb').MongoClient;
var queryURL = "http://localhost:2041/querytransaction/?txhash="
const fetch = require("node-fetch");
var checkedAll = false;
var txObject;
var request = require('request');
const  elablockdb = "elablockdb";


process.on('message',function(msg){
    this._startTimer = function(){
        var count = 0;
        ___backgroundTimer = timers.setInterval(function(){
            try{
                var date = new Date();
                  MongoClient.connect(mongoURL, function(err, db) {
                      if (err){
                        db.close();
                        throw err;
                      }else{
                        //console.log("Connected to db")
                        var dbo = db.db(dbName);
                        var query = {};
                        query["status"] = "new";
                  dbo.collection(elaHashCollection).find(query).sort({ 'timestamp': 1 }).limit(15).toArray(function(err, docs){
                var dbTxNewRecords = docs;
            if (err){
              console.log("Error with connection")
              db.close();
              throw err;
            }  if (dbTxNewRecords) {
              for(var i = 0; i <= dbTxNewRecords.length-1; i++)
                {
                      txObject = dbTxNewRecords[i];

                        var subQuery = {};
                      var d = new Date();
                      subQuery["txhash"] = docs[i].txhash;
                      subQuery["type"] = "notcoinbase";

                      dbo.collection(elablockdb).find(subQuery).sort({ 'timestamp': 1 }).toArray(function(err, details){
                        if (err){
                          console.log("Error with connection")
                          db.close();
                          throw err;
                        } if(details.length > 0){

                    var updateQuery = {txhash: details[0].txhash,status:"new"};
                    var currenttimestamp = Math.floor(Date.now() / 1000);
                      var updateInfo = {$set: {timestamp: currenttimestamp,status: "ready"} };
                        dbo.collection(elaHashCollection).updateOne(updateQuery, updateInfo, function(err, res) {
                            if (err) {
                              throw err;
                            }else{
                             if(i == dbTxNewRecords.length-1){
                               checkedAll = true;
                             }
                             //delete txObject;
                            }
                            //db.close();
                          });


                        }else{
                          db.close();
                        }
                      });


                    //console.log("Call back url:" + docs[i].callbackurl);

                }
                if(checkedAll){
                  db.close();
                }

            }
            else {
                console.log("No results found");
                //fetchExchangeRateFromAPI("USD"+currencyCode,dbo,db,amount);
                db.close();
            }
              });


                      }
                    });




                //process.send("msg.content");

            }
            catch(err){
                count++;
                if(count == 3){
                    console.log("retriever.js: shutdown timer...too many errors. " + err.message);
                    clearInterval(___backgroundTimer);
                    process.disconnect();
                }
                else{
                    console.log("retriever.js error: " + err.message + "\n" + err.stack);
                }
            }
        },msg.interval);
    };


    this._init = function(){
        if(msg.content != null || msg.content != "" && msg.start == true){
            this._startTimer();
            console.log("msg.contentmsg.content"+msg.content);
        }
        else{
            console.log("retriever.js: content empty. Unable to start timer.");
        }
    }.bind(this)()

})

process.on('uncaughtException',function(err){
    console.log("retriever.js: " + err.message + "\n" + err.stack + "\n Stopping background timer");
    clearInterval(___backgroundTimer);
})
