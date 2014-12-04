/*
 * awesome_chatjs
 * https://github.com/saromanov/awesome-chatjs
 *
 * Copyright (c) 2014 
 * Licensed under the MIT license.
 */

'use strict';


var sys = require("sys")
	app = require("express")()
	http = require("http").Server(app)
	io = require("socket.io")(http)
	redis = require('redis')
	redis_client = redis.createClient()
	crypto = require('crypto')

//TODO: use react.js

var users = {};
var dataset=[];

var Commands = function(data){
	if(data.length > 0 && data[0] == '%'){
		var command = data.replace('%','');
		if(command.length > 0){
			var splitter = command.split(' ');
			if(command == 'git'){
				//Do something with git
			}

			if(command == 'count'){
				//Count 
			}

			if(command == 'file'){
				//File load
				//Set list of loaded file
			}

		}
	} 
}

var MySession = function(){
	var storeinfo = {}
	return {
		setInfo: function(info){
			storeinfo = info;
		},
		getNick: function(){
			console.log(storeinfo);
			return storeinfo.nick;
		}
	}
}

io.on('connection', function(client){
	users['default'] = 'default';
	var info = new MySession();
	client.on('connect', function(data){
		console.log("THIS IS CONNECT: ");
	});
	client.on('message', function(message){
		var nick = info.getNick();
		message['nick'] = nick;
		console.log(message);
		io.emit('message',  message);
	});

	//Store favorite messages
	client.on('store', function(nick, message){
		console.log("My MESSAGE: ", message);
		redis_client.lpush(nick + "_store", message);
		io.emit('store', message);
	});

	client.on('gethistory', function(nick){
		redis_client.get(nick, function(err, replay){
			console.log("CURRENT HISTORY: " + replay);
		})
	});

	client.on('data1', function(message){
		info.setInfo(message);
	});
}) 

app.get('/', function(req, res){
	res.sendFile(__dirname+ '/index.html');
})
http.listen(3000, function(){
	console.log("Listen on 3000");
})


exports.awesome = function() {
  return 'awesome';
};

