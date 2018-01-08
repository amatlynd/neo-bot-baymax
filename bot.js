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
		
		//Gets all currencies
		const url = "https://api.coinmarketcap.com/v1/ticker/?limit=0";
		
		fetch(url)
		.then((resp) => resp.json())
		.then(function(data){
			if(cmd.indexOf('/') > -1){
				bot.sendMessage({
					to: channelID,
					message: "entered the /"
				});
				ratio1 = cmd.slice(0,cmd.indexOf('/'));
				ratio2 = cmd.slice(cmd.indexOf('/')+1);
				bot.sendMessage({
					to: channelID,
					message: ratio1 + " " + ratio2
				});
				for (var j = 0;j < data.length;j++){
					if(data[j].symbol == ratio1){
						bot.sendMessage({
							to: channelID,
							message: data[j].price_usd
						});
						r1 = parseFloat(data[j].price_usd);
					}
					if(data[j].symbol == ratio2){
						bot.sendMessage({
							to: channelID,
							message: data[j].price_usd
						});
						r2 = parseFloat(data[j].price_usd);
					}
					r1 = r1/r2;
					finalMessage = r1.toString();
					bot.sendMessage({
						to: channelID,
						message: finalMessage
					});
					break;
				}
			}
			for(var i = 0;i < data.length;i++){
				if(data[i].symbol == cmd){
					//decides whether the price or percent change is wanted
					if(prompt == '!'){
							finalMessage = "$" + data[i].price_usd
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
