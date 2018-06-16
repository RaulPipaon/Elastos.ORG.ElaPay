/*
 * Developed by :HT
 * Last Updated by :
 * Developed on :04/25/2018
 * Code Reviewers : Noah and Song
 * FileName:constants.js
 * Usage:Used to store global constants.
 * Pending Items :
 * Notes:
 *     ELATOUSDFREQUENCYINTERVAL : In minutes (2)
 *     BACKGROUNDJOBSTIMEINTERVAL : In milli seconds(10*1000 = 10,000)
 *     USDTOCURRENCYFREQUENCYINTERVAL : In days (1)
 *
 */
module.exports = Object.freeze({
    MONGOURL : "mongodb://localhost/",
    BCEXPLORERURL : "https://blockchain-test-06.eadd.co",
    ELAAPIURL  : "http://node-regtest-03-01.eadd.co:23334",
    CURRENCYURL : "http://www.apilayer.net/api/live?access_key=3e237efb6e565d8836feb494f3d9bbe0&format=1",
    HUOBIURL : "https://api.huobipro.com/market/detail?symbol=elausdt",
    ELATXPAGELOCATION : "/tx/",
    TXLOCATION : "/api/v1/transaction/",
    BLOCKHEIGHTLOCATION: "/api/v1/block/height",
    BLOCKHEIGHTDETAILLOCATION: "/api/v1/block/details/height/",
    DBNAME : "elaPay",
    ELADETAILSCOLLECTIONDBCALL : "callbackhashdetails",
    ORDERIDCALLBACKDETAILS : "callbackorderiddetails",
    ELABLOCKDB : "elablockdb",
    ELAHASHCOLLECTION : "callbackhashdb",
    COLLECTIONNAME : "exchangeRatedb",
    ELAUSDCOLLECTIONNAME : "USDELAConversionRatedb",
    ORDERCOLLECTIONNAME : "orders",
    BACKGROUNDJOBSTIMEINTERVAL : 1000,
    USDTOCURRENCYFREQUENCYINTERVAL : 1,
    ELATOUSDFREQUENCYINTERVAL : 2
});

