/*
 * Developed by :HT
 * Developed on :05/29/2018
 * Code Reviewers : *****
 * FileName:connections.js
 * Usage:Used to create and reuse mongo connections across the app".
 * Pending Items : ****
 */
/*jshint esversion: 6 */


var connectionInstance;
var MongoClient = require('mongodb').MongoClient
var constants = require("config/constants");
//var count  = 0;
//var countnew = 0;

module.exports = function(callback) {
    //if already we have a connection, don't connect to database again
    if (connectionInstance) {
    	//count = count+1;
        //console.log("OLD CONNECTION No-->"+count);
        callback(connectionInstance);
        return;
    } else {
        MongoClient.connect(constants.MONGOURL, function(err, databaseConnection) {
            if (err) {
                throw err;
            } else {
            	connectionInstance = databaseConnection;
                //countnew = countnew+1;
                //console.log("FRESH CONNECTION-->"+countnew);
                callback(databaseConnection);
            }
            //databaseConnection.close();
        });
    }
};