
/*
 * IMP-CREATE BELOW 2 COLLECTIONS BEFORE RUNNING THIS CODE
 * "db.createCollection(currenyRate)"
 * "db.createCollection(elaUSDRate)"
 * This code Accept SYMBOL AND AMOUNT. (Symbol = USD,INR,CNY) (Amount=123,123.0)
 * Return (ELA Rate,Timestamp,Current ELAUSDT Rate)
 * API : http://localhost:3000/elaprice/?symbol=USD&amount=123
 * Send symbol in UPPER CASE/CAPITAL LETTERS
 * Send  amount after checking if its a number/decimal ONLY
 */
/*jshint esversion: 6 */

var validateCurrencyCode = require('validate-currency-code');
var MongoClient = require('mongodb').MongoClient;
var response;
const fetch = require("node-fetch");
const  currencyURL = "http://www.apilayer.net/api/live?access_key=3e237efb6e565d8836feb494f3d9bbe0&format=1";
const  mongoURL = "mongodb://52.15.131.100:27017/";
const  dbName = "elaPay";
const  collectionName = "currencyRate";
const  elaUSDcollectionName = "elaUSDRate";
const  huobiURL = "https://api.huobipro.com/market/detail?symbol=elausdt";

//Save Currency Pairs to DB
function saveCurrencyPairsToDB(currencyCode,amount) {
	//Check if Currency Pair exists in db and is less than 24 hrs and return price
	var excahngeRateInUSD = 0;
	MongoClient.connect(mongoURL, function(err, db) {
		  if (err){
			  throw err;
		  }else{
			  console.log("Connected to db")
			  var dbo = db.db(dbName);		  
			  var query = {};
			  query["keypair"] = "USD"+currencyCode;
			  dbo.collection(collectionName).findOne(query, function(err, result) {
				  if (err){
					  console.log("Error with connection 1")
					  throw err;
				  } 
				    if (result) {
				    	//Check if the result is less than 24 hrs
				    	if(checkTimeStamps(result.timestamp) < 1){
				    		//call huobi for rate
					    	 huobiCall(amount/result.value,dbo,db);
				    	}else{
				    		fetchExchangeRateFromAPI("USD"+currencyCode,dbo,db,amount);
				    	}
				    } else {
				    	console.log("No results found so calling fetchExchangeRateFromAPI");
				    	fetchExchangeRateFromAPI("USD"+currencyCode,dbo,db,amount);
				    }
			  });
		  }		  
		});
	} 
function fetchExchangeRateFromAPI(currencyCode,dbo,db,amount){
    // Perform API Call to get new conversion rate
	var exchangeRate = 0;
	 fetch(currencyURL)
		  .then((response) => response.json())
		  .then(function(data) {
		       let currencyQuoteData = data.quotes;
		       let exchangeTimeStamp = data.timestamp;
		      //Frame JSON Object
			  var quotes = [];
			  var inputData = currencyQuoteData;
			  for (var key in inputData) {
				    if (inputData.hasOwnProperty(key)) {
				        quotes.push({"keypair":key,"value":inputData[key],"timestamp":exchangeTimeStamp});
				        if(key == currencyCode){
				        	exchangeRate = inputData[key];
				        }
				    }
				} 
			  //Save the data to db
		  dbo.collection(collectionName).drop(function(err, delOK) {
			    if (err){
			    	throw err;
			    }else{
					 console.log("Connected and Dropped  currencyRate collection and inserting now.");
					  dbo.collection(collectionName).insert(quotes, function(err, res) {
						    if (err){
								  throw err;
						    }else{
							    console.log("all quotes  inserted");
						    }
						  }); 
					  
			    }
			   
			  });
		      //returnResults(amount/exchangeRate);
		      huobiCall(amount/result.value,dbo,db);
		  })
		  .catch(function(error) {
		    console.log(error);
		  });   

	 //return exchangeRate;
}

