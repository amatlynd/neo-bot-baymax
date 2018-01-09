

var mongodb = require('mongodb').MongoClient;


//var dburl = process.env.DB_URL
var dburl = "mongodb://amatlynd:William123@ds163796.mlab.com:63796/coins"
// retrieves the persons profile for displaying

module.exports = {
	getPersonCoin: function (bot,userID,channelID){
			var messageList = []
			var finalMessage = ""
			mongodb.connect(dburl, function(err,db){
				if (err){
					throw err;
				}
				else{
					var dbase = db.db("coins");
					var query = {name: userID}
					console.log("inside dbFUnctions");
					//queries the database to get the investors profile
					dbase.collection("investor").find(query).toArray(function(err,result){
						if(err){
							throw err;
						}else{
							for (var i = 0; i < result[0].coins.length; i++){
								finalMessage += result[0].coins[i][0] + ": " + result[0].coins[i][1] + "\n";
							}
							bot.sendMessage({
								to: channelID,
								message: finalMessage
							});
						}
					});
					
					//get the list of lists of coins the owner has e.g. [["btc", 23],["eth", 100]] 

				}
				db.close();
			});
	},

	addCoin: function(userID, coinName){
		//checks if person is already in the database
		
		
		//else it updates the persons file
		
		
		return 0;
	},

	removeCoin: function(userID,coinName){
		return 0;
	}
}