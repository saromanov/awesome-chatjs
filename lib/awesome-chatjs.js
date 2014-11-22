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

io.on('connection', function(client){
	client.on('connect', function(data){
		console.log("THIS IS CONNECT: ");
	});
	client.on('message', function(nick, message){
		console.log("VISIBLE MESSAGE: ", message);
		io.emit('message',  nick + ": " + message);
	});

	//Store favorite messages
	client.on('store', function(nick, message){
		console.log("My MESSAGE: ", message);
		//Store in redis
	})
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
