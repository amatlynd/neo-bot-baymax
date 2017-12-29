var fetch = require('node-fetch');
var Discord = require('discord.io');
var logger = require('winston');
//var auth = require('./auth.json');
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
    // It will listen for messages that will start with `!`
	var prompt = message.substring(0, 1)
    if (prompt == '!' ||prompt == '%') {
		
        var args = message.substring(1).split(' ');
        var cmd = args[0].toUpperCase();
		var finalMessage = ""
        args = args.splice(1);
		
		const url = "https://api.coinmarketcap.com/v1/ticker/?limit=0";
		
		//place holder for all cryptocurrencies
		if(cmd == "ALL"){
			bot.sendMessage({
				to: channelID,
				message: "Nah"
			});
		}
		
		fetch(url)
		.then((resp) => resp.json())
		.then(function(data){
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
			console.log('Fetch Error :-S', err);
		});
     }
});
