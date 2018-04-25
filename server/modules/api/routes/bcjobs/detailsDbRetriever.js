/*jshint esversion: 6 */
var timers = require("timers"),
    http = require("http"),
    ___backgroundTimer;
 
const  mongoURL = "mongodb://52.15.131.100:27017/";
const  dbName = "elaPay";
const  elaDetailsCollection = "callbackhashdetails";
const  elablockdb = "elablockdb";
var MongoClient = require('mongodb').MongoClient;
var queryURL = "http://localhost:2042/querytransaction/?txhash="
const fetch = require("node-fetch");
var checkedAll = false;
var txObject;
const bcExplorerURL = "https://blockchain-test-05.eadd.co/tx/";

process.on('message',function(msg){ 
    this._startTimer = function(){
        var count = 0;
        ___backgroundTimer = timers.setInterval(function(){
            try{
                var date = new Date();
            	var request = require('request');
            		  MongoClient.connect(mongoURL, function(err, db) {
            				  if (err){
            					  db.close();
            					  throw err;
            				  }else{
            					  //console.log("Connected to db")
            					  var dbo = db.db(dbName);		  
            					  var query = {};          					  
            					  query["status"] = "new";
            	dbo.collection(elaDetailsCollection).find(query).sort({ 'timestamp': 1 }).limit(15).toArray(function(err, docs){
            		var dbTxNewRecords = docs;
            		var count = dbTxNewRecords.length-1;
            		var checker = 0;
					  if (err){
						  console.log("Error with connection")
						  db.close();
						  throw err;
					  }  if (dbTxNewRecords.length > 0) {
						  for(var i = 0; i <= dbTxNewRecords.length-1; i++)
					    	{
							  checker = i;
        					  var subQuery = {};
        					  var d = new Date();     					  
        					  subQuery["senderAddress"] = dbTxNewRecords[i].senderaddress;
        					  subQuery["receiverAddress"] = dbTxNewRecords[i].receiveraddress;
        					  subQuery["amount"] = dbTxNewRecords[i].elaamount;
        					  dbo.collection(elablockdb).find(subQuery).sort({ 'timestamp': 1 }).toArray(function(err, details){
        						  if (err){
        							  console.log("Error with connection")
        							  db.close();
        							  throw err;
        						  } if(details){
        							  if(details.length == 0){
        								  //Do Nothing.
        							  }else{
          			            		//for loop to concatinate multiple tx hash for same address,money
          			            		var multipleHash = [];
          			            		if(details.length > 1){
              			            		
              			            		for(var k=0;k<=details.length-1;k++){
              			            			var url = bcExplorerURL+details[k].txhash;
              			            			multipleHash.push({"txhash":details[k].txhash,block:details[k].blockcheight,timestamp:details[k].timestamp,url:url,amount:details[k].amount});
              			            		}
          			            		}else{
          			            			//Do Nothing
          			            		}

          							  for(var j=0;j<=details.length-1;j++){

                							  //Update
                								var currenttimestamp = Math.floor(Date.now() / 1000);
          									if(multipleHash.length == 0){

          										var url = bcExplorerURL+details[j].txhash;
        										var updateInfo = {$set: {timestamp: currenttimestamp,status: "ready",txhash:[{txhash:details[j].txhash,block:details[j].blockcheight,timestamp:details[j].timestamp,url:url,amount:details[j].amount}]} };

        										
          									}else{
        										var updateInfo = {$set: {timestamp: currenttimestamp,status: "ready",txhash:multipleHash} };

          									}
        										  var updateInfoQuery = {};

        										  updateInfoQuery["senderaddress"] = details[j].senderAddress;
        										  updateInfoQuery["receiveraddress"] = details[j].receiverAddress;
        										  updateInfoQuery["elaamount"] = details[j].amount;
        										  updateInfoQuery["status"] = "new";


        		      			            		        			dbo.collection(elaDetailsCollection).update(updateInfoQuery, updateInfo, function(err, res) {
        											    if (err) {
        											    	throw err;
        											    	console.log(err);
        											    	db.close();
        											    }else{
            													 if(count == checker){
    														 checkedAll = true;
    													 }
        				      			            		
        											    }
        											  });
          							  }
        							  }

        							  
      			            
										  
        							  
        						  }else{
        							  db.close();
        						  }
        						  
        						  
        						  
        					  });


			            	  if(checkedAll){
							    	//db.close();
							    }

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