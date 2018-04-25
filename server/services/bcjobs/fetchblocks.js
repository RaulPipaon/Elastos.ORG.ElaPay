/*jshint esversion: 6 */
var timers = require("timers"),
    http = require("http"),
    ___backgroundTimer;

const  mongoURL = "mongodb://52.15.131.100:27017/";
const  dbName = "elaPay";
const  elaBlockDBCollection = "elablockdb";
var MongoClient = require('mongodb').MongoClient;
var queryURL = "http://localhost:2041/querytransaction/?txhash="
const fetch = require("node-fetch");
var checkedAll = false;
var txObject;
const blockHeightURL = "http://api-test-05.eadd.co:22334/api/v1/block/height";
const blockHeightDetailsURL = "http://api-test-05.eadd.co:22334/api/v1/block/details/height/"
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
              //Start fetching data
            var dbo = db.db(dbName);
            dbo.collection(elaBlockDBCollection).find().sort({ "blockcheight": -1 }).limit(1).toArray(function(err, docs){
                    var dbTxNewRecords = docs;
              if (err){
                console.log("Error with connection")
                db.close();
                throw err;
              } if (dbTxNewRecords.length > 0) {
              for(var i = 0; i <= dbTxNewRecords.length-1; i++)
              {
                var blockHeight = dbTxNewRecords[i].blockcheight;
                //Add +1 to blockheight for enxt block-Seperated for clear udnerstanding
                blockHeight = blockHeight+1;
                //Call API and fetch

               fetch(blockHeightDetailsURL+blockHeight)
                .then((response) => response.json())
                .then(function(txtransactiondata) {
                  var txtdata = txtransactiondata.Result;
                   var blockDataArray = [];
                                if(txtdata.length == 0 || txtdata == null || txtdata ==""){
                                  //Do nothing
                                }else{
                        for(var j = 0; j <= txtdata.Transactions.length-1; j++)
                        {
                          //Check if coinbase transaction
                          if(txtdata.Transactions[j].TxType == 0){
                            //Its a coinbase transaction
                            //Do Nothing
                            blockDataArray.push({
                              "txhash":txtdata.Transactions[j].Hash,
                              "timestamp":txtdata.Transactions[j].Timestamp,
                              "blockcheight":txtdata.BlockData.Height,
                              "type":"coinbase"});

                          }else{

                            blockDataArray.push({
                              "txhash":txtdata.Transactions[j].Hash,
                              "amount": txtdata.Transactions[j].Outputs[0].Value,
                              "senderAddress": txtdata.Transactions[j].UTXOInputs[0].Address,
                              "receiverAddress":txtdata.Transactions[j].Outputs[0].Address,
                              "timestamp":txtdata.Transactions[j].Timestamp,
                              "blockcheight":txtdata.BlockData.Height,
                              "type":"notcoinbase"});
                          }

                        }

                        var query = {};
                        query["blockcheight"] = txtdata.BlockData.Height;
                        dbo.collection(elaBlockDBCollection).findOne(query, function(err, result) {
                          if (err){
                            console.log("Error with connection 1")
                            throw err;
                            db.close();
                          }
                            if (result) {
                              //Check if the result is less than 24 hrs
                              db.close();
                            } else {

                              dbo.collection(elaBlockDBCollection).insert(blockDataArray, function(err, res) {
                                if (err){
                                  throw err;
                                  db.close();
                                }else{
//                                  //console.log("all txdetails  inserted");
                                  db.close();
                                }
                              });
                            }
                        });


                                }



                });

              }
              }
            else {
                //console.log("No results found- So fetch from blockchain using API");
               fetch(blockHeightURL)
                .then((response) => response.json())
                .then(function(data) {

                    var obtainedBHeight = data.Result;

                            fetch(blockHeightDetailsURL+data.Result)
                    .then((response) => response.json())
                    .then(function(txdata) {
                       var blockTxDetail = txdata.Result;
                       var blockTransactionDetails = [];
                      if(blockTxDetail == ""){
                        db.close();

                      }else{
                         //var blockTransactionDetails = [];
                          for(var i = 0; i <= blockTxDetail.Transactions.length-1; i++)
                          {
                            //Check if coinbase transaction
                            if(blockTxDetail.Transactions[i].TxType == 0){
                              //Its a coinbase transaction
                              //Do Nothing
                              blockTransactionDetails.push({
                                "txhash":blockTxDetail.Transactions[i].Hash,
                                "timestamp":blockTxDetail.Transactions[i].Timestamp,
                                "blockcheight":blockTxDetail.BlockData.Height,
                                "type":"coinbase"});

                            }else{
                              blockTransactionDetails.push({
                                "txhash":blockTxDetail.Transactions[i].Hash,
                                "amount": blockTxDetail.Transactions[i].Outputs[0].Value,
                                "senderAddress": blockTxDetail.Transactions[i].UTXOInputs[0].Address,
                                "receiverAddress":blockTxDetail.Transactions[i].Outputs[0].Address,
                                "timestamp":blockTxDetail.Transactions[i].Timestamp,
                                "blockcheight":blockTxDetail.BlockData.Height,
                                "type":"notcoinbase"});
                            }
                          }
                          console.log("blockTransactionDetails --------"+blockTransactionDetails[0].type);
                          dbo.collection(elaBlockDBCollection).insert(blockTransactionDetails, function(err, res) {
                            if (err){
                              throw err;
                              db.close();
                            }else{
                              //console.log("all txdetails  inserted");
                              db.close();
                            }
                          });


                      }

                    })
                })
                .catch(function(error) {
                              console.log(error);
                  db.close();

                  });
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
