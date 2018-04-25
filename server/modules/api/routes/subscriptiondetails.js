/*Modify const before start
 * POST  API : http://localhost:2041/subscriptiondetails
 * BODY {
  {
  "senderaddress": "EYcUt6RAbKN22Z3xB45omEE3TEtppZxqQP",
  "receiveraddress" : "ELpYhM4PaM44ZZoDTDkv6biw2bmZ4RqCZd",
  "elaamount": "1",
  "callbackurl": "http://requestbin.fullcontact.com/12epgvq1"
}
} * http://localhost:2037/querytx/?txhash=a1d6b0683af51cde18f095429e359f3f0b837e097d13bc49438c85e69f537bc2
 */

/*jshint esversion: 6 */

const fetch = require("node-fetch");
var MongoClient = require('mongodb').MongoClient;
const  mongoURL = "mongodb://52.15.131.100:27017/";
const  dbName = "elaPay";
const  callbackhashCN = "callbackhashdetails";


//const elaHostURL  = "https://blockchain.elastos.org";
//const txLocation = "/api/v1/tx/";
//const elatxPageLocation = "/tx/";

exports.details = function(req, res){
	console.log("Request came in"+req);
	 //var txHashUrl = elaHostURL+txLocation+req.query.txhash;
	 if(typeof req.body.receiveraddress == 'undefined' || typeof req.body.senderaddress == 'undefined' || typeof req.body.callbackurl == 'undefined' || typeof req.body.elaamount == 'undefined'){
		    res.status(404);
		    res.setHeader('Content-Type', 'application/json');
		    res.send(JSON.stringify({ status: "Required value such as Receiver Address or Sender Address or Callback URL or ela amount missing."}));
	 }else{
			MongoClient.connect(mongoURL, function(err, db) {
				  if (err){
					  throw err;
				  }else{
					  console.log("Connected to db")
					  var dbo = db.db(dbName);	
				      var currenttimestamp = Math.floor(Date.now() / 1000);
					  var elasubhashObj = { senderaddress: req.body.senderaddress, receiveraddress: req.body.receiveraddress,elaamount: req.body.elaamount,callbackurl: req.body.callbackurl, timestamp: currenttimestamp,status: "new"};
					  dbo.collection(callbackhashCN).insertOne(elasubhashObj, function(err, result) {
						  if (err){
							  console.log("Error with connection 3")
							  throw err;
						  } else{
							    db.close();
							    res.status(200);
							    res.setHeader('Content-Type', 'application/json');
							    res.send(JSON.stringify({ status: "success",details:"A callback request will be sent if there is a change is status of transaction hash provided."}));
						  }
					  });
				  }		  
				});
			

	}
};
