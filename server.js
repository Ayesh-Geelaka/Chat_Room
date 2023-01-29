const express = require("express");
const path = require("path");

const app = express();
const server = require("http").createServer(app);

const io = require("socket.io")(server);

server.listen(5000);

app.use(express.static(path.join(__dirname+"/public")));

io.on("connection", function(socket){   
	socket.on("newuser",function(clientname){
		socket.broadcast.emit("update", clientname + " joined the chat");
	});
	socket.on("exituser",function(clientname){
		socket.broadcast.emit("update", clientname + " left the chat");
	});
	socket.on("chat",function(message){
		socket.broadcast.emit("chat", message);

		
	});
});

