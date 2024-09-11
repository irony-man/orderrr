const User = require("../models/userModel");
const bcrypt = require("bcrypt");
const sendMailer = require("../utils/sendMail");

const signup = (req, res) => {
  const { username, email, type, password } = req.body;
  User.findOne(
    {
      email,
    },
    (err, user) => {
      if (err) {
        res.status(400).json("error: " + err);
      }
      if (user) {
        res.status(409).json({
          message: "User already exist!!",
        });
      }
      if (!user) {
        bcrypt.hash(password, 10).then((hash) => {
          User({
            username,
            email,
            password: hash,
            type,
            design: [],
          }).save();
        });
        res.status(201).json({
          message: "User Created!!",
        });
      }
    }
  );
};

const login = async (req, res) => {
  const { email, password } = req.body;
  const userPassword = await User.findOne({email}).select("password")
  User.findOne({
    email,
  })
    .populate("designs")
    .populate("cart")
    .populate("wishlist")
    .select("-otp -__v -password")
    .then((user) => {
      if (!user) {
        res.status(404).json({
          message: "No such user!!",
        });
      } else {
        bcrypt.compare(password, userPassword.password, function (err, result) {
          if (err) {
            res.status(400).json({
              message: "Couldn't login!!",
            });
          }
          if (!result) {
            res.status(401).json({
              message: "Incorrect Password!!",
            });
          }
          else if (result) {
            req.session.user = user;
            res.cookie("user", user._id);
            res.cookie("isLogged", true);
            res.status(200).json(user);
          }
        });
      }
    })
    .catch((err) => {
      console.log(err);
      res.status(400).json({
        message: "Couldn't login!!",
      });
    });
};

const sendMailPass = (req, res) => {
  const { email } = req.body;
  User.findOne(
    {
      email,
    },
    (err, user) => {
      if (err) {
        res.status(400).json("error: " + err);
      }
      if (user) {
        if (user.otp == null) {
          sendMailer(user.email, user._id)
            .then((send) => {
              if (send) {
                res.status(200).json({
                  message: "Check your email for link!! Valid for 10 minutes.",
                });
              } else {
                res.status(424).json({
                  message: "Couldn't send OTP!!",
                });
              }
            })
            .catch((err) => {
              console.log(err);
            });
        } else {
          res.status(424).json({
            message: "We have already send the mail to you!!",
          });
        }
      }
      if (!user) {
        res.status(404).json({
          message: "No such user!!",
        });
      }
    }
  );
};

const setPass = (req, res) => {
  const para = new URLSearchParams(req.params.url);
  const otp = parseInt(para.get("otp"));
  const id = para.get("id");
  User.findOne(
    {
      _id: id,
    },
    (err, user) => {
      if (err) {
        res.status(400).json({
          message: "Link expired!!",
        });
      }
      if (user) {
        if (otp === user.otp) {
          res.status(200).json({
            message: "You are allowed to change your password!!",
          });
        } else {
          res.status(404).json({
            message: "Link expired!!",
          });
        }
      }
    }
  );
};

const postPass = (req, res) => {
  const id = new URLSearchParams(req.params.url).get("id");
  const { password } = req.body;
  bcrypt
    .hash(password, 10)
    .then((hash) => {
      User.updateOne(
        {
          _id: id,
        },
        { password: hash }
      ).then((result, err) => {
        if (result.modifiedCount === 1) {
          res.status(200).json({
            message: "Password changed!!",
          });
        } else {
          res.status(400).json("error: " + err);
        }
      });
    })
    .catch((err) =>
      res.json({
        message: "Couldn't change password!!",
      })
    );
};

const logout = (req, res) => {
  req.session.destroy(function (err) {
    if (err) {
      res.status(400).json({
        message: "Couldn't logout!!",
      });
    } else {
      res.clearCookie("isLogged");
      res.clearCookie("user");
      res.status(200).json({
        message: "Logout successful!!",
      });
    }
  });
};

module.exports = {
  signup,
  login,
  sendMailPass,
  setPass,
  postPass,
  logout,
};
