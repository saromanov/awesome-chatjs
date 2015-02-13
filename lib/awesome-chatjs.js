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

io.use(socketSessions({store: sessionStore, key:'sid', secret:'secret', parser:cookieParser()}));

io.on('connection', function(client){
	users['default'] = 'default';
	client.on('connect', function(data){
		console.log("THIS IS CONNECT: ");
	});
	client.on('message', function(message){
		console.log(message)
		message['nick'] = client.handhsake.session.name;
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
			if(replay != undefined){
				console.log("YES");
			}
		})
	});

	client.on('data1', function(message){
		client.handhsake.session.name = message.nick
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

