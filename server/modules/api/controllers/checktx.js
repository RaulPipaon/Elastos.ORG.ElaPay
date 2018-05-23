/*
 * Developed by :HT
 * Developed on :05/21/2018
 * Code Reviewers : *****
 * FileName:checktx.js
 * Usage:Check if tx is present in blockchain using txhash and orderid.If found send back details.
 * Sample API get : http://localhost:3002/api/checktx/?txhash=9acb57f462ac2c6132e67eec044f7dcbde93287b4a65f43b9a7a21dafa64531f&orderid=ELA
 */
/*jshint esversion: 6 */
var fetch = require("node-fetch");
var constants = require("config/constants");
var mongoClient = require('mongodb').MongoClient;
var response;
var request;
var amount = 0.0;
var callbackURL;
//Get Request and Send Response
exports.details = function(req, res) {
    var txHashUrl = constants.ELAAPIURL + constants.TXLOCATION + req.query.txhash;
    response = res;
    request = req;
    if (typeof req.query.txhash == 'undefined' || typeof req.query.orderid == 'undefined') {
        res.status(404);
        res.setHeader('Content-Type', 'application/json');
        res.send(JSON.stringify({
            details: "Required txhash OR orderid Missing",
            status: "Not Success",
            action: "CheckIfTransactionPresent"
        }));
    } else {
        fetchAmountFromOrderDB(req.query.orderid)
            .then(checkBlockDB)
            .then(sendresponse)
            .catch(error => console.log(error.message));
    }
};

//Call Order Database to fetch amount based on orderid
var fetchAmountFromOrderDB = function(orderid) {
    var subQuery = {};
    var orderavailable = false;
    return new Promise(function(resolve, reject) {
        try {
            var oIDMongo = require('mongodb');
            var id = new oIDMongo.ObjectId(orderid);
            subQuery["_id"] = id;
        	} catch (err) {
                resolve(orderavailable);
        	}
        mongoClient.connect(constants.MONGOURL, function(err, db) {
            if (err) {
                db.close();
                resolve(orderavailable);
                //throw err;
            } else {
                var dbo = db.db(constants.DBNAME);
                dbo.collection(constants.ORDERCOLLECTIONNAME).findOne(subQuery, function(err, result) {
                    if (err) {
                        reject(err);
                        db.close();
                    } else {
                        if (result) {
                            orderavailable = true;
                            amount = result.elaAmount;
                            callbackURL = result.callbackUrl

                            resolve(orderavailable);
                            //db.close();

                        } else {
                            resolve(orderavailable);
                            //db.close();
                        }
                    }
                    db.close();
                });
            }
        });
    });
}



//Call and check if transaction exists on global blockchain
var checkBlockDB = function(orderavailable) {
    var status = false;
    if (orderavailable) {
        var subQuery = {};
        subQuery["txhash"] = request.query.txhash;
        subQuery["orderId"] = request.query.orderid;
        subQuery["amountAsDouble"] = amount;
        return new Promise(function(resolve, reject) {
            mongoClient.connect(constants.MONGOURL, function(err, db) {
                if (err) {
                    db.close();
                    resolve(status);
                    //throw err;
                } else {
                    var dbo = db.db(constants.DBNAME);
                    dbo.collection(constants.ELABLOCKDB).findOne(subQuery, function(err, result) {
                        if (err) {
                            reject(err);
                            db.close();
                        } else {
                            if (result) {
                                status = true;
                                resolve(status);
                                //db.close();
                            } else {
                                resolve(status);
                                //db.close();
                            }
                        }
                        db.close();
                    });
                }
            });
        });
    } else {
    	//DO NOTHING
    }
}

//Call and save
var sendresponse = function(status) {
    if (status) {
        return new Promise(function(resolve, reject) {
            response.status(200);
            response.setHeader('Content-Type', 'application/json');
            var trackURL = constants.BCEXPLORERURL + constants.ELATXPAGELOCATION + request.query.txhash;
            response.send(JSON.stringify({
                status: "Success",
                action: "CheckIfTransactionPresent",
                txHash: request.query.txhash,
                trackingURL: trackURL,
                callbackURL: callbackURL
            }));
            resolve(true);
        });
    } else {
        response.status(404);
        response.setHeader('Content-Type', 'application/json');
        response.send(JSON.stringify({
            status: "Not Success",
            action: "CheckIfTransactionPresent",
            details: "TX hash is in-valid or not presnt in blockkhain yet"
        }));
    }

}