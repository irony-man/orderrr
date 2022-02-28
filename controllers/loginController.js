const User = require('../models/userModel');
const Password = require('../models/passwordModel');
const bcrypt = require('bcrypt');
const sendMailer = require('../utils/sendMail');
const Pass = require('../models/passwordModel');
const {
  use
} = require('../routes/homeRoutes');

const signup = (req, res) => {
  const {
    username,
    email,
    type,
    password
  } = req.body;
  User.findOne({
    email
  }, (err, user) => {
    if (err) {
      res.status(400).json("error: " + err)
    }
    if (user) {
      res.status(409).json({
        message: "User already exist!!"
      });
    }
    if (!user) {
      bcrypt.hash(password, 10).then((hash) => {
        Pass({
          value: hash
        }).save((err, result) => {
          User({
            username,
            email,
            password: result,
            type,
            design: []
          }).save();
        })

      })
      res.status(201).json({
        message: "Created!!"
      });
    }
  })
}

const login = (req, res) => {
  const {
    email,
    password
  } = req.body;
  User.findOne({
      email
    }).populate('password')
    .then(user => {
      if (!user) {
        res.status(404).json({
          message: "No such user!!"
        });
      } else {
        bcrypt.compare(password, user.password.value, function (err, result) {
          if (err) {
            res.status(400).json({
              message: "Couldn't login!!"
            })
          }
          if (!result) {
            res.status(401).json({
              message: "Incorrect Password!!"
            })
          }
          if (result) {
            User.findOne({
                email: user.email
              })
              .populate("designs")
              .populate("cart")
              .populate("wishlist")
              .then(userr => {
                req.session.user = userr;
                res.status(200).json(userr);
              })
            res.cookie("user", user._id);
            res.cookie("isLogged", true);
          }
        })
      }
    })
    .catch(err => {
      console.log(err);
      res.status(400).json({
        message: "Couldn't login!!"
      })
    })
}

const sendMailPass = (req, res) => {
  const {
    email
  } = req.body;
  User.findOne({
    email
  }, (err, user) => {
    if (err) {
      res.status(400).json("error: " + err)
    }
    if (user) {
      if (user.otp == null) {
        sendMailer(user.email, user._id).then(send => {
          if (send) {
            res.status(200).json({
              message: "Check your email for link!! Valid for 10 minutes."
            });
          } else {
            res.status(424).json({
              message: "Couldn't send OTP!!"
            });
          }
        }).catch(err => {
          console.log(err);
        })
      } else {
        res.status(424).json({
          message: "We have already send the mail to you!!"
        });
      }
    }
    if (!user) {
      res.status(404).json({
        message: "No such user!!"
      });
    }
  })
}

const setPass = (req, res) => {
  const para = new URLSearchParams(req.params.url);
  const otp = parseInt(para.get('otp'));
  const id = para.get('id');
  User.findOne({
    _id: id
  }, (err, user) => {
    if (err) {
      res.status(400).json({
        message: "Link expired!!"
      })
    }
    if (user) {
      if (otp === user.otp) {
        res.status(200).json({
          message: "You are allowed to change your password!!"
        });
      } else {
        res.status(404).json({
          message: "Link expired!!"
        })
      }
    }
  })
}

const postPass = (req, res) => {
  const id = new URLSearchParams(req.params.url).get("id");
  const {
    password
  } = req.body;
  User.findOne({
      _id: id
    })
    .populate("password")
    .then(user => {
      bcrypt.hash(password, 10).then((hash) => {
        Password.updateOne({
          _id: user.password._id
        }, {
          value: hash,
        }, (err) => {
          if (err) {
            res.status(400).json("error: " + err)
          } else {
            res.status(200).json({
              message: "Password changed!!"
            });
          }
        })
      })
    })
    .catch(err => res.json({
      message: "Couldn't change password!!"
    }))
}

const logout = (req, res) => {
  req.session.destroy(function (err) {
    if (err) {
      res.status(400).json({
        message: "Couldn't logout!!"
      });
    } else {
      res.clearCookie("isLogged");
      res.clearCookie("user");
      res.status(200).json({
        message: "Logout successful!!"
      });
    }
  })
}

module.exports = {
  signup,
  login,
  sendMailPass,
  setPass,
  postPass,
  logout
}