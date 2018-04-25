/*Modify const before start
 * GET API : http://localhost:2036/querytx/?txhash=123
 * http://localhost:2037/querytx/?txhash=a1d6b0683af51cde18f095429e359f3f0b837e097d13bc49438c85e69f537bc2

 *http://localhost:2039/querytx/?txhash=123/
 **/
/*jshint esversion: 6 */

const fetch = require("node-fetch");
const elaHostURL  = "http://blockchain-test-05.eadd.co";
const elaAPIURL = "http://api-test-05.eadd.co:22334";
const txLocation = "/api/v1/transaction/";
const elatxPageLocation = "/tx/";
exports.details = function(req, res){
   var txHashUrl = elaAPIURL+txLocation+req.query.txhash;
   if(typeof req.query.txhash == 'undefined'){
        res.status(404);
        res.setHeader('Content-Type', 'application/json');
        res.send(JSON.stringify({ status: "Required txHash Missing"}));
   }else{
     console.log("Starting to conncet to "+txHashUrl);
     fetch(txHashUrl)
      .then((response) => response.json())
      .then(function(data) {
          res.status(200);
          res.setHeader('Content-Type', 'application/json');
          var trackURL = elaHostURL+elatxPageLocation+req.query.txhash;
          res.send(JSON.stringify({ status: "found",txhash:req.query.txhash,trackurl: trackURL,confirmations:data.confirmations,blockheight:data.blockheight,time:data.time,blockhash:data.blockhash}));
      })
      .catch(function(error) {
          const status = error.response ? error.response.status : 500
                if (status === 404) {
                    res.status(404);
                    res.setHeader('Content-Type', 'application/json');
                    res.send(JSON.stringify({ status: "notfound",details:"TX hash is valid or not presnt in blockkhain yet"}));
                } else {
                    res.status(404);
                    res.setHeader('Content-Type', 'application/json');
                    res.send(JSON.stringify({ status: "notfound",details: "TX hash  in valid or not presnt in blockkhain yet"}));
                }
        });
   }
  };
