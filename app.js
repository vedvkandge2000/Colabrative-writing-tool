require('dotenv').config();
const Routes = require("./routes/route");
const db = require("./models");
const express = require("express");
const http = require("http");
const socketio = require("socket.io");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const _ = require('lodash');
const mongoose = require('mongoose');
const session = require('express-session');
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
var ObjectId = mongoose.Schema.ObjectId;


const app = express();
const server = http.createServer(app);
const io = socketio(server);

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

io.on('connection', (socket) => {
  console.log('New WebSocket connection')

    socket.on('message', (message) => {
             socket.broadcast.emit('message', message)
         })

    socket.on('sendMessage', (message) => {
        io.emit('message', message)
    })
})


app.use(session({
  secret: 'our little secret.',
  resave: false,
  saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());

passport.use(db.User.createStrategy());
passport.serializeUser(function(user, done) {
  done(null, user.id);
});

passport.deserializeUser(function(id, done) {
  db.User.findById(id, function(err, user) {
    done(err, user);
  });
});
app.use("/", Routes);


let port = process.env.PORT;
if (port == null || port == "") {
  port = 5000;
}
server.listen(port, function() {
  console.log("Server started on port!");
});




