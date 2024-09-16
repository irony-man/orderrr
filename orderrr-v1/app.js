require('dotenv').config();
const express = require("express");
const app = express();
const mongoose = require('mongoose');
const cors = require("cors");
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const loginRoutes = require('./routes/loginRoutes');
const User = require('./models/userModel');
const homeRoutes = require("./routes/homeRoutes");
const cartwishRoutes = require("./routes/cartwishRoutes");
const designRoute = require("./routes/designRoute");
const profileRoutes = require("./routes/profileRoutes");
const path = require('path');
const http = require('http').createServer(app);
const io = require('socket.io')(http);

app.use(cors());
app.use(cookieParser());
app.set('io', io);
app.use(bodyParser.urlencoded({
  limit: '50mb',
  extended: true
}));
app.use(bodyParser.json({
  limit: "50mb"
}));
app.use(session({
  secret: process.env.SECRET,
  resave: false,
  saveUninitialized: true
}))

//mongodb://localhost:27017/
//
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});



app.use(loginRoutes);
app.use(homeRoutes);
app.use(cartwishRoutes);
app.use(designRoute);
app.use(profileRoutes);


app.get("/initiate", (req, res) => {
  User.findOne({
      _id: req.cookies.user
    })
    .populate("designs")
    .populate("cart")
    .populate("wishlist")
    .select("-password -otp -__v")
    .then(user => {
      if (user) {
        req.session.user = user;
        res.json(user);
      } else {
        res.json();
      }
    })
    .catch(err => {
      if (err) throw err;
    })
})

if(process.env.NODE_ENV==='production'){
  app.use(express.static(path.join(__dirname, "..", 'client', 'build')));
  app.get("/*", (req, res) => {
    res.sendFile(path.resolve(__dirname, "..", 'client', 'build', 'index.html'))
  })
}



///app.listen(process.env.PORT || 8080);

app.start = app.listen = function() {
  return http.listen.apply(http, arguments)
}

app.start(process.env.PORT || 8080);
