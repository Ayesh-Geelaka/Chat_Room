const express = require("express");
const path = require("path");

const app = express();
const server = require("http").createServer(app);

const io = require("socket.io")(server);
var flash = require("connect-flash");

var User = require("./models/user")
var mongoose = require("mongoose")
var bodyParser = require("body-parser");
var passport = require("passport");
var session = require("express-session");
var cookieParser = require("cookie-parser");
var setUpPassport = require("./setuppassport");

app.use(express.static(path.join("public")));
server.listen(5000);
mongoose.set('strictQuery', false)


var db = mongoose.connect("mongodb+srv://ayesh:ayesh123@cluster0.mgnsveu.mongodb.net/?retryWrites=true&w=majority", function (error, response) {
  if (error) { console.log(error); }
    else { console.log('connected' + db) }
	});
	setUpPassport();
	

app.use(cookieParser());
app.use(session({
    secret: "lsd64fkbs345alnkf55sdkbj",
    resave: false,
    saveUninitialized: false
}));

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
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

/* User Login */
app.post("/login", passport.authenticate("user", {
	successRedirect: "/chatapp.html",
	failureRedirect: "/index.html",
	failureFlash: true
  }));
  
  app.post("/signup", function (req, res, next) {
  //console.log(req.body.email);
  User.findOne({ email: req.body.email }, function (err, user) {
	if (err) { return next(err); }
	if (user) {
		
		console.log("There's already an account with this email")
	}
	else{
	
		var newUser = new User({
			username: req.body.username,
			email: req.body.email,
			contact: req.body.contact,
			password: req.body.password
		});
		newUser.save(next);
		res.redirect('/');

	}	
	});
  })
  
  app.get("/logout", function (req, res) {
	req.logout(function (err) {
		if (err) { return next(err); }
		res.sendFile('/index.html');
      });
  });
  
  module.exports.app = app