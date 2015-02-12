/*
 * awesome_chatjs
 * https://github.com/saromanov/awesome-chatjs
 *
 * Copyright (c) 2014 
 * Licensed under the MIT license.
 */

'use strict';


var sys = require("sys")
var app = require("express")()
var http = require("http").Server(app)
var io = require("socket.io")(http)
var redis = require('redis')
var redis_client = redis.createClient()
var crypto = require('crypto')
var nodegit = require('nodegit')

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


var Gitclone = function(url, path){
	nodegit.Clone.clone(url, path, null)
	.catch(function(err) { console.log(err); });
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
		console.log("We emit: ", message);
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
		info.setInfo(message);
	});

	client.on('gitstat', function(info){
		Gitclone(info[1], info[2])
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