function checkTimeStamps(currenyTimeStamp){
	var currentTime = Math.floor(Date.now() / 1000);
	var secdiff = currentTime - currenyTimeStamp; 
	var mindiff = Math.floor( secdiff / 60 );
	secdiff = secdiff % 60;
	var hourdiff = Math.floor( mindiff / 60 );
	mindiff = mindiff % 60;
	var daydiff = Math.floor( hourdiff / 24 );
	hourdiff = hourdiff % 24;
	return daydiff;
}
function checkTimeStampsSecondDiff(currenyTimeStamp){
	var currentTime = Math.floor(Date.now() / 1000);
	var secdiff = currentTime - currenyTimeStamp; 
	var mindiff = Math.floor( secdiff / 60 );
	secdiff = secdiff % 60;
	var hourdiff = Math.floor( mindiff / 60 );
	mindiff = mindiff % 60;
	var daydiff = Math.floor( hourdiff / 24 );
	hourdiff = hourdiff % 24;
	return mindiff;
}
function callHuobiAPI(usdamout,dbo,db){
	//Make first API Call
	let elaUsdPrice = 0;
	let huobiTimeStamp;
	 fetch(huobiURL)
	  .then((response) => response.json())
	  .then(function(data) {
	       elaUsdPrice = data.tick.close;
	       huobiTimeStamp = Math.floor(Date.now() / 1000);
		  var elaObj = { keypair: "USDELA", value: elaUsdPrice, timestamp: huobiTimeStamp};
		  //Save the data to db
	  dbo.collection(elaUSDcollectionName).drop(function(err, delOK) {
		    if (err){
		    	throw err;
		    }else{
				 console.log("Connected and Dropped  elausd collection and inserting now.");
				  dbo.collection(elaUSDcollectionName).insertOne(elaObj, function(err, res) {
					    if (err){
							  throw err;
					    }else{
						    console.log("all quotes  inserted");
						    db.close();
					    }
					  }); 
		    }
		   
		  });
	      returnResults(usdamout/elaUsdPrice,elaUsdPrice,huobiTimeStamp)
	  })
}
function huobiCall(usdvalue,dbo,db){
	//https://api.huobipro.com/market/detail?symbol=elausdt
	//Check if rate exists in DB for the past 60 Seconds
	  var query = {};
	  query["keypair"] = "USDELA";
	  dbo.collection(elaUSDcollectionName).findOne(query, function(err, result) {
		  if (err){
			  console.log("Issue connecting 2")
			  throw err;
		  } 
		    if (result) {
		    	//Check if the result is less than 24 hrs
		    	if(checkTimeStampsSecondDiff(result.timestamp) < 2){
			    	 returnResults(usdvalue/result.value,result.value,result.timestamp);
		    	}else{
			    	//console.log("Time stamp grater than 2 min " + result.timestamp);
			    	callHuobiAPI(usdvalue,dbo,db);
		    	}
		    } else {
		    	//console.log("No results found so calling huobi API");
		    	callHuobiAPI(usdvalue,dbo,db);
		    }

	  });

	
}
function returnResults(rate,usdela,time){
	  response.status(200);
	  response.setHeader('Content-Type', 'application/json');
	  response.send(JSON.stringify({ elaamount: rate,exchangerate: usdela,querytime:time}));
}

exports.details = function(req, res){
 var currencyCode = req.query.symbol;
 var amount = req.query.amount;
 if (typeof currencyCode !== 'undefined' && typeof amount !== 'undefined'){
	 if (validateCurrencyCode(currencyCode)) {
    	 response = res;
         if(currencyCode !== "USD"){
        	 var rate = saveCurrencyPairsToDB(currencyCode,amount);
         }else{
        	 //Currency is USD
        		MongoClient.connect(mongoURL, function(err, db) {
        			  if (err){
        				  throw err;
        			  }else{
        				  console.log("Connected to db")
        				  var dbo = db.db(dbName);	
        		          huobiCall(amount,dbo,db);

        			  }		  
        			  //return excahngeRateInUSD;
        			});
         }
		
		}else{
			  res.send("Invalid currency code.");
		}
 }else{
	  res.send("Required Params such as  Symbol AND/OR Amount is missing.");
 }
};

