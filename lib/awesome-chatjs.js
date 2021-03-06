/*
 * awesome_chatjs
 * https://github.com/saromanov/awesome-chatjs
 *
 * Copyright (c) 2014 
 * Licensed under the MIT license.
 */

'use strict';


var sys = require("sys")
var expr = require("express")
var app = expr()
var http = require("http").Server(app)
var io = require("socket.io")(http)
var redis = require('redis')
var redis_client = redis.createClient()
var crypto = require('crypto')
var nodegit = require('nodegit')
var socketSessions = require('socket.io-handshake');
var session = require('express-session');
var cookieParser = require('cookie-parser');
var RedisStore = require('connect-redis')(session);
var sessionStore = new RedisStore();

//TODO: use react.js

//Global for all users
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
			return storeinfo.nick;
		}
	}
}


var Gitclone = function(url, path){
	var targetdir = path + url.split('/').reverse()[0];
	nodegit.Clone.clone(url, targetdir, null)
	.catch(function(err) { console.log(err); });
}

//Get popular words from chat
var PopularWords = function(messages){
	var counter = {};
	var words = [];
	messages.forEach(function(message){
		var splitter = message.split(' ');
		splitter.forEach(function(word){
			word = word.toLowerCase();
			if(word in counter)
				counter[word] += 1;
			else
				counter[word] = 1;
		});
	});

	for(var i in counter){
		words.push({name:i, count: counter[i]});
	}

	return words.sort(function(a,b){
		return a.count - b.count;
	}).reverse();;
}

//io.use(socketSessions())


io.on('connection', function(client){
	client.on('connect', function(data){
		console.log("THIS IS CONNECT: ");
	});
	client.on('message', function(message){
		//message['nick'] = client.handhsake.session.name;
		message['nick'] = client.name;
		message['style'] = client.style;
		if(client.usermessages == undefined)
			client.usermessages = [message.text];
		else
			client.usermessages.push(message.text);
		if(client.popular != undefined)
			client.popular = undefined;
		io.emit('message',  message);
	});

	//Store favorite messages
	client.on('store', function(nick, message){
		redis_client.lpush(nick + "_store", message);
		io.emit('store', message);
	});

	client.on('store user', function(nick, pass){
		var hash = crypto.createHmac('sha1', pass).update(nick).digest('hex');
		redis_client.hexists(nick, 'password', function(err, replay){
			if(replay == 1){
				redis_client.hget(nick, 'password', function(err, replaypass){
					if(replaypass == hash)
						io.emit('correct pass')
					else
						io.emit('incorrect pass')
				})
			}
			else{
				redis_client.hset(nick, 'password', hash, redis.print)
				io.emit('new user', nick)
			}
		})
	})

	//Get local history
	client.on('gethistory', function(nick){
		redis_client.get(nick, function(err, replay){
			if(replay != undefined){
				console.log("YES");
			}
		});
		var popular = client.popular;
		if(popular == undefined)
			popular = PopularWords(client.usermessages);
		console.log(popular);

	});

	client.on('data1', function(message){
		users[message.nick] = message.nick
		client.name = message.nick
		client.style = message.styles
	});

	client.on('gitclone', function(info){
		Gitclone(info[1], info[2]);
		io.emit('message', {'nick':'system', 'text': 'cloning is starting...'})
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

