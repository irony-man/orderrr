const User = require("../models/userModel");
const Design = require("../models/designModel");
const mongoose = require('mongoose');

const cartAdd = (req, res) => {
  const {
    id
  } = req.body;
  Design.findOne({
      _id: id,
    })
    .then(async (design) => {
      if (design) {
        const user = await User.findOne({
          cart: {
            $in: id
          },
          _id: req.session.user._id
        })
        if (user) {
          res.json({
            message: "Already in the cart!!"
          })
        } else {
          await User.updateOne({
            email: req.session.user.email,
          }, {
            $push: {
              cart: design,
            },
          });
          res.json({
            design: design,
            message: "Added to cart!!"
          });
        }
      }
      if (!design) {
        res.json({
          message: "No such product!!",
        });
      }
    })
    .catch((err) => {
      res.status(500).json({
        message: "Something went wrong!!",
      });
    });
};

const cartRemove = (req, res) => {
  const {
    id
  } = req.body;
  User.updateOne({
      email: req.session.user.email,
    }, {
      $pull: {
        cart: id,
      },
    })
    .then((result) => {
      if (result.modifiedCount === 1) {
        res.json({
          message: "Item removed from the cart!!",
        });
      } else {
        res.json({
          message: "Item not in cart!!",
        });
      }
    })
    .catch((err) => {
      res.status(500).json({
        message: "Something went wrong!!",
      });
    });
};

const wishAddRem = (req, res) => {
  const {
    id
  } = req.body;
  Design.findOne({
      _id: id,
    })
    .then(async (design) => {
      if (design) {
        const user = await User.findOne({
          wishlist: {
            $in: id
          },
          _id: req.session.user._id
        })
        if (user) {
          await User.updateOne({
            email: req.session.user.email,
          }, {
            $pull: {
              wishlist: id,
            },
          })
          res.json({
            removed: true,
            message: "Removed from the wishlist!!"
          })
        } else {
          await User.updateOne({
            email: req.session.user.email,
          }, {
            $push: {
              wishlist: design,
            },
          });
          res.json({
            design: design,
            message: "Added to wishlist!!"
          });
        }
      }
      if (!design) {
        res.json({
          message: "No such product!!",
        });
      }
    })
    .catch((err) => {
      res.status(500).json({
        message: "Something went wrong!!",
      });
    });
};

module.exports = {
  cartAdd,
  cartRemove,
  wishAddRem,
};