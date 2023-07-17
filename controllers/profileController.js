const User = require("../models/userModel");
const Design = require("../models/designModel");
const Billing = require("../models/billingModel");
const { encrypt, decrypt } = require("../utils/crypto");
const bcrypt = require("bcrypt");
const { cloudinary } = require("../utils/cloudinaryUpload");

const profileGet = (req, res) => {
  User.findOne({
    _id: req.params.id,
  })
    .populate("designs")
    .select("-password -cart -wishlist")
    .then((user) => {
      if (user) {
        res.json(user);
      } else {
        res.status(404).json({ message: "No such user!!" });
      }
    })
    .catch((err) => {
      res.status(500).json({ message: "Something went wrong!!" });
    });
};

const profileEdit = (req, res) => {
  var { picture, password, name, email, id } = req.body;
  if (id !== req.session.user._id) {
    res.json({
      message: "Unauthorized user!!",
    });
  }
  User.findOne({
    _id: id,
  })
    .then(async (user) => {
      if (user) {
        if (password === "" || password === undefined) {
          password = user.password;
        } else {
          password = await bcrypt.hash(password, 10);
        }
        if (user.picture.link !== picture) {
          await cloudinary.uploader.destroy(user.picture.id || "00");
          if (picture !== process.env.DEFAULT_IMG) {
            picture = await cloudinary.uploader.upload(picture, {
              upload_preset: "orderrr",
              folder: "Orderrr/Users",
              width: 200,
              height: 200,
              crop: "fill",
              gravity: "face",
            });
          }
        }
        User.updateOne(
          {
            _id: id,
          },
          {
            $set: {
              "picture.link": picture.secure_url || picture,
              "picture.id": picture.public_id,
            },
            email,
            username: name,
            password,
          }
        ).then((result) => {
          if (result.modifiedCount === 1) {
            res.json({
              message: "User updated!!",
              status: true,
              picture: picture.secure_url || picture || user.picture.link,
            });
          } else {
            res.json({
              message: "Nothing to update!!",
            });
          }
        });
      }
      if (!user) {
        res.json({
          message: "No such user!!",
        });
      }
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({
        message: "Something went wrong!!",
      });
    });
};
const cardGet = (req, res) => {
  Billing.find({
    owner: req.session.user._id,
  })
    .then((cards) => {
      cards.forEach((card) => {
        card.cardNumber = decrypt(card.cardNumber);
        card.nameOnCard = decrypt(card.nameOnCard);
      });
      res.json(cards);
    })
    .catch((err) =>
      res.status(500).json({
        message: "Something went wrong!!",
      })
    );
};

const cardEdit = (req, res) => {
  var { cardNumber, nameOnCard, cardName, id } = req.body;
  cardNumber = encrypt(cardNumber.toString());
  nameOnCard = encrypt(nameOnCard);
  Billing.findOne({
    _id: id,
  })
    .then((card) => {
      if (card) {
        Billing.updateOne(
          {
            _id: id,
          },
          {
            cardNumber,
            nameOnCard,
            cardName,
          }
        ).then((result) => {
          if (result.modifiedCount === 1) {
            res.json({
              message: "Card updated!!",
              id: id,
            });
          } else {
            res.json({
              message: "Nothing to update!!",
            });
          }
        });
      }
      if (!card) {
        if (id === "" || id === undefined) {
          Billing({
            cardNumber,
            nameOnCard,
            cardName,
            owner: req.session.user._id,
          })
            .save()
            .then((card) => {
              res.json({
                message: "Card Added!!",
                id: card._id,
              });
            })
            .catch((err) =>
              res.status(500).json({
                message: "Something went wrong!!",
              })
            );
        } else {
          res.json({
            message: "Invalid ID!!",
          });
        }
      }
    })
    .catch((err) => {
      res.status(500).json({
        message: "Something went wrong!!",
      });
    });
};

const cardDelete = (req, res) => {
  const { id } = req.body;
  Billing.deleteOne({
    _id: id,
    owner: req.session.user._id,
  })
    .then((result) => {
      if (result.deletedCount === 1) {
        res.json({
          message: "Card deleted!!",
          deleted: true,
        });
      } else {
        res.json({
          message: "Unauthorized user!!",
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
  profileGet,
  profileEdit,
  cardGet,
  cardEdit,
  cardDelete,
};
