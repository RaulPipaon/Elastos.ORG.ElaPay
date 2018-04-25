/*jshint esversion: 6 */
var timers = require("timers"),
    http = require("http"),
    ___backgroundTimer;
//var request = require('request');

const  mongoURL = "mongodb://52.15.131.100:27017/";
const  dbName = "elaPay";
const  elaDetailsCollectionDBCall = "callbackhashdetails";
var MongoClient = require('mongodb').MongoClient;
//var queryURL = "http://localhost:2041/querytransaction/?txhash="
const fetch = require("node-fetch");
var checkedAll = false;
var txObject;
var request = require('request');


process.on('message',function(msg){ 
    this._startTimer = function(){
        var count = 0;
        ___backgroundTimer = timers.setInterval(function(){
            try{
                var date = new Date();
            		  MongoClient.connect(mongoURL, function(err, db) {
            				  if (err){
            					  throw err;
            				  }else{
            					  var dbo = db.db(dbName);		  
            					  var query = {};
            					  var d = new Date();
            					  query["status"] = "ready";
            					  
            	dbo.collection(elaDetailsCollectionDBCall).find(query).sort({ 'timestamp': 1 }).limit(15).toArray(function(err, docs){
            		var dbTxNewRecords = docs;
					  if (err){
						  console.log("Error with connection")
						  	db.close();
						  throw err;
					  }  if (dbTxNewRecords) {
						  for(var i = 0; i <= dbTxNewRecords.length-1; i++)
					    	{
			            		txObject = dbTxNewRecords[i];

			            		var callbackURL = dbTxNewRecords[i].callbackurl;
			    			    //var trackURL = elaHostURL+elatxPageLocation+dbTxNewRecords[i].txhash;
			    			    var txHashToSend = dbTxNewRecords[i].txhash;
			    			    var senderAddress = dbTxNewRecords[i].senderaddress;
			    			    var receiverAddress = dbTxNewRecords[i].receiveraddress;
			    			    var amount = dbTxNewRecords[i].elaamount;
			            		//var request = require('request');
			            		request.post({
			            		  headers: {'content-type' : 'application/json'},
			            		  status : 200,
			            		  url:     dbTxNewRecords[i].callbackurl,
			            		  body:    JSON.stringify({txhash:dbTxNewRecords[i].txhash,receiveraddress:dbTxNewRecords[i].receiveraddress,senderaddress:dbTxNewRecords[i].senderaddress})
			            		}, function(error, response, body){
			            			//Update record in DB
									  var updateQuery = {txhash: txHashToSend,status:"ready",senderaddress:senderAddress,receiveraddress:receiverAddress,elaamount:amount}; 
								var currenttimestamp = Math.floor(Date.now() / 1000);
									var updateInfo = {$set: {timestamp: currenttimestamp,status: "sent"} };

									  dbo.collection(elaDetailsCollectionDBCall).updateOne(updateQuery, updateInfo, function(err, res) {
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
									  
			            		});


					    	}
						    if(checkedAll){
						    	db.close();
						    }
						  
					  }
					  else {
					    	console.log("No results found");
						    db.close();
					  }
            	});
          			    

            
            				  }		  
            				});

            	
                process.send("msg.content");

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