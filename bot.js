var fetch = require('node-fetch');
var Discord = require('discord.io');
var logger = require('winston');
//var dbFunctions = require('./dbFunctions');

// Configure logger settings
logger.remove(logger.transports.Console);
logger.add(logger.transports.Console, {
    colorize: true
});
logger.level = 'debug';
// Initialize Discord Bot
var bot = new Discord.Client({
   token: process.env.BOT_TOKEN,
   autorun: true
});

bot.on('ready', function (evt) {
    logger.info('Connected');
    logger.info('Logged in as: ');
    logger.info(bot.username + ' - (' + bot.id + ')');
});
bot.on('message', function (user, userID, channelID, message, evt) {
    // Our bot needs to know if it will execute a command
    // It will listen for messages that will start with `!` or `%`
	var prompt = message.substring(0, 1)
	
    if (prompt == '!' ||prompt == '%') {
		
        var args = message.substring(1).split(' ');
        var cmd = args[0].toUpperCase();
		var finalMessage = "";
        args = args.splice(1);
		var ratio1 = "";
		var ratio2 = "";
		var r1 = 0;
		var r2 = 0;
		var r3 = 0;
		
		if(cmd == "HELP"){
			finalMessage = "Hello, " + user + "\n"
				+ "I am a crypto bot" + "\n"
				+ "Currently I have the following commands: " + "\n\n"
				+ "!<YOUR_TOKEN> and %<YOUR_TOKEN>" + "\n\n"
				+ "%<YOUR_TOKEN> will give you the percent change for the last 24 hours" + "\n\n"
				+ "!<YOUR_TOKEN> will give you the current price" + "\n"
				+ "! also has a ratio function. \nFor example: \n"
				+ "!<YOUR_TOKEN1>/<YOUR_TOKEN2> will give you the ratio for the two coins" + "\n\n"
				+ "I'm still growing so if you have any requests just tell Lyndon"

			bot.sendMessage({
				to: channelID,	
				message: finalMessage
			});
		}


		//Gets all currencies from coinmarketcap.com
		const url = "https://api.coinmarketcap.com/v1/ticker/?limit=0";
		
		//Gets all currencies from binance.com
		const urlBinance = "https://api.binance.com/api/v1/ticker/allPrices";
		var binanceCMD;
		
		fetch(urlBinance)
		.then((resp) => resp.json())
		.then(function(data){
			var btcPrice;
			var finalPrice;
			for(var j = 0; j < data.length;j++){
				if(data[i].symbol == "BTCUSDT"){
					btcPrice = data[j].price;
				}
			}
		
			if(cmd != "BTC "){
				binanceCMD = cmd + "BTC";
				for(var i = 0;i < data.length;i++){
					if(data[i].symbol == binanceCMD){
						if(prompt == '!'){
								finalPrice = parseFloat(data[i].price) * parseFloat(btcPrice);
								finalMessage = "Binance Price: $" + finalPrice;
						}
						bot.sendMessage({
							to: channelID,
							message: finalMessage
						});
						break;
					}
				}
			}else{

			}

		}).catch(function(err){
			bot.sendMessage({
						to: channelID,
						message: err
					});
			console.log('Fetch Error :-S', err);
		});
		
		
		fetch(url)
		.then((resp) => resp.json())
		.then(function(data){
			//This is for ratio
			//FIX for infinity cases
			if(cmd.indexOf('/') > -1){
				ratio1 = cmd.slice(0,cmd.indexOf('/'));
				ratio2 = cmd.slice(cmd.indexOf('/')+1);
				for (var j = 0;j < data.length;j++){
					if(data[j].symbol == ratio1){
						r1 = parseFloat(data[j].price_usd);
					}
					if(data[j].symbol == ratio2){
						r2 = parseFloat(data[j].price_usd);
					}if(r1 && r2){
						break;
					}
				}
				r3 = r2/r1;
				finalMessage = r3.toString();
				bot.sendMessage({
					to: channelID,
					message: ratio1 + " " + ratio2 + " ratios is " + r1.toString() + ":" + r2.toString() + " = " + finalMessage
				});
			}

			for(var i = 0;i < data.length;i++){
				if(data[i].symbol == cmd){
					//decides whether the price or percent change is wanted
					if(prompt == '!'){
							finalMessage = "CoinMarketCap Price: $" + data[i].price_usd
					}if (prompt == '%'){
						finalMessage =  data[i].percent_change_24h + prompt
					}
					bot.sendMessage({
						to: channelID,
						message: finalMessage
					});
					break;
				}
			}
		})
		.catch(function(err){
			bot.sendMessage({
						to: channelID,
						message: err
					});
			console.log('Fetch Error :-S', err);
		});
     }
});
