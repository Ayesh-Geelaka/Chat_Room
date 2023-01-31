const express = require("express");
const path = require("path");

const app = express();
const server = require("http").createServer(app);

const io = require("socket.io")(server);

var User = require("./models/user")
var path = require("path")
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

mongoose.set('strictQuery', false)

var db = mongoose.connect(params.DATABASECONNECTION, function (error, response) {
    if (error) { console.log(error); }
    else { console.log('connected' + db) }
});
setUpPassport();

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

server.listen(PORT, () => console.log(`Server running on port ${PORT}`));

/* User Login */
app.post("/login", passport.authenticate("user", {
  successRedirect: "/public/index.html",
  failureRedirect: "/login.html",
  failureFlash: true
}));

app.post("/signup", function (req, res, next) {

  User.findOne({ email: req.body.email }, function (err, user) {
      if (err) { return next(err); }
      if (user) {
          //req.flash("error", "There's already an account with this email");
          //return res.redirect("/login");
          console.log("There's already an account with this email")
      }
      var newUser = new User({
          username: req.body.username,
          email: req.body.email,
          contact: req.body.contact,
          password: req.body.password
      });
      newUser.save(next);
      res.sendFile(__dirname + '/public/login.html');
  });
})

app.get("/logout", function (req, res) {
	req.logout(function (err) {
		if (err) { return next(err); }
		res.sendFile(__dirname + '/public/index.html');
      });
  });



