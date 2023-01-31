const express = require("express");
const path = require("path");

const app = express();
const server = require("http").createServer(app);

const io = require("socket.io")(server);

var User = require("./models/user")
var mongoose = require("mongoose")
var params = require("./params/params");
var bodyParser = require("body-parser");
var passport = require("passport");
var session = require("express-session");
var cookieParser = require("cookie-parser");
var setUpPassport = require("./setuppassport");
var flash = require("connect-flash");

server.listen(5000);

app.use(express.static(path.join(__dirname+"/public")));

io.on("connection", function(socket){   
	socket.on("newuser",function(clientname){
		socket.broadcast.emit("update", clientname + " joined the conversation");
	});
	socket.on("exituser",function(clientname){
		socket.broadcast.emit("update", clientname + " left the conversation");
	});
	socket.on("chat",function(message){
		socket.broadcast.emit("chat", message);

		
	});
});



